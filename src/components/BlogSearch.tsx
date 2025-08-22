'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPostMeta } from '@/lib/blog';
import { searchPosts, SearchFilters } from '@/lib/search';

interface BlogSearchProps {
  posts: BlogPostMeta[];
  className?: string;
}

export default function BlogSearch({ posts, className = "" }: BlogSearchProps) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPostMeta[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
      const filters: SearchFilters = { query: query.trim() };
      const results = searchPosts(posts, filters);
      setSearchResults(results.items);
      setShowResults(true);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [query, posts]);

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
  };

  // Format date consistently to avoid hydration issues
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Ensure className is constructed consistently
  const containerClassName = className ? `relative ${className}`.trim() : 'relative';

  return (
    <div className={containerClassName}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-md leading-5 bg-gray-100 placeholder-red-500 focus:outline-none focus:placeholder-red-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (query.trim() || searchResults.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  onClick={handleResultClick}
                  className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">📄</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {post.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span>by {post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex space-x-1">
                              {post.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 2 && (
                                <span className="text-gray-400">+{post.tags.length - 2}</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="px-4 py-8 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search terms or browse all posts
              </p>
              <Link
                href="/blog"
                onClick={handleResultClick}
                className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse All Posts
              </Link>
            </div>
          ) : null}
        </div>
      )}

      {/* Click Outside Handler */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
