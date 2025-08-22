'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Comment } from '@/lib/comments';
import { searchComments, getAvailableStatuses, SearchFilters, SearchResult } from '@/lib/search';
import SearchBar from '@/components/SearchBar';

export default function AdminComments() {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult<Comment>>({
    items: [],
    total: 0,
    filters: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load comments on component mount
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const response = await fetch('/api/comments');
      if (response.ok) {
        const commentList = await response.json();
        setAllComments(commentList);
        setSearchResult({
          items: commentList,
          total: commentList.length,
          filters: {}
        });
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    const result = searchComments(allComments, filters);
    setSearchResult(result);
  };

  const handleStatusChange = async (commentId: string, newStatus: Comment['status']) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        const updatedComments = allComments.map(comment =>
          comment.id === commentId ? { ...comment, status: newStatus } : comment
        );
        setAllComments(updatedComments);
        
        // Re-run search with current filters
        const result = searchComments(updatedComments, searchResult.filters);
        setSearchResult(result);
      }
    } catch (error) {
      console.error('Error updating comment status:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state
        const updatedComments = allComments.filter(comment => comment.id !== commentId);
        setAllComments(updatedComments);
        
        // Re-run search with current filters
        const result = searchComments(updatedComments, searchResult.filters);
        setSearchResult(result);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const availableStatuses = getAvailableStatuses(allComments);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: Comment['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Comments</h1>
          <p className="text-gray-600">Moderate and manage blog comments</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search comments by author, content, or post..."
            showAdvanced={true}
            availableStatuses={availableStatuses}
            className="mb-4"
          />
          
          {/* Search Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {searchResult.items.length} of {searchResult.total} comments
              {searchResult.filters.query && ` matching "${searchResult.filters.query}"`}
            </span>
            {searchResult.suggestions && searchResult.suggestions.length > 0 && (
              <div className="flex items-center space-x-2">
                <span>Suggestions:</span>
                {searchResult.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch({ ...searchResult.filters, query: suggestion })}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Comments</h3>
            
            {searchResult.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <span className="text-4xl">💬</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
                <p className="text-gray-500">
                  {searchResult.filters.query ? 'Try adjusting your search terms.' : 'No comments have been submitted yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResult.items.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          {getStatusBadge(comment.status)}
                          <span className="text-sm text-gray-500">on {comment.postSlug}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        <div className="text-sm text-gray-500">
                          <span>{formatDate(comment.createdAt)}</span>
                          {comment.ipAddress && (
                            <>
                              <span className="mx-2">•</span>
                              <span>IP: {comment.ipAddress}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {comment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(comment.id, 'approved')}
                              className="text-sm text-green-600 hover:text-green-800 font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(comment.id, 'rejected')}
                              className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {comment.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(comment.id, 'rejected')}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Reject
                          </button>
                        )}
                        {comment.status === 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(comment.id, 'approved')}
                            className="text-sm text-green-600 hover:text-green-800 font-medium"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
