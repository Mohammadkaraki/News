const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const input = require('input');

// Load test config
const testConfig = require('./test-config');

console.log('🐛 Debug Connection Test');
console.log('========================');

async function debugConnection() {
    try {
        console.log('📋 Configuration check:');
        console.log('- API ID:', testConfig.TELEGRAM_API_ID ? '✅ Set' : '❌ Missing');
        console.log('- API Hash:', testConfig.TELEGRAM_API_HASH ? '✅ Set' : '❌ Missing');
        console.log('- Session String:', testConfig.TELEGRAM_SESSION_STRING ? '✅ Set' : '❌ Missing');

        // Create client
        const session = new StringSession(testConfig.TELEGRAM_SESSION_STRING || '');
        const client = new TelegramClient(session, testConfig.TELEGRAM_API_ID, testConfig.TELEGRAM_API_HASH, {
            connectionRetries: 3,
            connectionTimeout: 30000,
            autoReconnect: true,
            baseLogger: {
                info: (msg) => console.log(`[INFO] ${msg}`),
                warn: (msg) => console.log(`[WARN] ${msg}`),
                error: (msg) => console.log(`[ERROR] ${msg}`),
                debug: (msg) => console.log(`[DEBUG] ${msg}`)
            }
        });

        console.log('🔗 Starting connection...');
        
        // Check if we need to login
        if (!testConfig.TELEGRAM_SESSION_STRING) {
            console.log('⚠️  No session string found, need to login...');
            
            await client.start({
                phoneNumber: async () => await input.text('Phone number: '),
                password: async () => await input.text('Password: '),
                phoneCode: async () => await input.text('Code: '),
                onError: (err) => console.log('Login error:', err),
            });
            
            console.log('Session string:', client.session.save());
        } else {
            console.log('📱 Using existing session...');
            await client.connect();
        }
        
        console.log('✅ Connected successfully!');
        
        // Get user info
        const me = await client.getMe();
        console.log(`👤 Logged in as: ${me.firstName} ${me.lastName || ''} (${me.phone})`);
        
        // Test getting dialogs
        console.log('📂 Getting dialogs...');
        const dialogs = await client.getDialogs({ limit: 5 });
        console.log(`📋 Found ${dialogs.length} dialogs`);
        
        // Look for our target channel
        let targetChannel = null;
        for (const dialog of dialogs) {
            const entity = dialog.entity;
            console.log(`- ${entity.title || entity.username || entity.id} (ID: ${entity.id})`);
            
            if (entity.id.toString() === '2884922529' || 
                entity.username === 'Deep123321' ||
                entity.title === 'Deep123321') {
                targetChannel = entity;
                console.log('  🎯 TARGET CHANNEL FOUND!');
            }
        }
        
        if (!targetChannel) {
            console.log('❌ Target channel not found in your dialogs');
            console.log('💡 Make sure you have joined the channel');
        } else {
            console.log('✅ Target channel found and accessible');
        }
        
        // Set up message listener
        console.log('👂 Setting up message listener...');
        client.addEventHandler(async (event) => {
            try {
                const message = event.message;
                const chat = await message.getChat();
                
                console.log('\n📨 New message received!');
                console.log(`From: ${chat.title || chat.username || chat.id}`);
                console.log(`Chat ID: ${chat.id}`);
                console.log(`Message: ${message.text || 'Media message'}`);
                
                if (chat.id.toString() === '2884922529') {
                    console.log('🎯 THIS IS OUR TARGET CHANNEL!');
                    if (message.media && (message.photo || message.document)) {
                        console.log('📸 HAS MEDIA - WOULD CREATE ARTICLE!');
                    }
                }
            } catch (err) {
                console.error('Error handling message:', err);
            }
        }, new NewMessage({}));
        
        console.log('🚀 Bot is now listening...');
        console.log('💡 Send a message to any channel to test!');
        
        // Send test message to self
        try {
            await client.sendMessage('me', { message: '🧪 Debug test is running!' });
            console.log('📱 Test message sent to yourself');
        } catch (err) {
            console.log('⚠️  Could not send test message:', err.message);
        }
        
        // Keep alive
        console.log('⏳ Keeping connection alive...');
        
    } catch (error) {
        console.error('❌ Debug Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

debugConnection(); 