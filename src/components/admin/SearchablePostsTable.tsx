'use client';

import { useState } from 'react';
import { BlogPostMeta } from '@/lib/blog';
import { SearchResult, searchPosts } from '@/lib/search';
import PostsTable from './PostsTable';
import SearchBar from '../SearchBar';

interface SearchablePostsTableProps {
  posts: BlogPostMeta[];
  availableTags: string[];
  availableAuthors: string[];
}

export default function SearchablePostsTable({ 
  posts, 
  availableTags, 
  availableAuthors 
}: SearchablePostsTableProps) {
  const [searchResult, setSearchResult] = useState<SearchResult<BlogPostMeta>>({
    items: posts,
    total: posts.length,
    filters: {}
  });

  const handleSearchResults = (results: SearchResult<BlogPostMeta>) => {
    setSearchResult(results);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <SearchBar
          posts={posts}
          availableTags={availableTags}
          availableAuthors={availableAuthors}
          onSearchResults={handleSearchResults}
          className="mb-4"
        />
        
        {/* Search Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {searchResult.items.length} of {searchResult.total} posts
            {searchResult.filters.query && ` matching "${searchResult.filters.query}"`}
          </span>
          {searchResult.suggestions && searchResult.suggestions.length > 0 && (
            <div className="flex items-center space-x-2">
              <span>Suggestions:</span>
              {searchResult.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const newFilters = { ...searchResult.filters, query: suggestion };
                    const results = searchPosts(posts, newFilters);
                    setSearchResult(results);
                  }}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Posts Table */}
      <PostsTable posts={searchResult.items} />
    </div>
  );
}
