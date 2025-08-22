import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session');
  return sessionToken?.value === 'authenticated';
}

// Create a new session
export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

// Clear the session
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

// Require authentication (redirects to login if not authenticated)
export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }
}

// Get current user info
export async function getCurrentUser(): Promise<{ username: string; isAuthenticated: boolean }> {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    return { 
      username: 'admin', 
      isAuthenticated: true 
    };
  }
  return { 
    username: '', 
    isAuthenticated: false 
  };
}

// Validate login credentials
export function validateCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  return username === adminUsername && password === adminPassword;
}
