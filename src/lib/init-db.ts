import { put } from '@vercel/blob';
import { BLOB_KEYS } from './db';

export async function initializeDatabase() {
  try {
    // Create sample post
    const samplePost = {
      slug: 'welcome-to-js-blog',
      title: "Welcome to JS Blog",
      description: "A sample blog post to get you started",
      date: "2025-01-15",
      author: "Admin",
      tags: ["welcome", "sample"],
      status: "published",
      content: `# Welcome to JS Blog!

This is a sample blog post to get you started. You can edit this post or create new ones through the admin panel.

## Features

- **Markdown Support**: Write your posts in Markdown
- **Admin Panel**: Manage posts, comments, and images
- **Search**: Find posts easily with the search functionality
- **Responsive Design**: Works on all devices

## Getting Started

1. Edit this post or create a new one
2. Use the admin panel to manage your content
3. Upload images to enhance your posts
4. Moderate comments from your readers

Happy blogging!`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Initialize posts
    const postsBlob = await put(BLOB_KEYS.POSTS, JSON.stringify({
      'welcome-to-js-blog': samplePost
    }), {
      access: 'public',
      addRandomSuffix: false,
    });

    // Initialize empty comments
    const commentsBlob = await put(BLOB_KEYS.COMMENTS, JSON.stringify({}), {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log('Database initialized successfully');
    console.log('Posts URL:', postsBlob.url);
    console.log('Comments URL:', commentsBlob.url);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run initialization if this file is executed directly
if (typeof window === 'undefined') {
  initializeDatabase();
}
