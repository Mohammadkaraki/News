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
            console.log('🤖 تم تهيئة خدمة OpenAI');
        }
    }

    async enhanceArticleContent(originalCaption, category = 'sports') {
        if (!this.enabled) {
            console.log('⚠️  OpenAI معطل، استخدام المحتوى الأصلي');
            return this.createFallbackContent(originalCaption);
        }

        try {
            console.log('🤖 تحسين المحتوى باستخدام ChatGPT...');
            
            const prompt = this.createPrompt(originalCaption, category);
            
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "أنت صحفي رياضي محترف لديك خبرة أكثر من 10 سنوات. تقوم بإنشاء مقالات إخبارية شاملة وجذابة من منشورات وسائل التواصل الاجتماعي المختصرة. مقالاتك مدروسة جيداً وتتضمن السياق وتتبع معايير الصحافة المهنية. يجب أن تكتب باللغة العربية فقط وتستخدم أسلوب صحفي عربي احترافي."
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
            console.error('❌ خطأ في OpenAI:', error.message);
            return this.createFallbackContent(originalCaption);
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
  "content": "محتوى المقال المفصل متعدد الفقرات مع تنسيق HTML صحيح باستخدام علامات <p>. يتضمن السياق والتحليل وأسلوب الصحافة الرياضية المهنية. اجعله شاملاً وجذاباً.",
  "authorName": "اسم الصحفي الرياضي المحترف",
  "tags": ["علامات", "رياضية", "ذات_صلة"]
}

مهم جداً: 
- يجب أن يكون المحتوى 400+ كلمة مع عدة فقرات
- استخدم علامات HTML <p> للتنسيق
- اجعله يبدو كصحافة رياضية احترافية
- أضف السياق والمعلومات الخلفية
- تضمين التحليل والتداعيات
- اجعل العنوان جذاباً واحترافياً
- اكتب باللغة العربية فقط
        `.trim();
    }

    getCategoryInArabic(category) {
        const categoryMap = {
            'sports': 'رياضة',
            'business': 'أعمال',
            'technology': 'تكنولوجيا',
            'politics': 'سياسة',
            'entertainment': 'ترفيه',
            'health': 'صحة'
        };
        return categoryMap[category.toLowerCase()] || 'أخبار عامة';
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
            console.warn('⚠️  فشل في تحليل استجابة OpenAI، استخدام المحتوى الاحتياطي');
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
        // Create a more detailed version of the original caption in Arabic
        const paragraphs = caption.split('\n').filter(p => p.trim());
        
        if (paragraphs.length === 1) {
            // Single paragraph - expand it significantly in Arabic
            return `
<p>${caption}</p>

<p>هذا التطور المهم في عالم الرياضة قد جذب انتباه المشجعين والمحللين وعشاق الرياضة في جميع أنحاء العالم. يمثل هذا الحدث لحظة حاسمة في الموسم الجاري، مع تداعيات تمتد إلى ما هو أبعد من نتيجة المباراة المباشرة.</p>

<p>يراقب الخبراء الرياضيون هذا الوضع عن كثب، مع ملاحظة العوامل المختلفة التي ساهمت في هذه النتيجة. الأداء المعروض اليوم يظهر المستوى العالي من المنافسة والمهارة التي تميز الرياضة المهنية الحديثة.</p>

<p>من المتوقع أن يكون لتأثير هذا التطور صدى في جميع أنحاء المجتمع الرياضي، مما يؤثر على المباريات القادمة والقرارات الاستراتيجية. لجأ المشجعون إلى وسائل التواصل الاجتماعي للتعبير عن ردود أفعالهم، حيث أشاد كثيرون بالعرض الاستثنائي للقدرة الرياضية والروح الرياضية.</p>

<p>مع تقدم الموسم، من المحتمل أن تُذكر هذه اللحظة كنقطة محورية شكلت مسار الفرق المشاركة. يواصل المحللون الرياضيون تقديم تعليقات مفصلة حول الجوانب التقنية والتداعيات الأوسع لأحداث اليوم.</p>

<p>ابقوا معنا للمتابعة المستمرة بينما نراقب التطورات الإضافية ونقدم تحليلاً شاملاً لهذه القصة الرياضية المتطورة.</p>
            `.trim();
        } else {
            // Multiple paragraphs - format them properly and add context in Arabic
            const formattedParagraphs = paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n\n');
            return `${formattedParagraphs}\n\n<p>يستمر هذا التطور في جذب اهتمام كبير من المجتمع الرياضي، مع التحليل والتعليق المستمر من الخبراء في هذا المجال.</p>`;
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