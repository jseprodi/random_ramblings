import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

    // Create frontmatter
    const frontmatter = matter.stringify(content, {
      title,
      description: description || '',
      date: date || new Date().toISOString().split('T')[0],
      author,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      status: status || 'draft'
    });

    // Ensure the blog directory exists
    const postsDirectory = path.join(process.cwd(), 'src/content/blog');
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    // Create the markdown file
    const filePath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 409 }
      );
    }

    // Write the file
    fs.writeFileSync(filePath, frontmatter, 'utf8');

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
