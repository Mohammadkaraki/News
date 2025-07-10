const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const TelegramService = require('./services/TelegramService');
const HybridArticleService = require('./services/HybridArticleService');
const ImageService = require('./services/ImageService');

// Channel to Category mapping - matches navbar: عالم سياسة اقتصاد رياضة فن
const CHANNEL_CATEGORY_MAP = {
    // Politics (سياسة) - Deep123321 channel
    'deep123321123': 'politics',
    '2884922529': 'politics',
    '-2884922529': 'politics',
    
    // World News (عالم) - AlarabyTelevision channel  
    'AlarabyTelevision': 'world',
    '@AlarabyTelevision': 'world',
    'التلفزيون العربي': 'world',
    
    // Economy/Business (اقتصاد) - CNN Business channels
    'CNNBusinessAr': 'business',
    '@CNNBusinessAr': 'business',
    'CNNBusiness': 'business',
    '@CNNBusiness': 'business',
    'CNN Business Arabic | الاقتصادية CNN': 'business',
    
    // Sports (رياضة) - beINSPORTS channel
    'beINSPORTS': 'sports',
    '@beINSPORTS': 'sports',
    
    // Art/Entertainment (فن) - muraselonDrama channel
    'muraselonDrama': 'entertainment',
    '@muraselonDrama': 'entertainment'
};

class TelegramBot {
    constructor() {
        this.client = null;
        this.telegramService = new TelegramService();
        this.articleService = new HybridArticleService();
        this.imageService = new ImageService();
        
        // Create uploads directory if it doesn't exist
        this.uploadsDir = path.join(__dirname, '../uploads/telegram');
        fs.ensureDirSync(this.uploadsDir);
    }

    async initialize() {
        try {
            console.log('Initializing Telegram Bot...');
            
            // Check if required environment variables exist
            this.validateEnvironment();
            
            // Initialize Telegram client
            await this.telegramService.connect();
            this.client = this.telegramService.client;
            
            console.log('✅ Telegram Bot initialized successfully');
            
            // Set up message handler
            this.setupMessageHandler();
            
            console.log('🚀 Bot is now listening for messages...');
            
        } catch (error) {
            console.error('❌ Error initializing Telegram Bot:', error);
            process.exit(1);
        }
    }

    validateEnvironment() {
        const required = ['TELEGRAM_API_ID', 'TELEGRAM_API_HASH', 'TELEGRAM_SESSION_STRING'];
        const missing = required.filter(key => !process.env[key]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }

    setupMessageHandler() {
        this.client.addEventHandler(async (event) => {
            try {
                await this.handleMessage(event);
            } catch (error) {
                console.error('Error handling message:', error);
            }
        }, new NewMessage({}));
    }

    async handleMessage(event) {
        const message = event.message;
        
        // Check if message has media (photo)
        if (!message.media || !message.photo) {
            return;
        }

        // Get channel information
        const chat = await message.getChat();
        const channelId = chat.id.toString();
        const channelUsername = chat.username;
        
        console.log(`📨 New message from channel: ${chat.title || channelUsername || channelId}`);
        
        // Check if this channel is in our mapping
        const categorySlug = this.getCategoryForChannel(channelId, channelUsername);
        if (!categorySlug) {
            console.log(`⏭️  Skipping channel ${channelId} - not in category mapping`);
            return;
        }

        // Get message text (caption)
        const caption = message.text || message.message || '';
        if (!caption.trim()) {
            console.log('⏭️  Skipping message without caption');
            return;
        }

        console.log(`📝 Processing message for category: ${categorySlug}`);
        console.log(`📸 Caption: ${caption.substring(0, 100)}...`);

        try {
            // Download and process image
            const imagePath = await this.downloadAndProcessImage(message);
            
            // Create article
            await this.createArticleFromMessage(caption, imagePath, categorySlug, message.date);
            
            console.log('✅ Article created successfully');
            
        } catch (error) {
            console.error('❌ Error processing message:', error);
        }
    }

    getCategoryForChannel(channelId, channelUsername) {
        // Check by channel ID first
        if (CHANNEL_CATEGORY_MAP[channelId]) {
            return CHANNEL_CATEGORY_MAP[channelId];
        }
        
        // Check by username (with or without @)
        if (channelUsername) {
            const usernameWithAt = `@${channelUsername}`;
            if (CHANNEL_CATEGORY_MAP[channelUsername] || CHANNEL_CATEGORY_MAP[usernameWithAt]) {
                return CHANNEL_CATEGORY_MAP[channelUsername] || CHANNEL_CATEGORY_MAP[usernameWithAt];
            }
        }
        
        return null;
    }

    async downloadAndProcessImage(message) {
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const filename = `telegram_${timestamp}.jpg`;
            const tempPath = path.join(this.uploadsDir, `temp_${filename}`);
            const finalPath = path.join(this.uploadsDir, filename);

            // Download image
            console.log('📥 Downloading image...');
            const buffer = await this.client.downloadMedia(message.media);
            await fs.writeFile(tempPath, buffer);
            
            // Check if file exists
            if (!await fs.pathExists(tempPath)) {
                throw new Error(`Downloaded file not found: ${tempPath}`);
            }

            // Process image (resize, optimize)
            console.log('🖼️  Processing image...');
            await sharp(tempPath)
                .resize(1200, 800, { 
                    fit: 'inside',
                    withoutEnlargement: true 
                })
                .jpeg({ quality: 85 })
                .toFile(finalPath);

            // Clean up temp file
            await fs.remove(tempPath);

            // Upload to your image service (Cloudinary or local)
            const imageUrl = await this.imageService.uploadImage(finalPath);
            
            // Clean up local file if uploaded to cloud
            if (imageUrl.startsWith('http')) {
                await fs.remove(finalPath);
            }

            return imageUrl;

        } catch (error) {
            console.error('Error downloading/processing image:', error);
            throw error;
        }
    }

    async createArticleFromMessage(caption, imageUrl, categorySlug, messageDate) {
        try {
            // Create Telegram data object for AI enhancement
            const telegramData = {
                caption,
                image: {
                    url: imageUrl,
                    alt: caption.substring(0, 60),
                    caption: caption.substring(0, 200)
                },
                categorySlug,
                publishedAt: messageDate,
                source: 'telegram'
            };

            // Create article through HybridArticleService (includes AI enhancement)
            const createdArticle = await this.articleService.createArticleFromTelegram(telegramData);
            
            console.log(`✅ AI-Enhanced article created: "${createdArticle.title}"`);
            
        } catch (error) {
            console.error('Error creating article:', error);
            throw error;
        }
    }

    extractTitle(caption) {
        // Try to get first sentence
        const sentences = caption.split(/[.!?]+/);
        let title = sentences[0].trim();
        
        // If first sentence is too long, truncate
        if (title.length > 80) {
            title = title.substring(0, 77) + '...';
        }
        
        // If no good title found, use default
        if (title.length < 10) {
            title = 'News Update';
        }
        
        return title;
    }

    extractTags(caption) {
        // Extract hashtags
        const hashtags = caption.match(/#\w+/g) || [];
        return hashtags.map(tag => tag.substring(1).toLowerCase());
    }

    async start() {
        console.log('🤖 Starting Telegram News Bot...');
        await this.initialize();
        
        // Keep the process running
        console.log('✅ Bot is running. Press Ctrl+C to stop.');
        
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n🛑 Shutting down bot...');
            if (this.client) {
                await this.client.disconnect();
            }
            process.exit(0);
        });
    }
}

// Start the bot if this file is run directly
if (require.main === module) {
    const bot = new TelegramBot();
    bot.start().catch(console.error);
}

module.exports = TelegramBot; 