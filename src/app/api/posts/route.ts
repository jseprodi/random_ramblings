import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, tags, author, date, status } = body;

    // Validate required fields
    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Prepare post data
    const postData = {
      title,
      description: description || '',
      date: date || new Date().toISOString().split('T')[0],
      author,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      status: status || 'draft',
      content,
    };

    // Create post in database
    const success = await createPost(slug, postData);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create post in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post created successfully'
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
