import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

export async function GET() {
  // Support GET for simple logout links
  try {
    await destroySession();
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || ''));
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/login?error=logout_failed', process.env.NEXT_PUBLIC_APP_URL || ''));
  }
}
