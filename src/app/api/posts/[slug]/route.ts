import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// GET: Retrieve a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const postsDirectory = path.join(process.cwd(), 'src/content/blog');
    const filePath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return NextResponse.json({
      ...data,
      content,
      slug
    });

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

    const postsDirectory = path.join(process.cwd(), 'src/content/blog');
    const filePath = path.join(postsDirectory, `${slug}.md`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Create frontmatter
    const frontmatter = matter.stringify(content, {
      title,
      description: description || '',
      date: date || new Date().toISOString().split('T')[0],
      author,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      status: status || 'draft'
    });

    // Write the updated file
    fs.writeFileSync(filePath, frontmatter, 'utf8');

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
    const postsDirectory = path.join(process.cwd(), 'src/content/blog');
    const filePath = path.join(postsDirectory, `${slug}.md`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Delete the file
    fs.unlinkSync(filePath);

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
