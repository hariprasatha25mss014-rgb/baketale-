/* ==========================================================================
   BAKETALE — FULL SITE SECURITY MIDDLEWARE
   Security headers, anti-clickjacking, CSP, CSRF, and traversal defense
   ========================================================================== */

import { NextResponse } from 'next/server';

// Suspicious URL patterns indicative of vulnerability scanning
const SUSPICIOUS_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/\.svn/i,
  /\/\.aws/i,
  /\.php$/i,
  /wp-admin/i,
  /wp-login/i,
  /\/\.\./,       // directory traversal
  /<script>/i,    // raw script tags in path
  /etc\/passwd/i
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 0. Skip internal Next.js paths immediately
  if (pathname.startsWith('/_next') || pathname.startsWith('/assets') || pathname.startsWith('/seq') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // 1. Defend against path traversal & vulnerability scanners
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Access Denied: Malicious pattern detected', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }

  // 2. CSRF / Origin Verification for State-Mutating API calls
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        // Allow same-origin or localhost
        if (originUrl.host !== host && !originUrl.host.includes('localhost') && !originUrl.host.includes('127.0.0.1')) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'CSRF_BLOCKED',
                message: 'Cross-site request blocked.'
              }
            },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ORIGIN',
              message: 'Invalid origin header.'
            }
          },
          { status: 400 }
        );
      }
    }
  }

  const response = NextResponse.next();

  // 3. Comprehensive Site Security Headers (permitting WebSocket HMR in dev)
  const isDev = process.env.NODE_ENV !== 'production';
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    isDev ? "connect-src 'self' ws: wss: http: https: *" : "connect-src 'self' https://ig.me https://instagram.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://ig.me https://instagram.com"
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|assets|seq).*)',
  ],
};
