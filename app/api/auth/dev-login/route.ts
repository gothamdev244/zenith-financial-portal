import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';
import { query } from '@/lib/db';

/**
 * Development-only login endpoint
 * Allows direct login without WorkOS for testing
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Dev login not available in production' },
      { status: 403 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Get user from database
    const result = await query(
      'SELECT id, email, full_name, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Create session
    await createSession({
      workosUserId: `dev_${user.id}`,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      userId: user.id,
      accessToken: 'dev_token',
      refreshToken: 'dev_refresh_token',
    });

    // Update last login
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [
      user.id,
    ]);

    // Return success with redirect URL
    let redirectUrl = '/dashboard';
    if (user.role === 'admin') {
      redirectUrl = '/admin/dashboard';
    } else if (user.role === 'advisor') {
      redirectUrl = '/advisor/dashboard';
    } else {
      redirectUrl = '/client/dashboard';
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      redirectUrl,
    });
  } catch (error: any) {
    console.error('Dev login error:', error);
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
}
