import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData } from '@/lib/session';

const sessionOptions = {
  password: process.env.WORKOS_COOKIE_PASSWORD as string,
  cookieName: 'zenith_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
};

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/api/auth/login', '/api/auth/callback'];

// Role-based route protection
const roleRoutes = {
  admin: ['/admin'],
  advisor: ['/advisor'],
  client: ['/client'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get session
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions
  );

  // Check if user is authenticated
  if (!session.isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const userRole = session.role;

  // Admin can access everything
  if (userRole === 'admin') {
    return response;
  }

  // Check if user is trying to access routes for their role
  for (const [role, routes] of Object.entries(roleRoutes)) {
    if (routes.some((route) => pathname.startsWith(route))) {
      if (userRole !== role) {
        // Redirect to appropriate dashboard
        const dashboardUrl = new URL(`/${userRole}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
