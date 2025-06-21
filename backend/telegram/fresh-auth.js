const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');

console.log('🆕 Fresh Authentication');
console.log('=======================');

const testConfig = require('./test-config');

async function freshAuth() {
    try {
        console.log('📋 Configuration:');
        console.log('- API ID:', testConfig.TELEGRAM_API_ID);
        console.log('- Phone:', testConfig.PHONE_NUMBER);
        console.log('- Session:', testConfig.TELEGRAM_SESSION_STRING ? 'EXISTS' : 'EMPTY ✅');
        
        // Create client with empty session (fresh start)
        const session = new StringSession('');
        const client = new TelegramClient(session, testConfig.TELEGRAM_API_ID, testConfig.TELEGRAM_API_HASH, {
            connectionRetries: 5,
            connectionTimeout: 20000,
        });

        console.log('\n🔗 Connecting to Telegram servers...');
        await client.connect();
        console.log('✅ Connected successfully!');

        console.log('\n📱 Starting authentication process...');
        
        // Use the interactive start method
        await client.start({
            phoneNumber: async () => {
                console.log(`📞 Using phone number: ${testConfig.PHONE_NUMBER}`);
                return testConfig.PHONE_NUMBER;
            },
            password: async () => {
                console.log('🔐 Two-Factor Authentication');
                const password = await input.text('Enter your 2FA password (or press Enter if you don\'t have 2FA): ');
                return password || undefined;
            },
            phoneCode: async () => {
                console.log('📨 A login code has been sent to your Telegram app');
                console.log('Check your Telegram mobile app or desktop app');
                const code = await input.text('Enter the 5-digit code: ');
                return code;
            },
            onError: (err) => {
                console.log('❌ Authentication error:', err.message);
                if (err.message.includes('PHONE_CODE_INVALID')) {
                    console.log('💡 The code you entered is invalid. Please try again.');
                }
                if (err.message.includes('SESSION_PASSWORD_NEEDED')) {
                    console.log('💡 Two-factor authentication is required.');
                }
            },
        });

        console.log('\n✅ Authentication successful!');

        // Get user information
        const me = await client.getMe();
        console.log(`👤 Successfully logged in as: ${me.firstName} ${me.lastName || ''}`);
        console.log(`📱 Phone: ${me.phone}`);

        // Save the new session string
        const newSessionString = client.session.save();
        console.log('\n🔑 Generated new session string:');
        console.log('='.repeat(80));
        console.log(newSessionString);
        console.log('='.repeat(80));

        // Update the test-config.js file
        const configPath = './test-config.js';
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        const updatedConfig = configContent.replace(
            /TELEGRAM_SESSION_STRING: '[^']*'/,
            `TELEGRAM_SESSION_STRING: '${newSessionString}'`
        );

        fs.writeFileSync(configPath, updatedConfig);
        console.log('\n✅ Updated test-config.js with new session string!');

        // Test by getting dialogs
        console.log('\n📂 Testing connection by fetching dialogs...');
        const dialogs = await client.getDialogs({ limit: 10 });
        console.log(`✅ Found ${dialogs.length} dialogs/chats`);

        // Look for the target channel
        let channelFound = false;
        console.log('\n📺 Looking for target channels:');
        
        for (const dialog of dialogs) {
            const entity = dialog.entity;
            const id = entity.id.toString();
            const name = entity.title || entity.username || entity.firstName || id;
            
            console.log(`  - ${name} (ID: ${id})`);
            
            // Check for our target channel
            if (id === '2884922529' || id === '-2884922529' || 
                name.toLowerCase().includes('deep123321')) {
                console.log('    🎯 TARGET CHANNEL FOUND!');
                channelFound = true;
            }
        }

        if (!channelFound) {
            console.log('\n⚠️  Target channel Deep123321 not found in your dialogs');
            console.log('💡 Make sure you have joined this channel first');
        } else {
            console.log('\n✅ Target channel is accessible!');
        }

        await client.disconnect();
        console.log('\n🎉 Fresh authentication complete!');
        console.log('Now you can run: node real-listener.js');

    } catch (error) {
        console.error('\n❌ Authentication failed:', error.message);
        
        if (error.message.includes('FLOOD_WAIT')) {
            console.log('⏳ Rate limited. Please wait a few minutes before trying again.');
        } else if (error.message.includes('PHONE_NUMBER_INVALID')) {
            console.log('📱 The phone number format is invalid. Check the number in test-config.js');
        } else if (error.message.includes('AUTH_KEY_DUPLICATED')) {
            console.log('🔄 Session conflict. Try logging out of other devices first.');
        }
        
        console.error('Stack trace:', error.stack);
    }
}

freshAuth(); 