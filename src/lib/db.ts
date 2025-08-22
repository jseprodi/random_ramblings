import { put, list } from '@vercel/blob';

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

// Blob storage keys
export const BLOB_KEYS = {
  POSTS: 'data/posts.json',
  COMMENTS: 'data/comments.json',
} as const;



// Helper functions for database operations
export async function getPosts(): Promise<BlogPost[]> {
  try {
    // During build time, return empty array to avoid fetch issues
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      return [];
    }

    // List blobs to find the posts file
    const { blobs } = await list();
    const postsBlob = blobs.find(blob => blob.pathname === BLOB_KEYS.POSTS);
    
    if (postsBlob) {
      try {
        const response = await fetch(postsBlob.url);
        if (response.ok) {
          const posts = await response.json();
          // Handle both array and object formats
          if (Array.isArray(posts)) {
            return posts as BlogPost[];
          } else if (typeof posts === 'object' && posts !== null) {
            return Object.values(posts) as BlogPost[];
          }
        }
      } catch (fetchError) {
        console.error('Error fetching from blob URL:', fetchError);
      }
    }

    // Fallback: return empty array
    return [];
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error getting post:', error);
    return null;
  }
}

export async function createPost(slug: string, postData: Omit<BlogPost, 'slug' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
  try {
    // Create new post
    const newPost = {
      ...postData,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try to get existing posts, but don't fail if none exist
    let existingPosts: BlogPost[] = [];
    try {
      existingPosts = await getPosts();
    } catch (error) {
      console.log('No existing posts found, starting fresh');
    }

    // Convert to map format
    const postsMap = existingPosts.reduce((acc, post) => {
      acc[post.slug] = post;
      return acc;
    }, {} as Record<string, BlogPost>);

    // Add new post
    postsMap[slug] = newPost;

    // Upload to blob storage
    const blob = await put(BLOB_KEYS.POSTS, JSON.stringify(postsMap), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('Post created successfully:', blob.url);
    return true;
  } catch (error) {
    console.error('Error creating post:', error);
    return false;
  }
}

export async function updatePost(slug: string, postData: Partial<Omit<BlogPost, 'slug' | 'createdAt' | 'updatedAt'>>): Promise<boolean> {
  try {
    // Try to get existing posts
    let existingPosts: BlogPost[] = [];
    try {
      existingPosts = await getPosts();
    } catch (error) {
      console.log('No existing posts found for update');
      return false;
    }

    const postsMap = existingPosts.reduce((acc, post) => {
      acc[post.slug] = post;
      return acc;
    }, {} as Record<string, BlogPost>);

    if (!postsMap[slug]) {
      return false;
    }

    // Update post
    postsMap[slug] = {
      ...postsMap[slug],
      ...postData,
      updatedAt: new Date().toISOString(),
    };

    // Upload to blob storage
    const blob = await put(BLOB_KEYS.POSTS, JSON.stringify(postsMap), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('Post updated successfully:', blob.url);
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
}

export async function deletePost(slug: string): Promise<boolean> {
  try {
    const posts = await getPosts();
    const existingPosts = posts.reduce((acc, post) => {
      acc[post.slug] = post;
      return acc;
    }, {} as Record<string, BlogPost>);

    if (!existingPosts[slug]) {
      return false;
    }

    // Remove post
    delete existingPosts[slug];

    // Upload to blob storage
    const blob = await put(BLOB_KEYS.POSTS, JSON.stringify(existingPosts), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('Post deleted successfully:', blob.url);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
}

export async function getComments(): Promise<Comment[]> {
  try {
    // During build time, return empty array to avoid fetch issues
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      return [];
    }

    // For now, return empty array to avoid infinite loop
    // We'll implement a proper solution in the next iteration
    return [];
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
}

export async function createComment(commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<boolean> {
  try {
    const comments = await getComments();
    const existingComments = comments.reduce((acc, comment) => {
      acc[comment.id] = comment;
      return acc;
    }, {} as Record<string, Comment>);

    const id = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    existingComments[id] = {
      ...commentData,
      id,
      createdAt: new Date().toISOString(),
    };

    // Upload to blob storage
    const blob = await put(BLOB_KEYS.COMMENTS, JSON.stringify(existingComments), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('Comment created successfully:', blob.url);
    return true;
  } catch (error) {
    console.error('Error creating comment:', error);
    return false;
  }
}

export async function updateComment(id: string, commentData: Partial<Omit<Comment, 'id' | 'createdAt'>>): Promise<boolean> {
  try {
    const comments = await getComments();
    const existingComments = comments.reduce((acc, comment) => {
      acc[comment.id] = comment;
      return acc;
    }, {} as Record<string, Comment>);

    if (!existingComments[id]) {
      return false;
    }

    // Update comment
    existingComments[id] = {
      ...existingComments[id],
      ...commentData,
      updatedAt: new Date().toISOString(),
    };

    // Upload to blob storage
    const blob = await put(BLOB_KEYS.COMMENTS, JSON.stringify(existingComments), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('Comment updated successfully:', blob.url);
    return true;
  } catch (error) {
    console.error('Error updating comment:', error);
    return false;
  }
}

export async function deleteComment(id: string): Promise<boolean> {
  try {
    const comments = await getComments();
    const existingComments = comments.reduce((acc, comment) => {
      acc[comment.id] = comment;
      return acc;
    }, {} as Record<string, Comment>);

    if (!existingComments[id]) {
      return false;
    }

    // Remove comment
    delete existingComments[id];

    // Upload to blob storage
    const blob = await put(BLOB_KEYS.COMMENTS, JSON.stringify(existingComments), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    console.log('Comment deleted successfully:', blob.url);
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}
