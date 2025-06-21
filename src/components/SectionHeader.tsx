import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  subtitle?: string;
}

export default function SectionHeader({ 
  title, 
  viewAllLink, 
  subtitle 
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      
      {viewAllLink && (
        <Link 
          href={viewAllLink}
          className="mt-2 md:mt-0 text-primary hover:text-primary/80 text-sm font-medium flex items-center group"
        >
          See all
          <FiChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
} 