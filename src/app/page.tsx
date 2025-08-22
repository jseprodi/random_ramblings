import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ['blog', 'personal', 'thoughts', 'writing', 'technology', 'life'],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function Home() {
  return (
    <>
      {/* Structured Data for Website */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": siteConfig.name,
            "description": siteConfig.description,
            "url": siteConfig.url,
            "author": {
              "@type": "Person",
              "name": siteConfig.author.name,
              "email": siteConfig.author.email,
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${siteConfig.url}/blog?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      
      <div className="bg-gradient-to-br from-gray-800 to-blue-700 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-300 mb-6">
              <span className="text-gray-300">{siteConfig.name}</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Here lies a man whose name was writ in water.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold border-2 border-black hover:bg-blue-50 transition-colors inline-block"
              >
                Read Words
              </Link>
              <Link
                href="/about"
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold border-2 border-black hover:bg-blue-50 transition-colors inline-block"
              >
                Other Things
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
