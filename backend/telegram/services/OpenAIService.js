const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️  OpenAI API key not found. Enhanced content generation disabled.');
            this.enabled = false;
        } else {
            this.enabled = true;
            console.log('🤖 OpenAI service initialized');
        }
    }

    async enhanceArticleContent(originalCaption, category = 'sports') {
        if (!this.enabled) {
            console.log('⚠️  OpenAI disabled, using original content');
            return this.createFallbackContent(originalCaption);
        }

        try {
            console.log('🤖 Enhancing content with ChatGPT...');
            
            const prompt = this.createPrompt(originalCaption, category);
            
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional sports journalist with 10+ years of experience. You create comprehensive, engaging news articles from brief social media posts. Your articles are well-researched, include context, and follow professional journalism standards."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1200,
                temperature: 0.7
            });

            const response = completion.choices[0].message.content;
            return this.parseResponse(response, originalCaption);

        } catch (error) {
            console.error('❌ Error with OpenAI:', error.message);
            return this.createFallbackContent(originalCaption);
        }
    }

    createPrompt(caption, category) {
        return `
Transform this ${category} social media post into a comprehensive professional news article:

Original post: "${caption}"

Requirements:
1. Create a compelling, professional news headline (50-80 characters)
2. Write a detailed article body (400-600 words) with multiple paragraphs
3. Include background context and analysis
4. Add quotes or expert commentary where appropriate
5. Generate a professional author name
6. Create relevant tags

Format your response as JSON:
{
  "title": "Professional News Headline Here",
  "excerpt": "Brief engaging summary (150-200 characters)",
  "content": "Detailed multi-paragraph article body with proper HTML formatting using <p> tags. Include context, analysis, and professional sports journalism style. Make it comprehensive and engaging.",
  "authorName": "Professional Sports Journalist Name",
  "tags": ["relevant", "sports", "tags"]
}

IMPORTANT: 
- The content must be 400+ words with multiple paragraphs
- Use proper HTML <p> tags for formatting
- Make it sound like professional sports journalism
- Add context and background information
- Include analysis and implications
- Make the title catchy and professional
        `.trim();
    }

    parseResponse(response, originalCaption) {
        try {
            // Try to parse JSON response
            const parsed = JSON.parse(response);
            
            return {
                title: this.validateTitle(parsed.title) || this.extractTitleFromCaption(originalCaption),
                excerpt: this.validateExcerpt(parsed.excerpt) || originalCaption.substring(0, 200),
                content: this.validateContent(parsed.content) || this.createExpandedContent(originalCaption),
                authorName: this.validateAuthorName(parsed.authorName) || this.generateAuthorName(),
                tags: this.validateTags(parsed.tags) || this.extractHashtags(originalCaption)
            };
        } catch (error) {
            console.warn('⚠️  Failed to parse OpenAI response, using fallback');
            return this.createFallbackContent(originalCaption);
        }
    }

    createFallbackContent(caption) {
        return {
            title: this.extractTitleFromCaption(caption),
            excerpt: caption.substring(0, 200).trim(),
            content: this.createExpandedContent(caption),
            authorName: this.generateAuthorName(),
            tags: this.extractHashtags(caption)
        };
    }

    extractTitleFromCaption(caption) {
        // Extract first sentence or first 60 characters
        const firstSentence = caption.split(/[.!?]+/)[0].trim();
        if (firstSentence.length > 10 && firstSentence.length <= 80) {
            return firstSentence;
        }
        
        // Fallback to first 60 characters
        const title = caption.substring(0, 60).trim();
        return title.length > 77 ? title.substring(0, 77) + '...' : title;
    }

    createExpandedContent(caption) {
        // Create a more detailed version of the original caption
        const paragraphs = caption.split('\n').filter(p => p.trim());
        
        if (paragraphs.length === 1) {
            // Single paragraph - expand it significantly
            return `
<p>${caption}</p>

<p>This significant development in the sports world has captured the attention of fans, analysts, and sports enthusiasts worldwide. The event represents a crucial moment in the ongoing season, with implications that extend beyond the immediate match result.</p>

<p>Sports experts have been closely monitoring this situation, noting the various factors that contributed to this outcome. The performance showcased today demonstrates the high level of competition and skill that defines modern professional sports.</p>

<p>The impact of this development is expected to resonate throughout the sporting community, influencing upcoming matches and strategic decisions. Fans have taken to social media to express their reactions, with many praising the exceptional display of athleticism and sportsmanship.</p>

<p>As the season progresses, this moment will likely be remembered as a pivotal point that shaped the trajectory of the teams involved. Sports analysts continue to provide detailed commentary on the technical aspects and broader implications of today's events.</p>

<p>Stay tuned for continued coverage as we monitor further developments and provide comprehensive analysis of this evolving sports story.</p>
            `.trim();
        } else {
            // Multiple paragraphs - format them properly and add context
            const formattedParagraphs = paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n\n');
            return `${formattedParagraphs}\n\n<p>This development continues to attract significant attention from the sports community, with ongoing analysis and commentary from experts in the field.</p>`;
        }
    }

    generateAuthorName() {
        const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn'];
        const lastNames = ['Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        return `${firstName} ${lastName}`;
    }

    extractHashtags(caption) {
        const hashtags = caption.match(/#\w+/g) || [];
        return hashtags.map(tag => tag.substring(1).toLowerCase()).slice(0, 5);
    }

    // Validation methods
    validateTitle(title) {
        return title && typeof title === 'string' && title.length > 10 && title.length <= 100 ? title : null;
    }

    validateExcerpt(excerpt) {
        return excerpt && typeof excerpt === 'string' && excerpt.length > 20 && excerpt.length <= 250 ? excerpt : null;
    }

    validateContent(content) {
        return content && typeof content === 'string' && content.length > 100 ? content : null;
    }

    validateAuthorName(authorName) {
        return authorName && typeof authorName === 'string' && authorName.length > 3 && authorName.length <= 50 ? authorName : null;
    }

    validateTags(tags) {
        return Array.isArray(tags) && tags.length > 0 ? tags.slice(0, 5) : null;
    }
}

module.exports = OpenAIService; 