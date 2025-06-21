require('dotenv').config({ path: '../.env' });
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

// Load test config and services
const testConfig = require('./test-config');
const HybridArticleService = require('./services/HybridArticleService');
const ImageService = require('./services/ImageService');

console.log('🤖 REAL Telegram Article Creator');
console.log('=================================');
console.log(`📱 Phone: ${testConfig.PHONE_NUMBER}`);
console.log(`📺 Listening to channels:`);
console.log(`   - Deep123321 (ID: 2884922529) → sports category`);
console.log(`   - testing123123123123123123123 → business category`);
console.log('');

async function realChannelListener() {
    try {
        // Initialize services
        const articleService = new HybridArticleService();
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
            
            // Check if this is one of our target channels
            let targetCategory = null;
            let channelName = '';
            
            // Sports channel: Deep123321 (ID: 2884922529)
            if (channelId === '2884922529' || channelId === '-2884922529') {
                targetCategory = 'sports';
                channelName = 'Deep123321 (Sports)';
            }
            // Business channel: testing123123123123123123123 (we'll get the ID when first message arrives)
            else if (chat.username === 'testing123123123123123123123' || 
                     chat.title?.includes('testing123123123123123123123') ||
                     channelId === 'BUSINESS_CHANNEL_ID_PLACEHOLDER') {
                targetCategory = 'business';
                channelName = 'testing123123123123123123123 (Business)';
                console.log(`📝 Business channel ID detected: ${channelId}`);
            }
            
            if (targetCategory) {
                console.log(`🎯 This is our ${targetCategory} channel (${channelName})! Creating real article...`);
                
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

                    // Create article with AI enhancement
                    const telegramData = {
                        caption: caption,
                        image: {
                            url: imageUrl,
                            alt: targetCategory === 'sports' ? 'Sports Image' : 'Business Image',
                            caption: caption
                        },
                        categorySlug: targetCategory
                    };

                    // Create article in database with AI enhancement
                    console.log(`📄 Creating AI-enhanced ${targetCategory} article in database...`);
                    const article = await articleService.createArticleFromTelegram(telegramData);
                    
                    console.log('🎉 SUCCESS! Article created:');
                    console.log(`   Title: "${article.title}"`);
                    console.log(`   Category: ${targetCategory}`);
                    console.log(`   Content: ${caption.substring(0, 100)}...`);
                    console.log(`   Article ID: ${article._id}`);
                    
                } catch (error) {
                    console.error('❌ Error creating article:', error.message);
                }
                
            } else {
                console.log(`⏭️  Not our target channel (ID: ${channelId}, Username: ${chat.username || 'N/A'}, Title: ${chat.title || 'N/A'})`);
            }
            
        }, new NewMessage({}));

        console.log('🚀 Bot is now listening for messages...');
        console.log('📺 Waiting for messages from channels:');
        console.log('   - Deep123321 (ID: 2884922529) → sports articles');
        console.log('   - testing123123123123123123123 → business articles');
        console.log('💡 Send a message with photo to either channel to create real articles!');
        console.log('⏹️  Press Ctrl+C to stop');

        // Keep running
        console.log('📱 Sending test message to yourself...');
        await client.sendMessage('me', { 
            message: '🤖 Real article creator is now running!\n📺 Channels:\n- Deep123321 → Sports\n- testing123123123123123123123 → Business\n\nSend photos to either channel to create articles!' 
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

realChannelListener(); 