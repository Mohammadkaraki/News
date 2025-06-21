import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages,
  basePath 
}: PaginationProps) {
  // If there's only 1 page, don't show pagination
  if (totalPages <= 1) return null;

  // Helper to generate the URL for a specific page
  const getPageUrl = (page: number) => {
    // For the first page, we might want to use the base path without the page parameter
    if (page === 1) return basePath;
    return `${basePath}${basePath.includes('?') ? '&' : '?'}page=${page}`;
  };

  // Generate pagination items array
  const getPaginationItems = () => {
    const items = [];
    
    // Always include first page
    items.push(1);
    
    // If current page is more than 3, add ellipsis after first page
    if (currentPage > 3) {
      items.push('...');
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(i);
    }
    
    // If there are more pages after current + 1, add ellipsis
    if (currentPage + 1 < totalPages - 1) {
      items.push('...');
    }
    
    // Always include last page if more than 1 page
    if (totalPages > 1) {
      items.push(totalPages);
    }
    
    return items;
  };

  const paginationItems = getPaginationItems();

  return (
    <nav className="flex items-center justify-center mt-10" aria-label="Pagination">
      {/* Previous page button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2"
        >
          <FiChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Link>
      ) : (
        <button
          disabled
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-300 mr-2 cursor-not-allowed"
        >
          <FiChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </button>
      )}

      {/* Page numbers */}
      <div className="flex items-center space-x-2">
        {paginationItems.map((item, index) => {
          if (item === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
                ...
              </span>
            );
          }

          const page = item as number;
          const isCurrentPage = page === currentPage;

          return isCurrentPage ? (
            <span
              key={page}
              className="relative inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next page button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ml-2"
        >
          <span className="sr-only">Next</span>
          <FiChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <button
          disabled
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-300 ml-2 cursor-not-allowed"
        >
          <span className="sr-only">Next</span>
          <FiChevronRight className="h-5 w-5" />
        </button>
      )}
    </nav>
  );
} 