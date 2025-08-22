import { NextRequest, NextResponse } from 'next/server';
import { addComment, getCommentsForPost, getAllComments } from '@/lib/comments';

// POST: Submit a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, author, email, content } = body;

    // Validate required fields
    if (!postSlug || !author || !email || !content) {
      return NextResponse.json(
        { error: 'Post slug, author, email, and content are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Add the comment
    const newComment = addComment({
      postSlug,
      author: author.trim(),
      email: email.trim().toLowerCase(),
      content: content.trim(),
      ipAddress,
      userAgent
    });

    return NextResponse.json(newComment);

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}

// GET: Get comments for a specific post OR all comments for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');

    if (postSlug) {
      // Return comments for a specific post (filtered to approved only)
      const comments = getCommentsForPost(postSlug);
      return NextResponse.json(comments);
    } else {
      // Return all comments for admin use (including pending/rejected)
      const allComments = getAllComments();
      return NextResponse.json(allComments);
    }

  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    );
  }
}
