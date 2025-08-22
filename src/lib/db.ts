import { kv } from '@vercel/kv';

// Types
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  status: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  ipAddress?: string;
}

// Database keys
export const DB_KEYS = {
  POSTS: 'posts',
  COMMENTS: 'comments',
  IMAGES: 'images',
  USERS: 'users',
} as const;

// Helper functions for database operations
export async function getPosts(): Promise<BlogPost[]> {
  try {
    const posts = await kv.get(DB_KEYS.POSTS) as Record<string, BlogPost> | null;
    return posts ? Object.values(posts) : [];
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await kv.get(DB_KEYS.POSTS) as Record<string, BlogPost> | null;
    return posts?.[slug] || null;
  } catch (error) {
    console.error('Error getting post:', error);
    return null;
  }
}

export async function createPost(slug: string, postData: Omit<BlogPost, 'slug' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
  try {
    const posts = await kv.get(DB_KEYS.POSTS) as Record<string, BlogPost> | null || {};
    posts[slug] = {
      ...postData,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await kv.set(DB_KEYS.POSTS, posts);
    return true;
  } catch (error) {
    console.error('Error creating post:', error);
    return false;
  }
}

export async function updatePost(slug: string, postData: Partial<Omit<BlogPost, 'slug' | 'createdAt' | 'updatedAt'>>): Promise<boolean> {
  try {
    const posts = await kv.get(DB_KEYS.POSTS) as Record<string, BlogPost> | null || {};
    if (!posts[slug]) {
      return false;
    }
    posts[slug] = {
      ...posts[slug],
      ...postData,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(DB_KEYS.POSTS, posts);
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

export async function deletePost(slug: string): Promise<boolean> {
  try {
    const posts = await kv.get(DB_KEYS.POSTS) as Record<string, BlogPost> | null || {};
    if (!posts[slug]) {
      return false;
    }
    delete posts[slug];
    await kv.set(DB_KEYS.POSTS, posts);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

export async function getComments(): Promise<Comment[]> {
  try {
    const comments = await kv.get(DB_KEYS.COMMENTS) as Record<string, Comment> | null;
    return comments ? Object.values(comments) : [];
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
}

export async function createComment(commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<boolean> {
  try {
    const comments = await kv.get(DB_KEYS.COMMENTS) as Record<string, Comment> | null || {};
    const id = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    comments[id] = {
      ...commentData,
      id,
      createdAt: new Date().toISOString(),
    };
    await kv.set(DB_KEYS.COMMENTS, comments);
    return true;
  } catch (error) {
    console.error('Error creating comment:', error);
    return false;
  }
}

export async function updateComment(id: string, commentData: Partial<Omit<Comment, 'id' | 'createdAt'>>): Promise<boolean> {
  try {
    const comments = await kv.get(DB_KEYS.COMMENTS) as Record<string, Comment> | null || {};
    if (!comments[id]) {
      return false;
    }
    comments[id] = {
      ...comments[id],
      ...commentData,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(DB_KEYS.COMMENTS, comments);
    return true;
  } catch (error) {
    console.error('Error updating comment:', error);
    return false;
  }
}

export async function deleteComment(id: string): Promise<boolean> {
  try {
    const comments = await kv.get(DB_KEYS.COMMENTS) as Record<string, Comment> | null || {};
    if (!comments[id]) {
      return false;
    }
    delete comments[id];
    await kv.set(DB_KEYS.COMMENTS, comments);
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}
