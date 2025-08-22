import { NextRequest, NextResponse } from 'next/server';
import { createSession, validateCredentials } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (validateCredentials(username, password)) {
      await createSession();
      
      // Return user data along with success message
      return NextResponse.json(
        { 
          success: true, 
          message: 'Login successful',
          user: {
            username: username,
            isAuthenticated: true
          }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
