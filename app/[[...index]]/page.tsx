'use client';

import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useAppwrite } from "@/hooks/useAppwrite";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          Clerk + Appwrite Integration Demo
        </p>
        <div className="fixed right-0 top-0 p-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <SignedOut>
          <SignIn routing="hash" afterSignInUrl="/dashboard" />
        </SignedOut>
        <SignedIn>
          <AppwriteProtectedComponent />
        </SignedIn>
      </div>
    </main>
  );
}

function AppwriteProtectedComponent() {
  const router = useRouter();
  const { isAppwriteReady } = useAppwrite();

  useEffect(() => {
    if (!isAppwriteReady) {
      router.push('/dashboard');
    }
  }, [isAppwriteReady, router]);

  return null;
} 