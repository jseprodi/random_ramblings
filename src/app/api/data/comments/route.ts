import { NextResponse } from 'next/server';
import { getComments } from '@/lib/db';

export async function GET() {
  try {
    const comments = await getComments();
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    );
  }
}
