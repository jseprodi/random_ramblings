import { siteConfig } from '@/lib/config';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About {siteConfig.name}</h1>
          <p className="text-xl text-gray-600">
            Learn more about... yeah, no.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-900">
          <h2><b>Look...</b></h2>
          <br />
          <p>
            We&rsquo;re on a rock floating in space. No one knows what they&rsquo;re doing.
          </p>
          <br />
          <p>
            None of us asked to be here.
          </p>
          <br />
          <p>
            The proportion of pleasure and pain in a life is so asymmetrical
            that people make up entire religions to try and rationalize the raw
            unfairness of it.
          </p>
          <br />
          <p>
            <i>Why are we here?</i>  
          </p>
          <br />
          <p>The same why that causes toadstools to pop up after a rainstorm.</p>
          <br />
          <br />
          <h2><b>Get in Touch</b></h2>
          <br />
          <p>
            Please don&rsquo;t.
          </p>
          <br />
        </div>
      </div>
    </div>
  );
}
