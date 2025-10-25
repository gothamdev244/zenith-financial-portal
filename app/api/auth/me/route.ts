import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Don't send tokens to client
    const { accessToken, refreshToken, ...safeUser } = user;

    return NextResponse.json({
      authenticated: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
