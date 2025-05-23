import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="container py-16">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            <FiArrowLeft className="mr-2" />
            Back to Homepage
          </Link>
          <div className="pt-2">
            <p className="text-gray-500 text-sm">
              Or try using the search to find what you're looking for
            </p>
            <div className="mt-4">
              <form action="/search" className="flex">
                <input
                  type="text"
                  name="q"
                  placeholder="Search articles..."
                  className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 