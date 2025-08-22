import { getPosts, getPost } from './db';
import { remark } from 'remark';
import html from 'remark-html';

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
  author: string;
  slug: string;
}

export interface BlogPostMeta {
  id: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  author: string;
  slug: string;
}

export async function getSortedPostsData(): Promise<BlogPostMeta[]> {
  try {
    const posts = await getPosts();
    
    // Transform posts to match BlogPostMeta interface
    const allPostsData = posts.map((post) => ({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      date: post.date,
      description: post.description,
      tags: post.tags || [],
      author: post.author,
    }));

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error getting sorted posts:', error);
    return [];
  }
}

export async function getAllPostIds() {
  try {
    const posts = await getPosts();
    return posts.map((post) => ({
      params: {
        id: post.slug,
      },
    }));
  } catch (error) {
    console.error('Error getting post IDs:', error);
    return [];
  }
}

export async function getPostData(id: string): Promise<BlogPost> {
  try {
    const post = await getPost(id);
    if (!post) {
      throw new Error('Post not found');
    }

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(post.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
      id: post.slug,
      slug: post.slug,
      title: post.title,
      date: post.date,
      description: post.description,
      content: contentHtml,
      tags: post.tags || [],
      author: post.author,
    };
  } catch (error) {
    console.error('Error getting post data:', error);
    throw error;
  }
}
