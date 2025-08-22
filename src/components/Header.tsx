import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-950 transition-colors">
              {siteConfig.name}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Admin Login Link */}
            <Link
              href="/admin/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
