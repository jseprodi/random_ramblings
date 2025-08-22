import Link from 'next/link';
import { format } from 'date-fns';
import { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
          <span className="mx-2">•</span>
          <span>{post.author}</span>
        </div>
        
        <Link href={`/blog/${post.slug}`} className="block group">
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.description}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Read more
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
