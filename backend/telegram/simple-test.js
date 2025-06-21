const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');

// Load test config
const testConfig = require('./test-config');

console.log('🧪 Simple Connection Test');
console.log('=========================');

async function simpleTest() {
    try {
        // Create client with session
        const session = new StringSession(testConfig.TELEGRAM_SESSION_STRING);
        const client = new TelegramClient(session, testConfig.TELEGRAM_API_ID, testConfig.TELEGRAM_API_HASH, {
            connectionRetries: 5,
        });

        console.log('🔗 Connecting...');
        
        // Try to connect
        await client.connect();
        console.log('✅ Connected!');

        // Test getting account info
        const me = await client.getMe();
        console.log(`👤 Logged in as: ${me.firstName} ${me.lastName || ''}`);

        // Set up simple message listener
        client.addEventHandler(async (event) => {
            const message = event.message;
            const chat = await message.getChat();
            console.log(`📨 Message from: ${chat.title || chat.username || chat.id}`);
            console.log(`📝 Content: ${message.text || 'Media message'}`);
            
            // Check if it's our target channel
            if (chat.id.toString() === '2884922529') {
                console.log('🎯 TARGET CHANNEL DETECTED!');
                if (message.media && message.photo) {
                    console.log('📸 HAS PHOTO - WOULD CREATE ARTICLE!');
                }
            }
        }, new NewMessage({}));

        console.log('🚀 Listening for messages...');
        console.log('💡 Send a message to Deep123321 channel to test!');

        // Send test message to self
        await client.sendMessage('me', { message: '🧪 Simple test is running!' });
        console.log('📱 Test message sent to yourself');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

simpleTest(); 