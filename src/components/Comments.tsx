'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Comment } from '@/lib/comments';

interface CommentsProps {
  postSlug: string;
  initialComments: Comment[];
}

export default function Comments({ postSlug, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          postSlug
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit comment');
      }

      const newComment = await response.json();
      
      // Add the new comment to the list (it will be pending)
      setComments(prev => [newComment, ...prev]);
      
      // Reset form and hide it
      setFormData({ author: '', email: '', content: '' });
      setShowForm(false);
      
      // Show success message
      alert('Comment submitted successfully! It will be visible after approval.');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert(`Error submitting comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Comments Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Comments ({comments.length})
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showForm ? 'Cancel' : 'Leave a Comment'}
          </button>
        </div>

        {/* Comment Form */}
        {showForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leave a Comment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="author"
                    id="author"
                    required
                    value={formData.author}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Comment *
                </label>
                <textarea
                  name="content"
                  id="content"
                  required
                  rows={4}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  placeholder="Share your thoughts..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
            <p className="text-gray-500 mb-6">
              Be the first to share your thoughts on this post!
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Leave a Comment
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {comment.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm font-medium text-gray-900">
                        {comment.author}
                      </p>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
