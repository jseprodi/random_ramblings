import { BlogPostMeta } from './blog';
import { Comment } from './comments';
import { ImageInfo } from './images';

export interface SearchFilters {
  query?: string;
  tags?: string[];
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  sortBy?: 'date' | 'title' | 'author' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  filters: SearchFilters;
  suggestions?: string[];
}

// Search through blog posts
export function searchPosts(posts: BlogPostMeta[], filters: SearchFilters): SearchResult<BlogPostMeta> {
  let filteredPosts = [...posts];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }

  // Tag filter
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags && filters.tags!.some(tag => 
        post.tags!.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }

  // Author filter
  if (filters.author) {
    filteredPosts = filteredPosts.filter(post => 
      post.author.toLowerCase().includes(filters.author!.toLowerCase())
    );
  }

  // Date range filter
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filteredPosts = filteredPosts.filter(post => new Date(post.date) >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    filteredPosts = filteredPosts.filter(post => new Date(post.date) <= toDate);
  }

  // Sort results
  const sortedPosts = sortPosts(filteredPosts, filters.sortBy || 'date', filters.sortOrder || 'desc');

  return {
    items: sortedPosts,
    total: filteredPosts.length,
    filters,
    suggestions: generateSuggestions(posts, filters.query)
  };
}

// Search through comments
export function searchComments(comments: Comment[], filters: SearchFilters): SearchResult<Comment> {
  let filteredComments = [...comments];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredComments = filteredComments.filter(comment => 
      comment.author.toLowerCase().includes(query) ||
      comment.content.toLowerCase().includes(query) ||
      comment.postSlug.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filters.status) {
    filteredComments = filteredComments.filter(comment => 
      comment.status === filters.status
    );
  }

  // Date range filter
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filteredComments = filteredComments.filter(comment => new Date(comment.createdAt) >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    filteredComments = filteredComments.filter(comment => new Date(comment.createdAt) <= toDate);
  }

  // Sort results
  const sortedComments = sortComments(filteredComments, filters.sortBy || 'date', filters.sortOrder || 'desc');

  return {
    items: sortedComments,
    total: filteredComments.length,
    filters,
    suggestions: generateCommentSuggestions(comments, filters.query)
  };
}

// Search through images
export function searchImages(images: ImageInfo[], filters: SearchFilters): SearchResult<ImageInfo> {
  let filteredImages = [...images];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredImages = filteredImages.filter(image => 
      image.originalName.toLowerCase().includes(query) ||
      (image.alt && image.alt.toLowerCase().includes(query)) ||
      (image.description && image.description.toLowerCase().includes(query))
    );
  }

  // Date range filter
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filteredImages = filteredImages.filter(image => new Date(image.uploadedAt) >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    filteredImages = filteredImages.filter(image => new Date(image.uploadedAt) <= toDate);
  }

  // Sort results
  const sortedImages = sortImages(filteredImages, filters.sortBy || 'date', filters.sortOrder || 'desc');

  return {
    items: sortedImages,
    total: filteredImages.length,
    filters,
    suggestions: generateImageSuggestions(images, filters.query)
  };
}

// Sort posts by different criteria
function sortPosts(posts: BlogPostMeta[], sortBy: string, sortOrder: 'asc' | 'desc'): BlogPostMeta[] {
  const sorted = [...posts];
  
  switch (sortBy) {
    case 'title':
      sorted.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      break;
    case 'author':
      sorted.sort((a, b) => {
        const comparison = a.author.localeCompare(b.author);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      break;
    case 'relevance':
      // Keep original order for relevance (already filtered)
      break;
    case 'date':
    default:
      sorted.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
      break;
  }
  
  return sorted;
}

// Sort comments by different criteria
function sortComments(comments: Comment[], sortBy: string, sortOrder: 'asc' | 'desc'): Comment[] {
  const sorted = [...comments];
  
  switch (sortBy) {
    case 'author':
      sorted.sort((a, b) => {
        const comparison = a.author.localeCompare(b.author);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      break;
    case 'relevance':
      // Keep original order for relevance (already filtered)
      break;
    case 'date':
    default:
      sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
      break;
  }
  
  return sorted;
}

// Sort images by different criteria
function sortImages(images: ImageInfo[], sortBy: string, sortOrder: 'asc' | 'desc'): ImageInfo[] {
  const sorted = [...images];
  
  switch (sortBy) {
    case 'title':
      sorted.sort((a, b) => {
        const comparison = a.originalName.localeCompare(b.originalName);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      break;
    case 'size':
      sorted.sort((a, b) => {
        const comparison = a.size - b.size;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      break;
    case 'relevance':
      // Keep original order for relevance (already filtered)
      break;
    case 'date':
    default:
      sorted.sort((a, b) => {
        const dateA = new Date(a.uploadedAt).getTime();
        const dateB = new Date(b.uploadedAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
      break;
  }
  
  return sorted;
}

// Generate search suggestions for posts
function generateSuggestions(posts: BlogPostMeta[], query?: string): string[] {
  if (!query) return [];
  
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  posts.forEach(post => {
    // Title suggestions
    if (post.title.toLowerCase().includes(queryLower)) {
      const words = post.title.split(' ');
      words.forEach(word => {
        if (word.toLowerCase().includes(queryLower) && word.length > 2) {
          suggestions.add(word);
        }
      });
    }
    
    // Tag suggestions
    if (post.tags) {
      post.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
}

// Generate search suggestions for comments
function generateCommentSuggestions(comments: Comment[], query?: string): string[] {
  if (!query) return [];
  
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  comments.forEach(comment => {
    // Author suggestions
    if (comment.author.toLowerCase().includes(queryLower)) {
      suggestions.add(comment.author);
    }
    
    // Content suggestions
    const words = comment.content.split(' ');
    words.forEach(word => {
      if (word.toLowerCase().includes(queryLower) && word.length > 2) {
        suggestions.add(word);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5);
}

// Generate search suggestions for images
function generateImageSuggestions(images: ImageInfo[], query?: string): string[] {
  if (!query) return [];
  
  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();
  
  images.forEach(image => {
    // Filename suggestions
    if (image.originalName.toLowerCase().includes(queryLower)) {
      const words = image.originalName.split(/[._-]/);
      words.forEach(word => {
        if (word.toLowerCase().includes(queryLower) && word.length > 2) {
          suggestions.add(word);
        }
      });
    }
    
    // Alt text suggestions
    if (image.alt && image.alt.toLowerCase().includes(queryLower)) {
      const words = image.alt.split(' ');
      words.forEach(word => {
        if (word.toLowerCase().includes(queryLower) && word.length > 2) {
          suggestions.add(word);
        }
      });
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
}

// Advanced search with multiple criteria
export function advancedSearch<T>(
  items: T[],
  filters: SearchFilters,
  searchFunction: (items: T[], filters: SearchFilters) => SearchResult<T>
): SearchResult<T> {
  return searchFunction(items, filters);
}

// Get available tags from posts
export function getAvailableTags(posts: BlogPostMeta[]): string[] {
  const tags = new Set<string>();
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

// Get available authors from posts
export function getAvailableAuthors(posts: BlogPostMeta[]): string[] {
  const authors = new Set<string>();
  posts.forEach(post => {
    authors.add(post.author);
  });
  return Array.from(authors).sort();
}

// Get available statuses from comments
export function getAvailableStatuses(comments: Comment[]): string[] {
  const statuses = new Set<string>();
  comments.forEach(comment => {
    statuses.add(comment.status);
  });
  return Array.from(statuses).sort();
}
