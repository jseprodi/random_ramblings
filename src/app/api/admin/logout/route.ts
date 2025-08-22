import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth-server';

export async function POST() {
  try {
    await clearSession();
    
    return NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
