// Example configuration for Telegram News Bot
// Copy this file to config.js and modify according to your needs

const CHANNEL_CATEGORY_MAP = {
    // Map channel IDs to category slugs
    'deep123321123': 'sport',
    
    // You can also use channel usernames (with or without @)
    '@SportNewsChannel': 'sport',
    'BusinessDailyChannel': 'business',
    '@TechNewsUpdates': 'technology',
    
    // Add more mappings as needed
    // Format: 'channel_id_or_username': 'category_slug'
};

// Bot configuration
const BOT_CONFIG = {
    // Whether to auto-publish articles (true) or keep as draft (false)
    autoPublish: true,
    
    // Default article status
    defaultStatus: 'published',
    
    // Whether to extract hashtags as tags
    extractHashtags: true,
    
    // Maximum title length
    maxTitleLength: 80,
    
    // Maximum excerpt length
    maxExcerptLength: 200,
    
    // Image processing settings
    image: {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 85
    },
    
    // Filters - skip messages that match these criteria
    filters: {
        // Skip messages shorter than this (in characters)
        minCaptionLength: 10,
        
        // Skip messages without images
        requireImage: true,
        
        // Skip messages containing these words (case insensitive)
        blacklistWords: ['spam', 'advertisement', 'promo'],
        
        // Only process messages containing these words (empty = process all)
        whitelistWords: []
    }
};

module.exports = {
    CHANNEL_CATEGORY_MAP,
    BOT_CONFIG
}; 