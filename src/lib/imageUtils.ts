// Image utility functions for handling invalid URLs and fallbacks

// Allowed domains for Next.js Image component
const ALLOWED_DOMAINS = [
  'images.unsplash.com',
  'via.placeholder.com',
  'picsum.photos',
  'source.unsplash.com',
  'localhost:5000'  // Allow backend server images
];

/**
 * Validates if an image URL is valid for Next.js Image component
 * @param url - The image URL to validate
 * @returns boolean - true if valid, false if invalid
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a valid relative path (starts with /)
  if (url.startsWith('/')) {
    return true;
  }
  
  // Check if it's an absolute URL (starts with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url);
      
      // Only allow https for external images, but allow http for localhost
      if (urlObj.protocol !== 'https:' && !urlObj.hostname.includes('localhost')) {
        return false;
      }
      
      // Check if domain is in allowed list
      return ALLOWED_DOMAINS.includes(urlObj.hostname);
    } catch (error) {
      return false;
    }
  }
  
  return false;
}

/**
 * Gets a safe image URL with fallback
 * @param url - The original image URL
 * @param fallbackCategory - Category for themed fallback image
 * @returns string - A valid image URL
 */
export function getSafeImageUrl(url: string, fallbackCategory?: string): string {
  if (isValidImageUrl(url)) {
    // If it's a relative URL (starts with /), prepend the backend server URL
    if (url.startsWith('/')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  }
  
  // Generate fallback image based on category
  const categoryFallbacks: { [key: string]: string } = {
    technology: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop',
    sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    business: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
    entertainment: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=400&fit=crop',
    health: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    science: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    world: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
    lifestyle: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'
  };
  
  const categoryKey = fallbackCategory?.toLowerCase() || 'default';
  return categoryFallbacks[categoryKey] || categoryFallbacks.default;
}

/**
 * Safe image props for Next.js Image component
 * @param imageUrl - The image URL
 * @param imageAlt - The image alt text
 * @param category - Optional category for fallback image
 * @returns object with src and alt properties
 */
export function getSafeImageProps(imageUrl: string, imageAlt: string, category?: string) {
  return {
    src: getSafeImageUrl(imageUrl, category),
    alt: imageAlt || 'News article image',
  };
}

/**
 * Placeholder image URL generator
 * @param width - Image width
 * @param height - Image height  
 * @param text - Placeholder text
 * @param bgColor - Background color (hex without #)
 * @param textColor - Text color (hex without #)
 * @returns string - Placeholder image URL
 */
export function getPlaceholderImage(
  width: number = 800,
  height: number = 400,
  text: string = 'News',
  bgColor: string = '6B7280',
  textColor: string = 'FFFFFF'
): string {
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
} 