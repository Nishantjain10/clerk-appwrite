'use client';

import { useAuth } from "@clerk/nextjs";
import { useAppwrite } from "@/hooks/useAppwrite";
import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { Models } from 'appwrite';

const ErrorMessage = () => (
  <div>
    <p>{`Failed to get Clerk token. Please ensure the "Appwrite" template is created in Clerk dashboard with the following claims:`}</p>
    <pre className="mt-2 bg-gray-900 text-blue-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
{`{
  "aud": [
    "appwrite"
  ],
  "name": "{{user.first_name}} {{user.last_name}}",
  "email": "{{user.primary_email_address}}",
  "userId": "{{user.id}}"
}`}
    </pre>
    <p>{`If you just created the template, please wait a few seconds and click "Retry Token" below.`}</p>
  </div>
);

export default function TestPage() {
  const { isSignedIn, getToken } = useAuth();
  const { isAppwriteReady, appwriteError, retry } = useAppwrite();
  const [clerkToken, setClerkToken] = useState<string | null>(null);
  const [appwriteSession, setAppwriteSession] = useState<Models.User<Models.Preferences> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const router = useRouter();

  // Fetch and display Clerk token
  useEffect(() => {
    async function fetchToken() {
      if (!isSignedIn) return;
      
      setIsLoadingToken(true);
      setError(null);
      
      try {
        // Add a small delay to ensure the JWT template is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const token = await getToken({
          template: "Appwrite",
          skipCache: true
        });
        
        if (!token) {
          throw new Error("No token returned");
        }
        
        setClerkToken(token);
        setError(null);
      } catch (err) {
        console.error('Token error:', err);
        setError('error');
      } finally {
        setIsLoadingToken(false);
      }
    }

    fetchToken();
  }, [isSignedIn, getToken]);

  // Get Appwrite session info when ready
  useEffect(() => {
    async function getAppwriteSession() {
      if (isAppwriteReady) {
        try {
          const session = await account.get();
          setAppwriteSession(session);
        } catch (err) {
          console.error('Failed to get Appwrite session:', err);
        }
      }
    }
    getAppwriteSession();
  }, [isAppwriteReady]);

  const handleRetryToken = async () => {
    setClerkToken(null);
    setError(null);
    setIsLoadingToken(true);
    
    try {
      const token = await getToken({
        template: "Appwrite",
        skipCache: true
      });
      setClerkToken(token);
    } catch (err) {
      console.error('Retry token error:', err);
      setError('Failed to get token on retry. Please ensure the template is correctly configured.');
    } finally {
      setIsLoadingToken(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h1>
          <p className="text-gray-600">You need to be signed in to test the integration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-2">Clerk-Appwrite Integration Test</h1>
            <p className="text-blue-100">Verifying your integration setup...</p>
          </div>

          <div className="p-8">
            {/* Instructions for JWT Template */}
            <section className="mb-8 bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
              <div className="bg-blue-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-blue-900">JWT Template Setup Instructions</h2>
              </div>
              <div className="p-6">
                <ol className="list-decimal ml-4 space-y-4">
                  <li className="text-gray-700">Name the template: <code className="bg-blue-100 px-2 py-1 rounded text-blue-900 font-mono">Appwrite</code></li>
                  <li className="text-gray-700">Add these claims:
                    <pre className="mt-2 bg-gray-900 text-blue-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
{`{
  "aud": [
    "appwrite"
  ],
  "name": "{{user.first_name}} {{user.last_name}}",
  "email": "{{user.primary_email_address}}",
  "userId": "{{user.id}}"
}`}
                    </pre>
                  </li>
                  <li className="text-gray-700">Set Token lifetime: <code className="bg-blue-100 px-2 py-1 rounded text-blue-900 font-mono">60</code> seconds</li>
                  <li className="text-gray-700">Set Allowed clock skew: <code className="bg-blue-100 px-2 py-1 rounded text-blue-900 font-mono">3</code> seconds</li>
                  <li className="text-gray-600 text-sm italic">Note: Keep "Custom signing key" disabled to use the default private key</li>
                </ol>
              </div>
            </section>

            {/* Status Sections */}
            <div className="grid gap-8">
              {/* Clerk Status */}
              <section className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Clerk Status</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="font-medium text-gray-900 mr-2">Signed In:</span>
                    <span className={isSignedIn ? "text-emerald-800 font-medium" : "text-red-800 font-medium"}>
                      {isSignedIn ? "Yes" : "No"}
                    </span>
                  </div>

                  {isLoadingToken && (
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-800 rounded-full border-t-transparent"></div>
                      <span className="text-gray-900">Loading token...</span>
                    </div>
                  )}

                  {clerkToken && (
                    <div className="mt-4">
                      <p className="font-medium text-gray-900 mb-2">Clerk Token:</p>
                      <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
                        {clerkToken}
                      </pre>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4">
                      <ErrorMessage />
                      <button
                        onClick={handleRetryToken}
                        disabled={isLoadingToken}
                        className="mt-4 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoadingToken ? 'Retrying...' : 'Retry Token'}
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Appwrite Status */}
              <section className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Appwrite Status</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="font-medium text-gray-900 mr-2">Connection Ready:</span>
                    <span className={isAppwriteReady ? "text-emerald-800 font-medium" : "text-red-800 font-medium"}>
                      {isAppwriteReady ? "Yes" : "No"}
                    </span>
                  </div>

                  {appwriteError && (
                    <div className="mt-4">
                      <p className="font-medium text-red-800 mb-2">Error:</p>
                      <pre className="bg-red-50 text-red-900 p-4 rounded-lg mt-2 text-sm">
                        {appwriteError}
                      </pre>
                      <button
                        onClick={retry}
                        className="mt-4 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                      >
                        Retry Connection
                      </button>
                    </div>
                  )}

                  {appwriteSession && (
                    <div className="mt-4">
                      <p className="font-medium text-gray-900 mb-2">Appwrite Session:</p>
                      <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
                        {JSON.stringify(appwriteSession, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </section>

              {/* Environment Check */}
              <section className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Environment Variables Check</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="font-medium text-gray-900 mr-2">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</span>
                      <span className={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "text-emerald-800 font-medium" : "text-red-800 font-medium"}>
                        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "Set" : "Not Set"}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium text-gray-900 mr-2">NEXT_PUBLIC_APPWRITE_ENDPOINT:</span>
                      <span className={process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ? "text-emerald-800 font-medium" : "text-red-800 font-medium"}>
                        {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ? "Set" : "Not Set"}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium text-gray-900 mr-2">NEXT_PUBLIC_APPWRITE_PROJECT_ID:</span>
                      <span className={process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ? "text-emerald-800 font-medium" : "text-red-800 font-medium"}>
                        {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ? "Set" : "Not Set"}
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Success Message */}
            {isSignedIn && isAppwriteReady && clerkToken && !error && !isLoadingToken && (
              <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                <p className="text-emerald-900 font-medium mb-4">🎉 Integration successful!</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 