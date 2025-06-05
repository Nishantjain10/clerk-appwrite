'use client';

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useAppwrite } from "@/hooks/useAppwrite";
import DisplayCards from "@/components/ui/display-cards";
import { Database, FunctionSquare, HardDrive, Lock, MessageSquare, Globe2, Radio } from "lucide-react";

export default function DashboardPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { isAppwriteReady, appwriteError, retry } = useAppwrite();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isSignedIn, router]);

  if (!isSignedIn || !user) {
    return null;
  }

  if (isLoading || !isAppwriteReady) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
            Clerk + Appwrite Integration Demo
          </p>
          <div className="fixed right-0 top-0 p-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Centered loading spinner */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md mx-auto">
            <div className="relative mx-auto h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (appwriteError) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
            Clerk + Appwrite Integration Demo
          </p>
          <div className="fixed right-0 top-0 p-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center p-8 max-w-md mx-auto bg-card rounded-xl shadow-lg">
            <div className="text-red-500 text-2xl mb-4">⚠️</div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Connection Error</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">{appwriteError}</p>
            <button
              onClick={retry}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const appwriteFeatures = [
    {
      icon: <Lock className="size-5 text-blue-300" />,
      title: "Auth",
      description: "Secure login with multi-factor auth",
      date: "Ready to use",
      iconClassName: "text-blue-700",
      titleClassName: "text-blue-900",
      url: "https://appwrite.io/docs/products/auth",
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Database className="size-5 text-blue-400" />,
      title: "Databases",
      description: "Scalable and robust databases",
      date: "Ready to use",
      iconClassName: "text-blue-700",
      titleClassName: "text-blue-900",
      url: "https://appwrite.io/docs/products/databases",
      className: "[grid-area:stack] translate-x-8 translate-y-8 hover:-translate-y-2 sm:translate-x-12 sm:translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <HardDrive className="size-5 text-blue-300" />,
      title: "Storage",
      description: "Advanced compression and encryption",
      date: "Ready to use",
      iconClassName: "text-blue-700",
      titleClassName: "text-blue-900",
      url: "https://appwrite.io/docs/products/storage",
      className: "[grid-area:stack] translate-x-16 translate-y-16 hover:translate-y-6 sm:translate-x-24 sm:translate-y-20 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <FunctionSquare className="size-5 text-blue-300" />,
      title: "Functions",
      description: "Deploy & scale serverless functions",
      date: "Available now",
      iconClassName: "text-blue-700",
      titleClassName: "text-blue-900",
      url: "https://appwrite.io/docs/products/functions",
      className: "[grid-area:stack] translate-x-24 translate-y-24 hover:translate-y-14 sm:translate-x-36 sm:translate-y-30 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <MessageSquare className="size-5 text-blue-300" />,
      title: "Messaging",
      description: "Set up a full-functioning messaging service",
      date: "Available now",
      iconClassName: "text-blue-700",
      titleClassName: "text-blue-900",
      url: "https://appwrite.io/docs/products/messaging",
      className: "[grid-area:stack] translate-x-32 translate-y-32 hover:translate-y-22 sm:translate-x-48 sm:translate-y-40 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Globe2 className="size-5 text-blue-300" />,
      title: "Sites",
      description: "The open-source Vercel alternative",
      date: "Ready to use",
      iconClassName: "text-blue-700",
      titleClassName: "text-blue-900",
      url: "https://appwrite.io/products/sites",
      className: "[grid-area:stack] translate-x-40 translate-y-40 hover:translate-y-30 sm:translate-x-60 sm:translate-y-50 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Radio className="size-5 text-blue-300" />,
      title: "Realtime",
      description: "Subscribe and react to any event",
      date: "Ready to use",
      iconClassName: "text-blue-700",
      titleClassName: "text-blue-900",
      url: "https://appwrite.io/docs/apis/realtime",
      className: "[grid-area:stack] translate-x-48 translate-y-48 hover:translate-y-38 sm:translate-x-72 sm:translate-y-60 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          Clerk + Appwrite Integration Demo
        </p>
        <div className="fixed right-0 top-0 p-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <main className="pt-22">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-background pt-16 pb-80">
          <div className="absolute inset-0 bg-grid-slate-400/[0.05] bg-[size:75px_75px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          
          <div className="container relative mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center mb-16">
              <div className="max-w-3xl w-full">
                <h1 className="font-mono text-2xl tracking-tight mb-4">
                  Hey{" "}
                  <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-transparent bg-clip-text font-medium">
                    {user.firstName}
                  </span>
                  ,{" "}
                  <span className="text-muted-foreground/100">
                    You&apos;re logged in!
                  </span>
                </h1>
                <p className="text-base text-muted-foreground/80 mx-auto max-w-2xl font-mono">
                  Get started with appwrite backend services.{" "}
                </p>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="relative mt-40">
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent"></div>
              <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-500 to-cyan-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
              </div>
              
              <div className="mx-auto max-w-7xl pr-20">
                <DisplayCards cards={appwriteFeatures} />
              </div>

              <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-500 to-cyan-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 