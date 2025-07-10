const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️  OpenAI API key not found. Enhanced content generation disabled.');
            this.enabled = false;
            this.openai = null;
        } else {
            this.enabled = true;
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
            console.log('🤖 تم تهيئة خدمة OpenAI');
        }
    }

    async enhanceArticleContent(originalCaption, category = 'sports') {
        if (!this.enabled) {
            console.log('⚠️  OpenAI معطل، استخدام المحتوى الأصلي');
            return this.createFallbackContent(originalCaption, category);
        }

        try {
            console.log('🤖 تحسين المحتوى باستخدام ChatGPT...');
            
            const prompt = this.createPrompt(originalCaption, category);
            
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: this.getSystemPromptForCategory(category)
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
            return this.parseResponse(response, originalCaption, category);

        } catch (error) {
            console.error('❌ خطأ في OpenAI:', error.message);
            return this.createFallbackContent(originalCaption, category);
        }
    }

    createPrompt(caption, category) {
        const categoryArabic = this.getCategoryInArabic(category);
        return `
حول هذا المنشور من فئة ${categoryArabic} إلى مقال إخباري احترافي شامل:

المنشور الأصلي: "${caption}"

المتطلبات:
1. إنشاء عنوان إخباري احترافي وجذاب (50-80 حرف)
2. كتابة محتوى مقال مفصل (400-600 كلمة) مع عدة فقرات
3. تضمين السياق والتحليل
4. إضافة اقتباسات أو تعليقات خبراء عند الاقتضاء
5. إنشاء اسم كاتب محترف عربي
6. إنشاء علامات ذات صلة

اكتب ردك بتنسيق JSON:
{
  "title": "العنوان الإخباري الاحترافي هنا",
  "excerpt": "ملخص موجز وجذاب (150-200 حرف)",
  "content": "محتوى المقال المفصل متعدد الفقرات مع تنسيق HTML صحيح باستخدام علامات <p>. يتضمن السياق والتحليل وأسلوب الصحافة المهنية في مجال ${categoryArabic}. اجعله شاملاً وجذاباً.",
  "authorName": "اسم الصحفي المحترف المتخصص في ${categoryArabic}",
  "tags": ["علامات", "متعلقة", "بالموضوع", "في_${categoryArabic}"]
}

مهم جداً: 
- يجب أن يكون المحتوى 400+ كلمة مع عدة فقرات
- استخدم علامات HTML <p> للتنسيق
- اجعله يبدو كصحافة احترافية متخصصة في ${categoryArabic}
- أضف السياق والمعلومات الخلفية
- تضمين التحليل والتداعيات
- اجعل العنوان جذاباً واحترافياً
- اكتب باللغة العربية فقط
        `.trim();
    }

    getSystemPromptForCategory(category) {
        const prompts = {
            'sports': "أنت صحفي رياضي محترف لديك خبرة أكثر من 10 سنوات. تقوم بإنشاء مقالات إخبارية رياضية شاملة وجذابة من منشورات وسائل التواصل الاجتماعي المختصرة. مقالاتك مدروسة جيداً وتتضمن السياق الرياضي وتتبع معايير الصحافة الرياضية المهنية. يجب أن تكتب باللغة العربية فقط وتستخدم أسلوب صحفي رياضي عربي احترافي.",
            
            'politics': "أنت صحفي سياسي محترف لديك خبرة أكثر من 10 سنوات. تقوم بإنشاء مقالات إخبارية سياسية شاملة وجذابة من منشورات وسائل التواصل الاجتماعي المختصرة. مقالاتك مدروسة جيداً وتتضمن السياق السياسي والتحليل وتتبع معايير الصحافة السياسية المهنية. يجب أن تكتب باللغة العربية فقط وتستخدم أسلوب صحفي سياسي عربي احترافي.",
            
            'business': "أنت صحفي اقتصادي محترف لديك خبرة أكثر من 10 سنوات. تقوم بإنشاء مقالات إخبارية اقتصادية شاملة وجذابة من منشورات وسائل التواصل الاجتماعي المختصرة. مقالاتك مدروسة جيداً وتتضمن السياق الاقتصادي والتحليل المالي وتتبع معايير الصحافة الاقتصادية المهنية. يجب أن تكتب باللغة العربية فقط وتستخدم أسلوب صحفي اقتصادي عربي احترافي.",
            
            'world': "أنت صحفي أخبار عالمية محترف لديك خبرة أكثر من 10 سنوات. تقوم بإنشاء مقالات إخبارية عالمية شاملة وجذابة من منشورات وسائل التواصل الاجتماعي المختصرة. مقالاتك مدروسة جيداً وتتضمن السياق الدولي والتحليل الجيوسياسي وتتبع معايير الصحافة الدولية المهنية. يجب أن تكتب باللغة العربية فقط وتستخدم أسلوب صحفي عربي احترافي.",
            
            'entertainment': "أنت صحفي فنون وترفيه محترف لديك خبرة أكثر من 10 سنوات. تقوم بإنشاء مقالات إخبارية فنية وترفيهية شاملة وجذابة من منشورات وسائل التواصل الاجتماعي المختصرة. مقالاتك مدروسة جيداً وتتضمن السياق الفني والثقافي وتتبع معايير الصحافة الفنية المهنية. يجب أن تكتب باللغة العربية فقط وتستخدم أسلوب صحفي فني عربي احترافي."
        };
        
        return prompts[category.toLowerCase()] || prompts['sports'];
    }

    getCategoryInArabic(category) {
        const categoryMap = {
            'sports': 'رياضة',
            'business': 'اقتصاد',
            'technology': 'تكنولوجيا',
            'politics': 'سياسة',
            'entertainment': 'فن',
            'world': 'عالم',
            'health': 'صحة'
        };
        return categoryMap[category.toLowerCase()] || 'أخبار عامة';
    }

    parseResponse(response, originalCaption, category = 'sports') {
        try {
            // Try to parse JSON response
            const parsed = JSON.parse(response);
            
            return {
                title: this.validateTitle(parsed.title) || this.extractTitleFromCaption(originalCaption),
                excerpt: this.validateExcerpt(parsed.excerpt) || originalCaption.substring(0, 200),
                content: this.validateContent(parsed.content) || this.createExpandedContent(originalCaption, category),
                authorName: this.validateAuthorName(parsed.authorName) || this.generateAuthorName(),
                tags: this.validateTags(parsed.tags) || this.extractHashtags(originalCaption)
            };
        } catch (error) {
            console.warn('⚠️  فشل في تحليل استجابة OpenAI، استخدام المحتوى الاحتياطي');
            return this.createFallbackContent(originalCaption, category);
        }
    }

    createFallbackContent(caption, category = 'sports') {
        return {
            title: this.extractTitleFromCaption(caption),
            excerpt: caption.substring(0, 200).trim(),
            content: this.createExpandedContent(caption, category),
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

    createExpandedContent(caption, category = 'sports') {
        // Create a more detailed version of the original caption in Arabic
        const paragraphs = caption.split('\n').filter(p => p.trim());
        
        if (paragraphs.length === 1) {
            // Single paragraph - expand it significantly in Arabic
            return `
<p>${caption}</p>

<p>هذا التطور المهم قد جذب انتباه المتابعين والمحللين والمهتمين في جميع أنحاء العالم. يمثل هذا الحدث لحظة حاسمة مع تداعيات تمتد إلى ما هو أبعد من الحدث المباشر.</p>

<p>يراقب الخبراء والمختصون هذا الوضع عن كثب، مع ملاحظة العوامل المختلفة التي ساهمت في هذه النتيجة. التطور المعروض اليوم يظهر المستوى العالي من الأهمية والتأثير في المجال المعني.</p>

<p>من المتوقع أن يكون لهذا التطور صدى كبير، مما يؤثر على التطورات القادمة والقرارات المستقبلية. لجأ المتابعون إلى وسائل التواصل الاجتماعي للتعبير عن ردود أفعالهم، حيث أشاد كثيرون بالأهمية الاستثنائية لهذا الحدث.</p>

<p>مع تطور الأحداث، من المحتمل أن تُذكر هذه اللحظة كنقطة محورية شكلت مسار التطورات اللاحقة. يواصل المحللون والخبراء تقديم تعليقات مفصلة حول الجوانب التقنية والتداعيات الأوسع لأحداث اليوم.</p>

<p>ابقوا معنا للمتابعة المستمرة بينما نراقب التطورات الإضافية ونقدم تحليلاً شاملاً لهذه القصة المتطورة.</p>
            `.trim();
        } else {
            // Multiple paragraphs - format them properly and add context in Arabic
            const formattedParagraphs = paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n\n');
            return `${formattedParagraphs}\n\n<p>يستمر هذا التطور في جذب اهتمام كبير، مع التحليل والتعليق المستمر من الخبراء والمختصين في هذا المجال.</p>`;
        }
    }

    generateAuthorName() {
        const firstNames = ['أحمد', 'محمد', 'عبدالله', 'خالد', 'سعد', 'فيصل', 'عمر', 'علي', 'يوسف', 'حسام'];
        const lastNames = ['العتيبي', 'المطيري', 'الشمري', 'القحطاني', 'الغامدي', 'العنزي', 'الدوسري', 'الحربي', 'الزهراني', 'السعيد'];
        
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