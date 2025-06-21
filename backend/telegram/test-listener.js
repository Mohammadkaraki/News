const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const input = require('input');

// Load test config
const testConfig = require('./test-config');

console.log('🤖 Simple Telegram Channel Listener Test');
console.log('==========================================');
console.log(`📱 Phone: ${testConfig.PHONE_NUMBER}`);
console.log(`📺 Listening to channel: Deep123321 (ID: 2884922529) → sport category`);
console.log('');

async function testChannelListener() {
    try {
        // Create Telegram client
        const session = new StringSession(''); // Empty session for first time
        const client = new TelegramClient(session, testConfig.TELEGRAM_API_ID, testConfig.TELEGRAM_API_HASH, {
            connectionRetries: 5,
        });

        console.log('🔗 Connecting to Telegram...');
        
        // Authenticate
        await client.start({
            phoneNumber: async () => testConfig.PHONE_NUMBER,
            password: async () => {
                const pwd = await input.text('🔐 Enter 2FA password (or press Enter if none): ');
                return pwd || undefined;
            },
            phoneCode: async () => await input.text('📨 Enter the verification code you received: '),
            onError: (err) => console.error('❌ Auth error:', err),
        });

        console.log('✅ Successfully connected to Telegram!');
        
        // Save session for next time
        const sessionString = client.session.save();
        console.log('\n💾 Session string (save this for future use):');
        console.log(sessionString);
        console.log('');

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
                console.log('🎯 This is our target channel!');
                
                const caption = message.text || message.message || '';
                console.log(`📸 Photo with caption: "${caption.substring(0, 100)}..."`);
                
                // Here's where we would create the article
                console.log('✅ Would create article in "sport" category with this content!');
                console.log(`   Title: ${caption.split('.')[0] || 'Sports Update'}`);
                console.log(`   Content: ${caption}`);
                console.log(`   Category: sport`);
                
            } else {
                console.log(`⏭️  Not our target channel (ID: ${channelId})`);
            }
            
        }, new NewMessage({}));

        console.log('🚀 Bot is now listening for messages...');
        console.log('📺 Waiting for messages from channel Deep123321 (ID: 2884922529)...');
        console.log('💡 Send a message with photo to that channel to test!');
        console.log('⏹️  Press Ctrl+C to stop');

        // Keep running
        await client.sendMessage('me', { message: '🤖 Bot is now listening to channels!' });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testChannelListener(); 