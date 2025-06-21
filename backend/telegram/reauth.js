const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

// Use the credentials from test-config
const testConfig = require('./test-config');

console.log('🔄 Re-authentication Script');
console.log('============================');

async function reauth() {
    try {
        console.log('📋 Using credentials:');
        console.log('- API ID:', testConfig.TELEGRAM_API_ID);
        console.log('- Phone:', testConfig.PHONE_NUMBER);
        
        // Create new client with empty session
        const session = new StringSession('');
        const client = new TelegramClient(session, testConfig.TELEGRAM_API_ID, testConfig.TELEGRAM_API_HASH, {
            connectionRetries: 5,
        });

        console.log('🔗 Starting fresh authentication...');
        
        await client.start({
            phoneNumber: async () => {
                console.log(`📱 Using phone: ${testConfig.PHONE_NUMBER}`);
                return testConfig.PHONE_NUMBER;
            },
            password: async () => {
                const pass = await input.text('🔐 Password (if you have 2FA): ');
                return pass;
            },
            phoneCode: async () => {
                const code = await input.text('📨 Enter the code from Telegram: ');
                return code;
            },
            onError: (err) => console.log('❌ Login error:', err),
        });

        console.log('✅ Authentication successful!');
        
        // Get user info
        const me = await client.getMe();
        console.log(`👤 Logged in as: ${me.firstName} ${me.lastName || ''}`);
        
        // Save new session string
        const newSessionString = client.session.save();
        console.log('\n🔑 NEW SESSION STRING:');
        console.log('='.repeat(50));
        console.log(newSessionString);
        console.log('='.repeat(50));
        
        console.log('\n📝 Update your test-config.js with this new session string!');
        
        // Test the connection by getting dialogs
        console.log('\n📂 Testing connection by getting dialogs...');
        const dialogs = await client.getDialogs({ limit: 10 });
        console.log(`✅ Successfully got ${dialogs.length} dialogs`);
        
        // Look for target channel
        let targetFound = false;
        for (const dialog of dialogs) {
            const entity = dialog.entity;
            console.log(`- ${entity.title || entity.username || entity.id} (ID: ${entity.id})`);
            
            if (entity.id.toString() === '2884922529' || 
                (entity.username && entity.username.toLowerCase().includes('deep123321')) ||
                (entity.title && entity.title.toLowerCase().includes('deep123321'))) {
                console.log('  🎯 TARGET CHANNEL FOUND!');
                targetFound = true;
            }
        }
        
        if (!targetFound) {
            console.log('\n⚠️  Target channel not found in your dialogs');
            console.log('Make sure you have joined the Deep123321 channel first!');
        } else {
            console.log('\n✅ Target channel is accessible!');
        }
        
        await client.disconnect();
        console.log('\n✅ Re-authentication complete!');
        
    } catch (error) {
        console.error('❌ Re-auth Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

reauth(); 