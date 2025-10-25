import { WorkOS } from '@workos-inc/node';

// Initialize WorkOS client
export const workos = new WorkOS(process.env.WORKOS_API_KEY);

export const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID || '';
export const WORKOS_REDIRECT_URI = process.env.WORKOS_REDIRECT_URI || '';

// WorkOS authentication methods
export const authMethods = {
  // Email/Password authentication
  emailPassword: 'password',
  // Magic Link (passwordless)
  magicLink: 'MagicLink',
  // Google OAuth
  google: 'GoogleOAuth',
  // Microsoft OAuth
  microsoft: 'MicrosoftOAuth',
} as const;

export type AuthMethod = typeof authMethods[keyof typeof authMethods];

/**
 * Get authorization URL for WorkOS authentication
 * @param provider - Authentication provider (password, MagicLink, GoogleOAuth, etc.)
 * @param state - Optional state parameter for CSRF protection
 */
export function getAuthorizationUrl(
  provider: AuthMethod = authMethods.emailPassword,
  state?: string
): string {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider,
    clientId: WORKOS_CLIENT_ID,
    redirectUri: WORKOS_REDIRECT_URI,
    state,
  });

  return authorizationUrl;
}

/**
 * Authenticate user with authorization code
 * @param code - Authorization code from WorkOS callback
 */
export async function authenticateWithCode(code: string) {
  try {
    const { user, accessToken, refreshToken } =
      await workos.userManagement.authenticateWithCode({
        clientId: WORKOS_CLIENT_ID,
        code,
      });

    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error('WorkOS authentication error:', error);
    throw new Error('Authentication failed');
  }
}

/**
 * Get user info from WorkOS
 * @param accessToken - User's access token
 */
export async function getUser(accessToken: string) {
  try {
    const user = await workos.userManagement.getUser({
      accessToken,
    });
    return user;
  } catch (error) {
    console.error('Failed to get user from WorkOS:', error);
    return null;
  }
}

/**
 * Refresh user's access token
 * @param refreshToken - User's refresh token
 */
export async function refreshAccessToken(refreshToken: string) {
  try {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await workos.userManagement.authenticateWithRefreshToken({
        clientId: WORKOS_CLIENT_ID,
        refreshToken,
      });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
}

/**
 * Create a new user (for email/password authentication)
 * @param email - User's email
 * @param password - User's password
 * @param firstName - User's first name
 * @param lastName - User's last name
 */
export async function createUser(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) {
  try {
    const user = await workos.userManagement.createUser({
      email,
      password,
      firstName,
      lastName,
      emailVerified: false, // Require email verification
    });

    return user;
  } catch (error: any) {
    console.error('Failed to create user:', error);
    throw new Error(error.message || 'User creation failed');
  }
}

/**
 * Send password reset email
 * @param email - User's email
 */
export async function sendPasswordResetEmail(email: string) {
  try {
    await workos.userManagement.sendPasswordResetEmail({
      email,
      passwordResetUrl: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

/**
 * Reset user password
 * @param token - Password reset token
 * @param newPassword - New password
 */
export async function resetPassword(token: string, newPassword: string) {
  try {
    await workos.userManagement.resetPassword({
      token,
      newPassword,
    });
    return true;
  } catch (error) {
    console.error('Failed to reset password:', error);
    return false;
  }
}
