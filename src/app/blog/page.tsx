import { getSortedPostsData } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';
import BlogSearch from '@/components/BlogSearch';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: `Blog - ${siteConfig.name}`,
  description: `Explore the thoughts of Joshua Seprodi.`,
  keywords: ['blog', 'articles', 'thoughts', 'insights', 'technology', 'life', 'writing'],
  openGraph: {
    title: `Blog - ${siteConfig.name}`,
    description: `Here lies a man whose name was writ in water.`,
    url: `${siteConfig.url}/blog`,
    type: 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Blog page preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog - ${siteConfig.name}`,
    description: `Explore the thoughts of Joshua Seprodi.`,
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

export default async function BlogPage() {
  const posts = await getSortedPostsData();

  return (
    <>
      {/* Structured Data for Blog Listing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": `${siteConfig.name} Blog`,
            "description": "A collection of thoughts, insights, and stories",
            "url": `${siteConfig.url}/blog`,
            "publisher": {
              "@type": "Person",
              "name": siteConfig.author.name,
            },
            "blogPost": posts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.description || post.title,
              "url": `${siteConfig.url}/blog/${post.slug}`,
              "datePublished": post.date,
              "author": {
                "@type": "Person",
                "name": siteConfig.author.name,
              },
            })),
          }),
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Articles
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'} available
            </p>
          </header>

          {/* Search Bar */}
          <section className="max-w-2xl mx-auto mb-12" aria-label="Search articles">
            <BlogSearch posts={posts} />
          </section>

          {/* Posts Grid */}
          <section aria-label="Blog articles">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id}>
                    <BlogCard post={post} />
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h2>
                <p className="text-gray-500">
                  Check back soon for our first blog post!
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
