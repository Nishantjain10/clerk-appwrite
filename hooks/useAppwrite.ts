import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { client, account } from '@/lib/appwrite';

interface AppwriteState {
  isReady: boolean;
  error: string | null;
}

export function useAppwrite() {
  const { isSignedIn } = useAuth();
  const [state, setState] = useState<AppwriteState>({
    isReady: false,
    error: null,
  });

  useEffect(() => {
    async function initializeAppwrite() {
      if (!isSignedIn) {
        setState({
          isReady: false,
          error: null,
        });
        return;
      }

      try {
        // First check if we already have a session
        try {
          const currentSession = await account.get();
          if (currentSession.$id) {
            setState({
              isReady: true,
              error: null,
            });
            return;
          }
        } catch (error) {
          // No active session, proceed with creating one
        }

        // Create an anonymous session in Appwrite
        await account.createAnonymousSession();
        setState({
          isReady: true,
          error: null,
        });
      } catch (error) {
        console.error('Failed to initialize Appwrite:', error);
        setState({
          isReady: false,
          error: error instanceof Error ? error.message : 'Failed to initialize Appwrite',
        });
      }
    }

    initializeAppwrite();

    // Cleanup function to delete the session when the component unmounts
    // or when the user signs out
    return () => {
      if (state.isReady) {
        account.deleteSession('current')
          .catch(error => console.error('Failed to delete Appwrite session:', error));
      }
    };
  }, [isSignedIn]);

  // Function to manually retry initialization
  const retry = async () => {
    // Delete any existing session first
    try {
      await account.deleteSession('current');
    } catch (error) {
      // Ignore error if no session exists
    }
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    isAppwriteReady: state.isReady,
    appwriteError: state.error,
    retry,
  };
} 