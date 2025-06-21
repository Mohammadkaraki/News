const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

// Load test config and services
const testConfig = require('./test-config');
const ArticleService = require('./services/ArticleService');
const FileArticleService = require('./services/FileArticleService');
const ImageService = require('./services/ImageService');

console.log('🤖 REAL Telegram Article Creator');
console.log('=================================');
console.log(`📱 Phone: ${testConfig.PHONE_NUMBER}`);
console.log(`📺 Listening to channel: Deep123321 (ID: 2884922529) → sports category`);
console.log('');

async function realChannelListener() {
    try {
        // Initialize services
        const articleService = testConfig.USE_DIRECT_DB ? new ArticleService() : new FileArticleService();
        const imageService = new ImageService();

        // Create uploads directory
        const uploadsDir = path.join(__dirname, '../uploads/telegram');
        fs.ensureDirSync(uploadsDir);

        // Create Telegram client with saved session
        const session = new StringSession(testConfig.TELEGRAM_SESSION_STRING);
        const client = new TelegramClient(session, testConfig.TELEGRAM_API_ID, testConfig.TELEGRAM_API_HASH, {
            connectionRetries: 5,
        });

        console.log('🔗 Connecting to Telegram...');
        
        // Use the start method with timeout
        const connectTimeout = setTimeout(() => {
            console.log('⚠️  Connection taking too long, this is normal for first time...');
        }, 10000);
        
        await client.start();
        clearTimeout(connectTimeout);
        console.log('✅ Successfully connected to Telegram!');

        // Set up message listener
        console.log('🔍 Setting up channel listener...');
        
        client.addEventHandler(async (event) => {
            const message = event.message;
            
            // Check if message has photo
            if (!message.media || !message.photo) {
                return; // Skip messages without photos
            }

            // Get channel info
            const chat = await message.getChat();
            const channelId = chat.id.toString();
            
            console.log(`\n📨 New message from: ${chat.title || chat.username || channelId}`);
            
            // Check if this is our target channel
            if (channelId === '2884922529' || channelId === '-2884922529') {
                console.log('🎯 This is our target channel! Creating real article...');
                
                const caption = message.text || message.message || '';
                console.log(`📸 Photo with caption: "${caption.substring(0, 100)}..."`);
                
                try {
                    // Download and process image
                    console.log('📥 Downloading image...');
                    const timestamp = Date.now();
                    const filename = `telegram_${timestamp}.jpg`;
                    const tempPath = path.join(uploadsDir, `temp_${filename}`);
                    const finalPath = path.join(uploadsDir, filename);

                    // Download image from Telegram
                    const buffer = await client.downloadMedia(message.media);
                    
                    // Save buffer to temp file
                    await fs.writeFile(tempPath, buffer);
                    console.log(`💾 Image saved to: ${tempPath}`);

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

                    // Upload image
                    const imageUrl = await imageService.uploadImage(finalPath);
                    console.log(`✅ Image uploaded: ${imageUrl}`);

                    // Extract title from caption (first sentence or first 60 chars)
                    const title = caption.split(/[.!?]+/)[0].trim() || 'Sports Update';
                    const excerpt = caption.substring(0, 200).trim();

                    // Create article data
                    const articleData = {
                        title: title.length > 80 ? title.substring(0, 77) + '...' : title,
                        excerpt: excerpt,
                        content: caption,
                        image: {
                            url: imageUrl,
                            alt: title,
                            caption: excerpt
                        },
                        categorySlug: 'sports',
                        status: 'published',
                        publishedAt: new Date(),
                        tags: (caption.match(/#\w+/g) || []).map(tag => tag.substring(1).toLowerCase()),
                        source: 'telegram'
                    };

                    // Create article in database
                    console.log('📄 Creating article in database...');
                    const article = await articleService.createArticle(articleData);
                    
                    console.log('🎉 SUCCESS! Article created:');
                    console.log(`   Title: "${article.title}"`);
                    console.log(`   Category: sports`);
                    console.log(`   Content: ${caption.substring(0, 100)}...`);
                    console.log(`   Article ID: ${article._id}`);
                    
                } catch (error) {
                    console.error('❌ Error creating article:', error.message);
                }
                
            } else {
                console.log(`⏭️  Not our target channel (ID: ${channelId})`);
            }
            
        }, new NewMessage({}));

        console.log('🚀 Bot is now listening for messages...');
        console.log('📺 Waiting for messages from channel Deep123321 (ID: 2884922529)...');
        console.log('💡 Send a message with photo to that channel to create real articles!');
        console.log('⏹️  Press Ctrl+C to stop');

        // Keep running
        console.log('📱 Sending test message to yourself...');
        await client.sendMessage('me', { message: '🤖 Real article creator is now running! Send photos to Deep123321 channel.' });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

realChannelListener(); 