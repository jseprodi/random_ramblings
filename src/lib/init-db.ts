import { kv } from '@vercel/kv';
import { DB_KEYS } from './db';

export async function initializeDatabase() {
  try {
    // Check if database is already initialized
    const existingPosts = await kv.get(DB_KEYS.POSTS);
    if (existingPosts && Object.keys(existingPosts).length > 0) {
      console.log('Database already initialized');
      return;
    }

    // Create sample post
    const samplePost = {
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
    await kv.set(DB_KEYS.POSTS, {
      'welcome-to-js-blog': samplePost
    });

    // Initialize empty comments
    await kv.set(DB_KEYS.COMMENTS, {});

    // Initialize empty images
    await kv.set(DB_KEYS.IMAGES, {});

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run initialization if this file is executed directly
if (typeof window === 'undefined') {
  initializeDatabase();
}
