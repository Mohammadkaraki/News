const mongoose = require('mongoose');

/**
 * Generate a unique slug from a title
 * @param {string} title - The title to generate slug from
 * @param {string} modelName - The model name to check for uniqueness ('Article', 'Category', etc.)
 * @param {string} excludeId - ID to exclude from uniqueness check (for updates)
 * @returns {string} - Unique slug
 */
const generateSlug = async (title, modelName, excludeId = null) => {
  if (!title || typeof title !== 'string') {
    throw new Error('Title is required and must be a string');
  }

  // Basic slug generation
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Handle empty slug
  if (!baseSlug) {
    baseSlug = 'untitled';
  }

  // Ensure slug doesn't exceed reasonable length
  if (baseSlug.length > 100) {
    baseSlug = baseSlug.substring(0, 100);
  }

  // Get the model
  const Model = mongoose.model(modelName);
  
  let slug = baseSlug;
  let counter = 0;
  let isUnique = false;

  // Check for uniqueness and append counter if needed
  while (!isUnique) {
    const query = { slug };
    
    // Exclude current document if updating
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingDoc = await Model.findOne(query);
    
    if (!existingDoc) {
      isUnique = true;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    // Prevent infinite loop
    if (counter > 1000) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return slug;
};

/**
 * Generate slug without database check (for client-side preview)
 * @param {string} title - The title to generate slug from
 * @returns {string} - Basic slug
 */
const generateBasicSlug = (title) => {
  if (!title || typeof title !== 'string') {
    return 'untitled';
  }

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) || 'untitled';
};

/**
 * Validate slug format
 * @param {string} slug - The slug to validate
 * @returns {boolean} - Whether the slug is valid
 */
const isValidSlug = (slug) => {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Check if slug matches the expected format
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 1 && slug.length <= 100;
};

/**
 * Update slug if title has changed
 * @param {Object} document - The document being updated
 * @param {string} newTitle - The new title
 * @param {string} modelName - The model name
 * @returns {string} - Updated slug
 */
const updateSlugIfNeeded = async (document, newTitle, modelName) => {
  const currentTitleSlug = generateBasicSlug(newTitle);
  const currentDocSlug = generateBasicSlug(document.title);

  // If the basic slug would be different, generate a new unique slug
  if (currentTitleSlug !== currentDocSlug) {
    return await generateSlug(newTitle, modelName, document._id);
  }

  // Return existing slug if title hasn't changed significantly
  return document.slug;
};

/**
 * Generate slug for search-friendly URLs
 * @param {string} text - Text to convert to slug
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} - URL-friendly slug
 */
const generateUrlSlug = (text, maxLength = 50) => {
  if (!text) return '';

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, maxLength);
};

/**
 * Extract slug from URL or path
 * @param {string} url - URL or path containing slug
 * @returns {string} - Extracted slug
 */
const extractSlugFromUrl = (url) => {
  if (!url) return '';

  // Remove query parameters and hash
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  // Extract last segment as slug
  const segments = cleanUrl.split('/').filter(segment => segment.length > 0);
  return segments[segments.length - 1] || '';
};

module.exports = {
  generateSlug,
  generateBasicSlug,
  isValidSlug,
  updateSlugIfNeeded,
  generateUrlSlug,
  extractSlugFromUrl
}; 