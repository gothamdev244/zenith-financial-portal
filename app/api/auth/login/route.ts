import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl, authMethods } from '@/lib/workos';

export async function GET(request: NextRequest) {
  try {
    // Get provider from query params (default to email/password)
    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get('provider') || authMethods.emailPassword;

    // Generate state for CSRF protection
    const state = Math.random().toString(36).substring(7);

    // Get WorkOS authorization URL
    const authUrl = getAuthorizationUrl(provider as any, state);

    // Redirect to WorkOS
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate login' },
      { status: 500 }
    );
  }
}
