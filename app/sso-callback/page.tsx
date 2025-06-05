'use client';

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        await handleRedirectCallback({
          afterSignInUrl: "/test",  // Redirect to test page after successful sign in
          afterSignUpUrl: "/test",  // Redirect to test page after successful sign up
        });
      } catch (err) {
        console.error("OAuth error:", err);
        // Redirect to home page if there's an error
        router.push("/");
      }
    }

    handleCallback();
  }, [handleRedirectCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Processing your sign in...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 