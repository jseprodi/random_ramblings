import { NextRequest, NextResponse } from 'next/server';
import { getPost, updatePost, deletePost } from '@/lib/db';

// GET: Retrieve a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);

  } catch (error) {
    console.error('Error reading post:', error);
    return NextResponse.json(
      { error: 'Failed to read post' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, description, content, tags, author, date, status } = body;

    // Validate required fields
    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await getPost(slug);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      title,
      description: description || '',
      date: date || new Date().toISOString().split('T')[0],
      author,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      status: status || 'draft',
      content,
    };

    // Update post in database
    const success = await updatePost(slug, updateData);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update post in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post updated successfully'
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Check if post exists
    const existingPost = await getPost(slug);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete post from database
    const success = await deletePost(slug);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete post from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
