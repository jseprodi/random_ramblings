import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostData, getAllPostIds } from '@/lib/blog';
import { getCommentsForPost } from '@/lib/comments';
import { format } from 'date-fns';
import Comments from '@/components/Comments';
import { siteConfig } from '@/lib/config';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPostIds();
  return posts;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPostData(slug);
    
    return {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.description,
      keywords: post.tags,
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
        authors: [post.author],
        tags: post.tags,
        url: `${siteConfig.url}/blog/${slug}`,
        siteName: siteConfig.name,
        images: [
          {
            url: siteConfig.ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [siteConfig.ogImage],
      },
      alternates: {
        canonical: `${siteConfig.url}/blog/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found | JS Blog',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const { slug } = await params;
    const post = await getPostData(slug);
    const comments = getCommentsForPost(slug);

    return (
      <>
        {/* Structured Data for Blog Post */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.description,
              "image": siteConfig.ogImage,
              "author": {
                "@type": "Person",
                "name": post.author,
              },
              "publisher": {
                "@type": "Person",
                "name": siteConfig.author.name,
              },
              "datePublished": post.date,
              "dateModified": post.date,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${siteConfig.url}/blog/${slug}`,
              },
              "keywords": post.tags.join(", "),
            }),
          }}
        />
        
        <article className="bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="text-sm text-gray-500">
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-sm text-gray-500">{post.author}</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {post.description}
            </p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Comments */}
        <Comments postSlug={slug} initialComments={comments} />
        </article>
      </>
    );
  } catch (error) {
    notFound();
  }
}
