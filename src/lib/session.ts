import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { UserRole } from '@/types/database';

export interface SessionData {
  workosUserId: string;
  email: string;
  fullName: string;
  role: UserRole;
  userId: number; // Our database user ID
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.WORKOS_COOKIE_PASSWORD as string,
  cookieName: 'zenith_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Get the current session
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

/**
 * Get the current user from session
 */
export async function getCurrentUser(): Promise<SessionData | null> {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return null;
  }

  return {
    workosUserId: session.workosUserId,
    email: session.email,
    fullName: session.fullName,
    role: session.role,
    userId: session.userId,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    isLoggedIn: session.isLoggedIn,
  };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true;
}

/**
 * Check if user has required role
 */
export async function hasRole(requiredRole: UserRole | UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(user.role);
}

/**
 * Destroy session (logout)
 */
export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

/**
 * Create session for user
 */
export async function createSession(data: Omit<SessionData, 'isLoggedIn'>): Promise<void> {
  const session = await getSession();

  session.workosUserId = data.workosUserId;
  session.email = data.email;
  session.fullName = data.fullName;
  session.role = data.role;
  session.userId = data.userId;
  session.accessToken = data.accessToken;
  session.refreshToken = data.refreshToken;
  session.isLoggedIn = true;

  await session.save();
}
