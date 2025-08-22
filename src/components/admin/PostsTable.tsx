'use client';

import Link from 'next/link';
import { format } from 'date-fns';

// Define the interface locally to avoid importing from blog.ts
interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  author: string;
  tags?: string[];
}

interface PostsTableProps {
  posts: Post[];
}

export default function PostsTable({ posts }: PostsTableProps) {
  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/posts/${slug}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete post');
        }

        // Show success message and refresh the page to update the list
        alert('Post deleted successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert(`Error deleting post: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with New Post button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">All Posts</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {posts.length} post{posts.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/new-post"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="mr-2">✏️</span>
          New Post
        </Link>
      </div>

      {/* Posts Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first blog post!
            </p>
            <Link
              href="/admin/new-post"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <span className="mr-2">✏️</span>
              Create Your First Post
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex-shrink-0">
                          <span className="text-lg">📄</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 truncate">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {post.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="ml-8">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                          {post.tags && post.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex space-x-1">
                                {post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/posts/${post.slug}`}
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
