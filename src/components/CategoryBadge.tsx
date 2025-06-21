import Link from 'next/link';

interface CategoryBadgeProps {
  category: {
    name: string;
    slug: string;
  };
  size?: 'sm' | 'md';
  featured?: boolean;
}

// Define color mapping for different categories
const categoryColors: Record<string, string> = {
  movies: 'bg-red-100 text-red-800',
  sport: 'bg-blue-100 text-blue-800',
  politics: 'bg-purple-100 text-purple-800',
  'middle-east': 'bg-amber-100 text-amber-800',
  crime: 'bg-red-100 text-red-800',
  technology: 'bg-indigo-100 text-indigo-800',
  entertainment: 'bg-pink-100 text-pink-800',
  business: 'bg-green-100 text-green-800',
  health: 'bg-teal-100 text-teal-800',
  science: 'bg-cyan-100 text-cyan-800',
  education: 'bg-violet-100 text-violet-800',
  stories: 'bg-blue-100 text-blue-800',
  creator: 'bg-indigo-100 text-indigo-800',
  community: 'bg-emerald-100 text-emerald-800',
  // Default color for categories not in the list
  default: 'bg-gray-100 text-gray-800',
};

// Featured color mapping (for dark backgrounds)
const featuredCategoryColors: Record<string, string> = {
  movies: 'bg-red-500 text-white',
  sport: 'bg-blue-500 text-white',
  politics: 'bg-purple-500 text-white',
  'middle-east': 'bg-amber-500 text-white',
  crime: 'bg-red-500 text-white',
  technology: 'bg-indigo-500 text-white',
  entertainment: 'bg-pink-500 text-white',
  business: 'bg-green-500 text-white',
  health: 'bg-teal-500 text-white',
  science: 'bg-cyan-500 text-white',
  education: 'bg-violet-500 text-white',
  stories: 'bg-blue-500 text-white',
  creator: 'bg-indigo-500 text-white',
  community: 'bg-emerald-500 text-white',
  // Default color for categories not in the list
  default: 'bg-primary text-white',
};

export default function CategoryBadge({ category, size = 'md', featured = false }: CategoryBadgeProps) {
  // Get the color class based on the category slug or default if not found
  const colorMap = featured ? featuredCategoryColors : categoryColors;
  const colorClass = colorMap[category.slug] || colorMap.default;
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <Link href={`/category/${category.slug}`}>
      <span className={`category-badge ${colorClass} ${sizeClass} ${featured ? 'shadow-sm' : ''}`}>
        {category.name}
      </span>
    </Link>
  );
} 