import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Skip middleware in development mode to improve performance
  if (process.env.NODE_ENV === 'development' && !process.env.ENFORCE_AUTH_IN_DEV) {
    return response;
  }
  
  // Don't run middleware on /api routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return response;
  }
  
  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session, redirect to login for protected routes
    if (!session && request.nextUrl.pathname.startsWith('/admin')) {
      // Only redirect if not already on login or signup pages
      if (!request.nextUrl.pathname.includes('/login') && 
          !request.nextUrl.pathname.includes('/signup') &&
          !request.nextUrl.pathname.includes('/fix-accounts')) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
  }
  
  return response;
}

export const config = {
  matcher: ['/admin/:path*']
}; 