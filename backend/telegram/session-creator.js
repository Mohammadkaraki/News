const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');

console.log('🔧 Session Creator - Quick Fix');
console.log('===============================');

const API_ID = 28950354;
const API_HASH = 'a5044c66c602c331c0e39cc6f7068d78';
const PHONE = '+96170187891';

async function createSession() {
    const client = new TelegramClient(new StringSession(''), API_ID, API_HASH, {
        connectionRetries: 2,
        connectionTimeout: 15000,
    });

    try {
        console.log('🔗 Connecting...');
        await client.connect();
        console.log('✅ Connected!');

        console.log('📱 Starting auth...');
        await client.start({
            phoneNumber: () => PHONE,
            password: async () => {
                const pwd = await input.text('2FA Password (or Enter to skip): ');
                return pwd || undefined;
            },
            phoneCode: async () => {
                console.log('📨 Check your Telegram for the code!');
                return await input.text('Enter the 5-digit code: ');
            }
        });

        const session = client.session.save();
        console.log('\n✅ SUCCESS! New session created:');
        console.log('🔑 Session String:');
        console.log(session);
        
        // Update config
        const config = fs.readFileSync('./test-config.js', 'utf8');
        const updated = config.replace(
            /TELEGRAM_SESSION_STRING: '[^']*'/,
            `TELEGRAM_SESSION_STRING: '${session}'`
        );
        fs.writeFileSync('./test-config.js', updated);
        console.log('\n✅ Updated test-config.js!');

        // Quick test
        const me = await client.getMe();
        console.log(`👤 Logged in as: ${me.firstName}`);
        
        await client.disconnect();
        console.log('\n🎉 Ready to test! Run: node real-listener.js');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createSession(); 