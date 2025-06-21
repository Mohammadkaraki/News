const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const fs = require('fs-extra');
const path = require('path');

const testConfig = require('./test-config');

console.log('🧪 Test Image Download');
console.log('======================');

async function testDownload() {
    try {
        // Create uploads directory
        const uploadsDir = path.join(__dirname, '../uploads/telegram');
        fs.ensureDirSync(uploadsDir);
        console.log(`📁 Upload directory: ${uploadsDir}`);

        // Create client
        const session = new StringSession(testConfig.TELEGRAM_SESSION_STRING);
        const client = new TelegramClient(session, testConfig.TELEGRAM_API_ID, testConfig.TELEGRAM_API_HASH, {
            connectionRetries: 5,
        });

        console.log('🔗 Connecting...');
        await client.start();
        console.log('✅ Connected!');

        // Set up message listener
        client.addEventHandler(async (event) => {
            const message = event.message;
            
            if (!message.media || !message.photo) {
                console.log('⏭️  Skipping non-photo message');
                return;
            }

            const chat = await message.getChat();
            console.log(`\n📨 Photo message from: ${chat.title || chat.id}`);
            
            if (chat.id.toString() === '2884922529' || chat.id.toString() === '-2884922529') {
                console.log('🎯 Target channel detected!');
                
                try {
                    const timestamp = Date.now();
                    const filename = `test_${timestamp}.jpg`;
                    const filepath = path.join(uploadsDir, filename);
                    
                    console.log('📥 Downloading image...');
                    console.log(`   Target file: ${filepath}`);
                    
                    // Method 1: Download as buffer
                    console.log('🔄 Method 1: Download as buffer...');
                    const buffer = await client.downloadMedia(message.media);
                    console.log(`✅ Downloaded ${buffer.length} bytes`);
                    
                    // Save buffer to file
                    await fs.writeFile(filepath, buffer);
                    console.log(`💾 Saved to: ${filepath}`);
                    
                    // Check if file exists
                    const exists = await fs.pathExists(filepath);
                    console.log(`📋 File exists: ${exists}`);
                    
                    if (exists) {
                        const stats = await fs.stat(filepath);
                        console.log(`📊 File size: ${stats.size} bytes`);
                        console.log('🎉 SUCCESS! Image downloaded and saved!');
                        
                        // Test if we can read it
                        const testBuffer = await fs.readFile(filepath);
                        console.log(`🔍 File readable: ${testBuffer.length} bytes`);
                    } else {
                        console.log('❌ File was not created!');
                    }
                    
                } catch (error) {
                    console.error('❌ Download error:', error.message);
                    console.error('Stack:', error.stack);
                }
            }
            
        }, new NewMessage({}));

        console.log('🚀 Listening for photo messages...');
        console.log('📺 Send a photo to Deep123321 channel to test!');
        
        // Send test message
        await client.sendMessage('me', { message: '🧪 Download test is running!' });
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
    }
}

testDownload(); 