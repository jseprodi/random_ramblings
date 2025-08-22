'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SearchFilters, searchPosts, SearchResult } from '@/lib/search';
import { BlogPostMeta } from '@/lib/blog';

interface SearchBarProps {
  posts: BlogPostMeta[];
  availableTags?: string[];
  availableAuthors?: string[];
  availableStatuses?: string[];
  className?: string;
  onSearchResults?: (results: SearchResult<BlogPostMeta>) => void;
}

export default function SearchBar({
  posts,
  availableTags = [],
  availableAuthors = [],
  availableStatuses = [],
  className = "",
  onSearchResults
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    author: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Use refs to store the latest values to avoid infinite loops and dependency issues
  const onSearchResultsRef = useRef(onSearchResults);
  const postsRef = useRef(posts);
  const filtersRef = useRef(filters);

  // Update refs when props change
  onSearchResultsRef.current = onSearchResults;
  postsRef.current = posts;
  filtersRef.current = filters;

  // Memoized search function to avoid recreating on every render
  const performSearch = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    if (onSearchResultsRef.current) {
      const results = searchPosts(postsRef.current, searchFilters);
      onSearchResultsRef.current(results);
    }
  }, []);

  // Update filters when query changes
  useEffect(() => {
    const newFilters = { ...filtersRef.current, query };
    setFilters(newFilters);
    
    // Don't call performSearch here - it will be called when filters change
  }, [query]); // Remove performSearch from dependencies

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filtersRef.current, [key]: value };
    setFilters(newFilters);
    
    // Perform search
    performSearch(query, newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filtersRef.current.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      tags: [],
      author: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    setQuery('');
    
    // Perform search
    performSearch('', clearedFilters);
  };

  const hasActiveFilters = filters.tags?.length || filters.author || filters.dateFrom || filters.dateTo || filters.status;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Basic Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-800 focus:outline-none focus:placeholder-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search posts by title, description, author, or tags..."
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg className={`h-5 w-5 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Advanced Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Author Filter */}
            {availableAuthors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <select
                  value={filters.author || ''}
                  onChange={(e) => handleFilterChange('author', e.target.value || undefined)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All authors</option>
                  {availableAuthors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Filter */}
            {availableStatuses.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All statuses</option>
                  {availableStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.tags?.includes(tag)
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'date'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
