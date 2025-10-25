import { NextRequest, NextResponse } from 'next/server';
import { authenticateWithCode } from '@/lib/workos';
import { createSession } from '@/lib/session';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    // Authenticate with WorkOS
    const { user, accessToken, refreshToken } = await authenticateWithCode(code);

    // Check if user exists in our database, create if not
    let dbUser = await query(
      'SELECT id, email, full_name, role FROM users WHERE email = $1',
      [user.email]
    );

    if (dbUser.rows.length === 0) {
      // Create new user in our database
      // Default role is 'client' - admins can change this later
      const newUser = await query(
        `INSERT INTO users (email, password_hash, full_name, role, email_verified, active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, full_name, role`,
        [
          user.email,
          'workos_managed', // Password managed by WorkOS
          `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          'client',
          user.emailVerified,
          true,
        ]
      );

      dbUser = newUser;
    }

    const userData = dbUser.rows[0];

    // Create session
    await createSession({
      workosUserId: user.id,
      email: userData.email,
      fullName: userData.full_name,
      role: userData.role,
      userId: userData.id,
      accessToken,
      refreshToken: refreshToken || '',
    });

    // Update last login
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [
      userData.id,
    ]);

    // Redirect based on role
    let redirectUrl = '/dashboard';
    if (userData.role === 'admin') {
      redirectUrl = '/admin/dashboard';
    } else if (userData.role === 'advisor') {
      redirectUrl = '/advisor/dashboard';
    } else {
      redirectUrl = '/client/dashboard';
    }

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error: any) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=authentication_failed', request.url)
    );
  }
}
