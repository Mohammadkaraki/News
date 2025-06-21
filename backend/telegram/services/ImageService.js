const cloudinary = require('cloudinary').v2;
const fs = require('fs-extra');
const path = require('path');

class ImageService {
    constructor() {
        this.useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                            process.env.CLOUDINARY_API_KEY && 
                            process.env.CLOUDINARY_API_SECRET;
        
        if (this.useCloudinary) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
            console.log('☁️  Using Cloudinary for image uploads');
        } else {
            console.log('💾 Using local storage for images');
            // Ensure public uploads directory exists
            this.publicUploadsDir = path.join(__dirname, '../../public/uploads');
            fs.ensureDirSync(this.publicUploadsDir);
        }
    }

    async uploadImage(localPath) {
        try {
            if (this.useCloudinary) {
                return await this.uploadToCloudinary(localPath);
            } else {
                return await this.saveToLocal(localPath);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    async uploadToCloudinary(localPath) {
        try {
            console.log('☁️  Uploading to Cloudinary...');
            
            const result = await cloudinary.uploader.upload(localPath, {
                folder: 'telegram-news',
                resource_type: 'image',
                quality: 'auto:good',
                fetch_format: 'auto',
                crop: 'limit',
                width: 1200,
                height: 800
            });

            console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
            
            return result.secure_url;

        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    }

    async saveToLocal(localPath) {
        try {
            const filename = path.basename(localPath);
            const destinationPath = path.join(this.publicUploadsDir, filename);
            
            // Move file to public uploads directory
            await fs.move(localPath, destinationPath);
            
            // Return the URL path (relative to public directory)
            const imageUrl = `/uploads/${filename}`;
            
            console.log('✅ Image saved locally:', imageUrl);
            
            return imageUrl;

        } catch (error) {
            console.error('Error saving image locally:', error);
            throw error;
        }
    }

    // Utility method to get image info
    async getImageInfo(imagePath) {
        try {
            const stats = await fs.stat(imagePath);
            return {
                exists: true,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
            };
        } catch (error) {
            return { exists: false };
        }
    }

    // Clean up old images (optional)
    async cleanupOldImages(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days
        if (this.useCloudinary) {
            console.log('⚠️  Cloudinary cleanup not implemented');
            return;
        }

        try {
            const files = await fs.readdir(this.publicUploadsDir);
            const now = Date.now();
            
            for (const file of files) {
                const filePath = path.join(this.publicUploadsDir, file);
                const stats = await fs.stat(filePath);
                
                if (now - stats.mtime.getTime() > maxAge) {
                    await fs.remove(filePath);
                    console.log(`🗑️  Cleaned up old image: ${file}`);
                }
            }
        } catch (error) {
            console.error('Error cleaning up old images:', error);
        }
    }
}

module.exports = ImageService; 