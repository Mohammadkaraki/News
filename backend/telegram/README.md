# Telegram News Bot Integration

This system automatically creates news articles from Telegram channel messages that contain photos and captions.

## 🚀 Features

- ✅ Listen to multiple Telegram channels
- ✅ Download and process images from messages
- ✅ Extract titles from message captions
- ✅ Auto-categorize articles based on channel
- ✅ Extract hashtags as article tags
- ✅ Upload images to Cloudinary or local storage
- ✅ Create articles directly in your news website

## 📋 Prerequisites

1. **Telegram API Credentials**
   - Go to [my.telegram.org](https://my.telegram.org)
   - Create an application to get `api_id` and `api_hash`

2. **Node.js Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Ensure MongoDB is running
   - Categories should exist in your database

## ⚙️ Configuration

### 1. Environment Variables

Copy `env.example` to `.env` and fill in your credentials:

```env
# Telegram Configuration
TELEGRAM_API_ID=your-telegram-api-id
TELEGRAM_API_HASH=your-telegram-api-hash
TELEGRAM_SESSION_STRING=your-session-string-here

# Database
MONGODB_URI=mongodb://localhost:27017/news-db

# Image Storage (optional - defaults to local)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Channel Mapping

Edit `telegramBot.js` to configure your channel mappings:

```javascript
const CHANNEL_CATEGORY_MAP = {
    'deep123321123': 'sport',           // Channel ID
    '@SportNewsChannel': 'sport',       // Username with @
    'BusinessDailyChannel': 'business', // Username without @
    // Add more mappings as needed
};
```

## 🛠️ Setup Process

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Run Setup Utility
```bash
node telegram/setup.js
```

This will help you:
- Authenticate with Telegram
- List available channels to get their IDs
- Test your category mappings
- Create test categories

### Step 3: Configure Channel Mapping

After running setup, you'll see your available channels. Update the `CHANNEL_CATEGORY_MAP` in `telegramBot.js` with the correct channel IDs and category slugs.

### Step 4: Start the Bot
```bash
npm run telegram:start
```

Or manually:
```bash
node telegram/telegramBot.js
```

## 📁 Project Structure

```
backend/telegram/
├── telegramBot.js          # Main bot application
├── setup.js               # Setup and configuration utility
├── services/
│   ├── TelegramService.js  # Telegram API handling
│   ├── ArticleService.js   # Article creation logic
│   └── ImageService.js     # Image processing and upload
├── config.example.js       # Configuration examples
└── README.md              # This file
```

## 🔧 How It Works

1. **Channel Monitoring**: Bot connects to Telegram and listens for new messages
2. **Message Filtering**: Only processes messages with photos and captions from mapped channels
3. **Image Processing**: Downloads, resizes, and optimizes images
4. **Content Extraction**: 
   - Creates title from first sentence of caption
   - Uses full caption as article content
   - Extracts hashtags as tags
5. **Article Creation**: Creates published article in your database
6. **Image Upload**: Uploads to Cloudinary or saves locally

## 🎯 Channel to Category Mapping

The bot uses a simple mapping system:

```javascript
const CHANNEL_CATEGORY_MAP = {
    'channel_identifier': 'category_slug'
};
```

**Channel identifiers** can be:
- Numeric channel ID: `'deep123321123'`
- Username with @: `'@SportNewsChannel'`
- Username without @: `'SportNewsChannel'`

**Category slugs** must match existing categories in your database.

## 📝 Article Format

Created articles will have:
- **Title**: First sentence of caption (or default if too short)
- **Excerpt**: First 200 characters of caption
- **Content**: Full caption text
- **Image**: Downloaded and processed image
- **Category**: Based on channel mapping
- **Tags**: Extracted hashtags from caption
- **Status**: Published (configurable)
- **Author**: System user (auto-created)

## 🔍 Monitoring and Logs

The bot provides detailed logging:
- ✅ Successful article creation
- ⏭️ Skipped messages (no image, not mapped channel, etc.)
- ❌ Error details for troubleshooting

## 🛡️ Error Handling

- **Missing Categories**: Bot will log error if mapped category doesn't exist
- **Image Processing Failures**: Continues with next message
- **API Failures**: Detailed error logging for debugging
- **Connection Issues**: Auto-retry for Telegram connection

## 🔧 Troubleshooting

### Bot Won't Start
1. Check environment variables are set correctly
2. Ensure MongoDB is running
3. Verify Telegram credentials

### No Articles Created
1. Check channel mappings are correct
2. Verify categories exist in database
3. Ensure messages have both photo and caption

### Authentication Issues
1. Delete old session and re-authenticate
2. Check API credentials from my.telegram.org
3. Ensure phone number has access to target channels

## 📚 Commands

```bash
# Start the bot
npm run telegram:start

# Run setup utility
node telegram/setup.js

# Install dependencies
npm install
```

## 🔒 Security Notes

- Keep your `TELEGRAM_SESSION_STRING` secure
- Don't commit real credentials to version control
- Use environment variables for all sensitive data
- Consider running bot in a separate process/server

## 🚀 Production Deployment

1. Use PM2 or similar process manager
2. Set up proper logging
3. Configure auto-restart on failures
4. Monitor disk space (images)
5. Set up backup for session data

## 📞 Support

If you encounter issues:
1. Check the logs for error details
2. Verify all configuration is correct
3. Test with setup utility first
4. Ensure all dependencies are installed 