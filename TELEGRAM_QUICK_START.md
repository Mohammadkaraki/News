# 🤖 Telegram News Bot - Quick Start Guide

## What This Does

Automatically creates news articles from Telegram channel messages with photos and captions.

**Example**: When a sports channel posts a photo with caption → automatically creates a new article in your "Sports" category.

## 🚀 Quick Setup (5 minutes)

### 1. Get Telegram API Credentials
- Go to [my.telegram.org](https://my.telegram.org)
- Login with your phone number
- Create an application
- Copy your `api_id` and `api_hash`

### 2. Configure Environment
```bash
cd backend
cp env.example .env
```

Edit `.env` and add:
```env
TELEGRAM_API_ID=your-api-id-here
TELEGRAM_API_HASH=your-api-hash-here
TELEGRAM_SESSION_STRING=
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Setup
```bash
node telegram/setup.js
```

This will:
- ✅ Help you authenticate with Telegram
- ✅ Show your available channels
- ✅ Create test categories
- ✅ Generate your session string

### 5. Configure Channel Mapping

Edit `backend/telegram/telegramBot.js` and update this section:

```javascript
const CHANNEL_CATEGORY_MAP = {
    'deep123321123': 'sport',
    // Add your channels here:
    'YOUR_CHANNEL_ID': 'your-category-slug',
    '@YourChannelUsername': 'another-category'
};
```

### 6. Start the Bot
```bash
npm run telegram:start
```

Or use the provided scripts:
- **Windows**: Double-click `backend/telegram/start-telegram-bot.bat`
- **Linux/Mac**: Run `backend/telegram/start-telegram-bot.sh`

## ✅ How to Test

1. **Send a test message** to one of your mapped channels (with photo + caption)
2. **Check your news website** - new article should appear
3. **Check the console** for success/error messages

## 📝 Article Structure

From this Telegram message:
```
🏈 Super Bowl Update! The game was amazing with incredible plays. 
Team A scored 28 points while Team B managed 21. #superbowl #sports #football
```

Creates this article:
- **Title**: "Super Bowl Update!"
- **Content**: Full caption text
- **Category**: Based on channel mapping (e.g., "sport")
- **Tags**: ["superbowl", "sports", "football"]
- **Image**: Downloaded and processed photo

## 🔧 Channel Mapping Examples

```javascript
const CHANNEL_CATEGORY_MAP = {
    // Channel ID (long number)
    '1234567890': 'sport',
    
    // Channel username with @
    '@SportNewsChannel': 'sport',
    
    // Channel username without @
    'BusinessDaily': 'business',
    
    // Multiple channels to same category
    '@TechNews1': 'technology',
    '@TechNews2': 'technology',
    '@GadgetUpdates': 'technology'
};
```

## 🚨 Troubleshooting

**Bot won't start?**
- Check your `.env` file has correct Telegram credentials
- Make sure MongoDB is running
- Verify categories exist in your database

**No articles created?**
- Check channel mapping is correct
- Ensure messages have both photo AND caption
- Verify category slugs match your database

**Authentication failed?**
- Re-run setup: `node telegram/setup.js`
- Make sure you have access to the channels you're mapping

## 📚 Next Steps

1. **Add more channels**: Update `CHANNEL_CATEGORY_MAP`
2. **Customize processing**: Edit `backend/telegram/telegramBot.js`
3. **Monitor logs**: Check console output for issues
4. **Production setup**: Use PM2 or similar for auto-restart

## 📁 Important Files

- `backend/telegram/telegramBot.js` - Main bot code & channel mapping
- `backend/.env` - Your credentials
- `backend/telegram/setup.js` - Setup utility
- `backend/telegram/README.md` - Detailed documentation

## 🎯 Example Workflow

1. **Sports channel posts**: Photo of game + score caption
2. **Bot processes**: Downloads image, extracts text
3. **Article created**: Published in "Sports" category
4. **Website updated**: New article appears automatically

That's it! Your Telegram news bot is ready to automatically create articles from your favorite channels. 🚀 