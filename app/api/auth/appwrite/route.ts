import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the Clerk session token
    const session = await auth();
    const token = await session.getToken({
      template: "appwrite" // Optional: if you have a specific JWT template for Appwrite
    });

    if (!token || !session.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Return the Clerk token and user ID
    return NextResponse.json({
      clerkToken: token,
      userId: session.userId,
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 