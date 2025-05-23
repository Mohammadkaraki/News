import Link from 'next/link';

interface CategoryBadgeProps {
  category: {
    name: string;
    slug: string;
  };
  size?: 'sm' | 'md';
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
  // Default color for categories not in the list
  default: 'bg-gray-100 text-gray-800',
};

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  // Get the color class based on the category slug or default if not found
  const colorClass = categoryColors[category.slug] || categoryColors.default;
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <Link href={`/category/${category.slug}`}>
      <span className={`category-badge ${colorClass} ${sizeClass}`}>
        {category.name}
      </span>
    </Link>
  );
} 