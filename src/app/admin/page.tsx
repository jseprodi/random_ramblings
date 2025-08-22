import AdminLayout from '@/components/admin/AdminLayout';
import { getSortedPostsData } from '@/lib/blog';
import { getCommentStats } from '@/lib/comments';
import { getImageStats } from '@/lib/images';
import Link from 'next/link';

export default function AdminDashboard() {
  const posts = getSortedPostsData();
  
  const commentStats = getCommentStats();
  const imageStats = getImageStats();
  
  const stats = {
    totalPosts: posts.length,
    totalComments: commentStats.total,
    totalImages: imageStats.totalImages,
    totalStorage: imageStats.totalSizeMB,
    publishedPosts: posts.filter(post => new Date(post.date) <= new Date()).length,
    draftPosts: posts.filter(post => new Date(post.date) > new Date()).length,
  };

  const recentPosts = posts.slice(0, 5);
  const recentComments = [
    { id: 1, author: 'John Doe', content: 'Great article! Very helpful.', post: 'Getting Started with Next.js 14', date: '2024-01-25' },
    { id: 2, author: 'Jane Smith', content: 'Thanks for sharing this knowledge.', post: 'Mastering Tailwind CSS', date: '2024-01-24' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your blog administration panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalPosts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Comments</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalComments}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🖼️</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Images</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalImages}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">💾</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Storage Used</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalStorage} MB</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Published Posts</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.publishedPosts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Draft Posts</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.draftPosts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/admin/new-post"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">✏️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">Write New Post</p>
                  <p className="text-sm text-gray-500">Create a new blog post</p>
                </div>
              </Link>

              <Link
                href="/admin/posts"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">Manage Posts</p>
                  <p className="text-sm text-gray-500">Edit and organize posts</p>
                </div>
              </Link>

              <Link
                href="/admin/images"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">🖼️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">Manage Images</p>
                  <p className="text-sm text-gray-500">Upload and organize images</p>
                </div>
              </Link>

              <Link
                href="/admin/comments"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">Moderate Comments</p>
                  <p className="text-sm text-gray-500">Review and approve comments</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">📄</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                      <p className="text-sm text-gray-500">{post.date}</p>
                    </div>
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/posts"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all posts →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Comments */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Comments</h3>
              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">💬</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-600 truncate">{comment.content}</p>
                      <p className="text-xs text-gray-500">on "{comment.post}" • {comment.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-sm text-green-600 hover:text-green-800">Approve</button>
                      <button className="text-sm text-red-600 hover:text-red-800">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/comments"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all comments →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
