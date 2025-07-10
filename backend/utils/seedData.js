const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Article = require('../models/Article');

// Sample data
const users = [
  {
    name: 'مدير الموقع',
    email: 'admin@newswebsite.com',
    password: 'Admin123!',
    role: 'admin',
    isVerified: true,
    isActive: true
  },
  {
    name: 'محرر الأخبار',
    email: 'editor@newswebsite.com',
    password: 'Editor123!',
    role: 'editor',
    isVerified: true,
    isActive: true
  },
  {
    name: 'أحمد محمد',
    email: 'ahmed@newswebsite.com',
    password: 'User123!',
    role: 'user',
    isVerified: true,
    isActive: true,
    bio: 'متحمس للتكنولوجيا وكاتب'
  },
  {
    name: 'فاطمة علي',
    email: 'fatima@newswebsite.com',
    password: 'User123!',
    role: 'user',
    isVerified: true,
    isActive: true,
    bio: 'صحفية رياضية ومدونة'
  }
];

const categories = [
  {
    name: 'عالم',
    slug: 'world',
    description: 'آخر أخبار العالم والأحداث الدولية',
    color: '#3B82F6',
    icon: 'globe',
    sortOrder: 1
  },
  {
    name: 'سياسة',
    slug: 'politics',
    description: 'الأخبار السياسية والتحليلات',
    color: '#8B5CF6',
    icon: 'building',
    sortOrder: 2
  },
  {
    name: 'اقتصاد',
    slug: 'business',
    description: 'أخبار الاقتصاد والأعمال والمالية',
    color: '#10B981',
    icon: 'briefcase',
    sortOrder: 3
  },
  {
    name: 'رياضة',
    slug: 'sports',
    description: 'أخبار الرياضة والتحديثات',
    color: '#EF4444',
    icon: 'trophy',
    sortOrder: 4
  },
  {
    name: 'فن',
    slug: 'entertainment',
    description: 'أخبار الفن والترفيه والمشاهير',
    color: '#F59E0B',
    icon: 'film',
    sortOrder: 5
  }
];

const articles = [
  {
    title: 'مستقبل الذكاء الاصطناعي في عام 2024',
    slug: 'future-of-artificial-intelligence-2024',
    excerpt: 'استكشاف أحدث التطورات في تكنولوجيا الذكاء الاصطناعي وما تعنيه للشركات والمستهلكين على حد سواء.',
    content: `
      <p>يستمر الذكاء الاصطناعي في التطور بوتيرة لم يسبق لها مثيل، مما يعيد تشكيل الصناعات ويحول الطريقة التي نعمل ونعيش بها. مع تقدمنا في عام 2024، تظهر عدة اتجاهات رئيسية ستحدد مستقبل الذكاء الاصطناعي.</p>
      
      <h2>تطورات التعلم الآلي</h2>
      <p>مكنت الاختراقات الأخيرة في خوارزميات التعلم الآلي من قدرات أكثر تطوراً في التعرف على الأنماط والتنبؤ. هذه التطورات ملحوظة بشكل خاص في معالجة اللغة الطبيعية ورؤية الكمبيوتر.</p>
      
      <h2>تطوير الذكاء الاصطناعي الأخلاقي</h2>
      <p>تكثف التركيز على التطوير المسؤول للذكاء الاصطناعي، حيث تنفذ المنظمات أطر عمل قوية لنشر الذكاء الاصطناعي الأخلاقي. يشمل ذلك معالجة التحيز وضمان الشفافية والحفاظ على الإشراف البشري.</p>
      
      <h2>التطبيقات الصناعية</h2>
      <p>من التشخيص الطبي إلى المركبات ذاتية القيادة، تصبح تطبيقات الذكاء الاصطناعي أكثر عملية وإمكانية للوصول. إن دمج الذكاء الاصطناعي في العمليات التجارية اليومية يسرع التحول الرقمي عبر القطاعات.</p>
      
      <h2>النظر إلى المستقبل</h2>
      <p>مع استمرار نضج تكنولوجيا الذكاء الاصطناعي، يمكننا أن نتوقع رؤية المزيد من التطبيقات المبتكرة التي ستحدث ثورة أكبر في كيفية تفاعلنا مع التكنولوجيا ومع بعضنا البعض.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      alt: 'مفهوم الذكاء الاصطناعي مع رسم توضيحي للدماغ المستقبلي'
    },
    tags: ['ذكاء-اصطناعي', 'تعلم-آلي', 'تكنولوجيا', 'مستقبل'],
    status: 'published',
    featured: true,
    publishedAt: new Date(),
    views: 15420,
    readTime: 5
  },
  {
    title: 'الألعاب الأولمبية 2024: أفضل الرياضيين الذين يجب مراقبتهم',
    slug: 'olympic-games-2024-top-athletes',
    excerpt: 'تعرف على النجوم الصاعدين والأبطال العائدين الذين سيصنعون عناوين الأخبار في الألعاب الأولمبية القادمة.',
    content: `
      <p>تعد الألعاب الأولمبية 2024 بعرض مواهب رياضية مذهلة من جميع أنحاء العالم. إليكم أفضل الرياضيين الذين من المتوقع أن يهيمنوا على رياضاتهم.</p>
      
      <h2>نجوم السباحة</h2>
      <p>كسر عدة سباحين شباب الأرقام القياسية وهم على استعداد لإحداث تأثير كبير في الألعاب. لقد كان تفانيهم وأنظمة تدريبهم استثنائية.</p>
      
      <h2>نجوم ألعاب القوى</h2>
      <p>ستشهد أحداث ألعاب القوى بعضاً من أكثر المنافسات تنافسية في تاريخ الألعاب الأولمبية، مع تنافس عدة حاملي أرقام قياسية عالمية على الذهب.</p>
      
      <h2>الرياضات الجماعية التي يجب مراقبتها</h2>
      <p>فرق كرة السلة والكرة الطائرة وكرة القدم من مختلف البلدان تستعد بكثافة، مما يعد بمباريات مثيرة ومفاجآت محتملة.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      alt: 'رياضيون أولمبيون يتنافسون في رياضات مختلفة'
    },
    tags: ['أولمبياد', 'رياضة', 'رياضيون', '2024'],
    status: 'published',
    featured: true,
    publishedAt: new Date(Date.now() - 86400000),
    views: 12350,
    readTime: 4
  },
  {
    title: 'النظرة الاقتصادية العالمية: التنقل في أوقات عدم اليقين',
    slug: 'global-economic-outlook-uncertain-times',
    excerpt: 'تحليل الاتجاهات الاقتصادية الحالية وتأثيرها المحتمل على الأسواق والمستهلكين في جميع أنحاء العالم.',
    content: `
      <p>يواجه الاقتصاد العالمي مشهداً معقداً من التحديات والفرص. إن فهم هذه الديناميكيات أمر بالغ الأهمية للشركات والمستثمرين الذين يتنقلون في المناخ الحالي.</p>
      
      <h2>تقلبات السوق</h2>
      <p>سلطت التقلبات الأخيرة في السوق الضوء على الطبيعة المترابطة للاقتصادات العالمية والوتيرة السريعة التي يمكن أن تتغير بها المشاعر.</p>
      
      <h2>اتجاهات التضخم</h2>
      <p>تتصارع البنوك المركزية في جميع أنحاء العالم مع إدارة التضخم بينما تحاول الحفاظ على زخم النمو الاقتصادي.</p>
      
      <h2>الأسواق الناشئة</h2>
      <p>تُظهر عدة أسواق ناشئة علامات نمو واعدة، مما يوفر فرصاً جديدة للاستثمار الدولي والشراكات التجارية.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      alt: 'الرسوم البيانية والمخططات المالية التي تظهر البيانات الاقتصادية'
    },
    tags: ['اقتصاد', 'أعمال', 'أسواق', 'مالية'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 172800000),
    views: 8940,
    readTime: 6
  },
  {
    title: 'اختراق في تكنولوجيا الطاقة المتجددة',
    slug: 'breakthrough-renewable-energy-technology',
    excerpt: 'يعلن العلماء عن تقدم كبير في كفاءة الألواح الشمسية يمكن أن يحدث ثورة في اعتماد الطاقة النظيفة.',
    content: `
      <p>طور فريق من الباحثين نوعاً جديداً من الألواح الشمسية يحقق معدلات كفاءة لم يسبق لها مثيل، مما قد يحول مشهد الطاقة المتجددة.</p>
      
      <h2>الابتكار التقني</h2>
      <p>ينطوي الاختراق على نهج جديد في تصميم الخلايا الكهروضوئية يزيد من امتصاص الضوء مع تقليل فقدان الطاقة.</p>
      
      <h2>التأثير البيئي</h2>
      <p>يمكن أن يؤدي هذا التقدم إلى تسريع الانتقال إلى الطاقة النظيفة بشكل كبير من خلال جعل الطاقة الشمسية أكثر فعالية من حيث التكلفة والكفاءة.</p>
      
      <h2>التطبيقات التجارية</h2>
      <p>يتوقع خبراء الصناعة أن تكون هذه التكنولوجيا متاحة تجارياً خلال السنوات القليلة القادمة، في انتظار المزيد من الاختبارات والتطوير.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop',
      alt: 'ألواح شمسية في حقل مع سماء زرقاء صافية'
    },
    tags: ['طاقة-متجددة', 'طاقة-شمسية', 'بيئة', 'تكنولوجيا'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 259200000),
    views: 6780,
    readTime: 4
  },
  {
    title: 'الحكومة تعلن عن إصلاح سياسي كبير',
    slug: 'major-political-reform-announced',
    excerpt: 'تهدف التشريعات الجديدة إلى تحديث أنظمة التصويت وزيادة مشاركة المواطنين في العمليات الديمقراطية.',
    content: `
      <p>أعلنت الحكومة عن إصلاحات سياسية شاملة مصممة لتعزيز المشاركة الديمقراطية وتحديث الأنظمة الانتخابية.</p>
      
      <h2>مبادرات التصويت الرقمي</h2>
      <p>يهدف إدخال منصات التصويت الرقمي الآمنة إلى زيادة إمكانية الوصول مع الحفاظ على نزاهة الانتخابات.</p>
      
      <h2>مشاركة المواطنين</h2>
      <p>ستسهل البرامج الجديدة مشاركة أكبر للجمهور في عمليات صنع السياسات من خلال الاستشارات الرقمية وقاعات المدينة.</p>
      
      <h2>تدابير الشفافية</h2>
      <p>ستوفر متطلبات الإبلاغ المحسنة للمواطنين رؤية أفضل لعمليات الحكومة وعمليات صنع القرار.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
      alt: 'مبنى حكومي مع رموز ديمقراطية'
    },
    tags: ['سياسة', 'ديمقراطية', 'إصلاح', 'حكومة'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 345600000),
    views: 11200,
    readTime: 5
  },
  {
    title: 'علاج طبي ثوري يظهر نتائج واعدة',
    slug: 'revolutionary-medical-treatment-promise',
    excerpt: 'تكشف التجارب السريرية عن علاج اختراقي يمكن أن يحول علاج الحالات التي كانت تعتبر غير قابلة للشفاء سابقاً.',
    content: `
      <p>أظهر علاج طبي رائد نجاحاً ملحوظاً في التجارب السريرية، مما يوفر الأمل للمرضى الذين يعانون من حالات كانت تعتبر سابقاً غير قابلة للعلاج.</p>
      
      <h2>النتائج السريرية</h2>
      <p>أظهرت تجارب المرحلة الثالثة تحسناً كبيراً في نتائج المرضى مع آثار جانبية قليلة.</p>
      
      <h2>آلية العلاج</h2>
      <p>يعمل العلاج من خلال استهداف مسارات خلوية محددة، مما يمثل نهجاً جديداً للطب الشخصي.</p>
      
      <h2>التوفر المستقبلي</h2>
      <p>من المتوقع الحصول على الموافقة التنظيمية خلال العام القادم، مما يجعل هذا العلاج متاحاً للمرضى في جميع أنحاء العالم.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      alt: 'مختبر أبحاث طبية مع علماء يعملون'
    },
    tags: ['صحة', 'طبي', 'بحث', 'اختراق'],
    status: 'published',
    featured: true,
    publishedAt: new Date(Date.now() - 432000000),
    views: 18650,
    readTime: 7
  },
  {
    title: 'حروب البث تشتعل مع إطلاق منصة جديدة',
    slug: 'streaming-wars-new-platform-launch',
    excerpt: 'لاعب كبير آخر يدخل سوق البث التنافسي مع محتوى حصري وميزات مبتكرة.',
    content: `
      <p>ترحب صناعة الترفيه بمنصة بث جديدة تعد بإحداث تغيير في المشهد التنافسي من خلال عروض فريدة.</p>
      
      <h2>المحتوى الحصري</h2>
      <p>تنطلق المنصة مع مجموعة من المسلسلات والأفلام الأصلية من مبدعين مشهورين ومواهب من الدرجة الأولى.</p>
      
      <h2>الابتكار التكنولوجي</h2>
      <p>خوارزميات التوصية المتقدمة والميزات التفاعلية تميز هذه المنصة عن المنافسين الحاليين.</p>
      
      <h2>تأثير السوق</h2>
      <p>يتوقع محللو الصناعة تحولات كبيرة في حصة السوق مع قيام المستهلكين بتقييم اشتراكات البث الخاصة بهم.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=400&fit=crop',
      alt: 'ترفيه البث على أجهزة متعددة'
    },
    tags: ['ترفيه', 'بث', 'تكنولوجيا', 'إعلام'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 518400000),
    views: 9430,
    readTime: 3
  },
  {
    title: 'قمة المناخ تصل إلى اتفاق تاريخي',
    slug: 'climate-summit-historic-agreement',
    excerpt: 'قادة العالم يتحدون حول خطة طموحة للعمل المناخي مع أهداف ملموسة والتزامات بالتمويل.',
    content: `
      <p>اختتمت قمة مناخية لم يسبق لها مثيل باتفاق تاريخي يضع أهدافاً طموحة لتقليل الكربون العالمي وحماية البيئة.</p>
      
      <h2>الالتزامات الرئيسية</h2>
      <p>تعهدت الدول بتحقيق صافي انبعاثات صفرية بحلول عام 2050 مع معالم وسيطة كل خمس سنوات.</p>
      
      <h2>آليات التمويل</h2>
      <p>سيدعم صندوق دولي جديد البلدان النامية في انتقالها إلى أنظمة الطاقة المتجددة.</p>
      
      <h2>الجدول الزمني للتنفيذ</h2>
      <p>يتضمن الاتفاق التزامات ملزمة مع مراجعات منتظمة للتقدم وتدابير المساءلة.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
      alt: 'توربينات الرياح في مناظر طبيعية خضراء تمثل الطاقة المتجددة'
    },
    tags: ['مناخ', 'بيئة', 'سياسة', 'استدامة'],
    status: 'published',
    featured: true,
    publishedAt: new Date(Date.now() - 604800000),
    views: 22100,
    readTime: 6
  },
  {
    title: 'سوق العملات المشفرة يشهد تبنياً مؤسسياً كبيراً',
    slug: 'cryptocurrency-institutional-adoption',
    excerpt: 'المؤسسات المالية الكبرى تعلن عن دمج خدمات العملات المشفرة وسط قبول متزايد في التيار الرئيسي.',
    content: `
      <p>وصل سوق العملات المشفرة إلى معلم جديد مع إعلان عدة مؤسسات مالية كبرى عن خدمات شاملة للأصول الرقمية.</p>
      
      <h2>الخدمات المؤسسية</h2>
      <p>تقدم البنوك التقليدية الآن خدمات حفظ وتداول واستثمار العملات المشفرة لعملائها.</p>
      
      <h2>الوضوح التنظيمي</h2>
      <p>وفرت التوجيهات التنظيمية الأخيرة الإطار اللازم للتبني المؤسسي وحماية المستهلك.</p>
      
      <h2>الآثار على السوق</h2>
      <p>من المتوقع أن تجلب هذه التطورات استقراراً ومشروعية أكبر لنظام العملات المشفرة البيئي.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop',
      alt: 'مفهوم العملة المشفرة وتكنولوجيا البلوك تشين'
    },
    tags: ['عملة-مشفرة', 'مالية', 'بلوك-تشين', 'أعمال'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 691200000),
    views: 13760,
    readTime: 5
  },
  {
    title: 'معلم في استكشاف الفضاء: نجاح مهمة المريخ',
    slug: 'space-exploration-mars-mission-success',
    excerpt: 'مهمة المريخ التاريخية تحقق اكتشافات اختراقية حول إمكانية وجود حياة قديمة على الكوكب الأحمر.',
    content: `
      <p>حققت مهمة المريخ الرائدة نجاحاً ملحوظاً، مما وفر رؤى لم يسبق لها مثيل في جيولوجيا الكوكب وإمكانية وجود حياة قديمة.</p>
      
      <h2>الاكتشافات العلمية</h2>
      <p>كشفت المهمة عن أدلة على أنظمة مائية قديمة ومركبات عضوية تشير إلى أن المريخ ربما احتوى على حياة في الماضي.</p>
      
      <h2>الإنجازات التكنولوجية</h2>
      <p>مكنت الروبوتات المتقدمة وأنظمة الاتصال من الاستكشاف في الوقت الفعلي وجمع البيانات من سطح المريخ.</p>
      
      <h2>المهام المستقبلية</h2>
      <p>تمهد هذه النتائج الطريق للمهام البشرية المستقبلية إلى المريخ والاستكشاف الموسع لنظامنا الشمسي.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
      alt: 'سطح كوكب المريخ مع الروبوت ومعدات استكشاف الفضاء'
    },
    tags: ['فضاء', 'مريخ', 'علوم', 'استكشاف'],
    status: 'published',
    featured: true,
    publishedAt: new Date(Date.now() - 777600000),
    views: 31500,
    readTime: 8
  },
  {
    title: 'كأس العالم 2024: مفاجآت غير متوقعة تهز البطولة',
    slug: 'world-cup-2024-unexpected-upsets',
    excerpt: 'فرق المستضعفة تخلق مفاجآت كبيرة بينما تكافح القوى التقليدية في الجولات الأولى من البطولة.',
    content: `
      <p>كانت كأس العالم 2024 مليئة بالمفاجآت حيث هزمت عدة فرق مستضعفة عمالقة كرة القدم التقليديين في انتكاسات مذهلة.</p>
      
      <h2>الانتكاسات الكبرى</h2>
      <p>تم إقصاء ثلاثة أبطال عالم سابقين في مرحلة المجموعات، مما يجعلها واحدة من أكثر البطولات التي لا يمكن التنبؤ بها في التاريخ.</p>
      
      <h2>النجوم الصاعدة</h2>
      <p>اللاعبون الشباب من دول كرة القدم الناشئة يجذبون الانتباه العالمي بأدائهم الاستثنائي.</p>
      
      <h2>ديناميكيات البطولة</h2>
      <p>خلقت النتائج غير المتوقعة قصصاً جديدة ومنافسات تأسر المشجعين في جميع أنحاء العالم.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop',
      alt: 'لاعبو كرة القدم يحتفلون بالفوز في الملعب'
    },
    tags: ['كأس-العالم', 'كرة-قدم', 'رياضة', 'بطولة'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 864000000),
    views: 19320,
    readTime: 4
  },
  {
    title: 'Tech Giants Announce Quantum Computing Breakthrough',
    slug: 'tech-giants-announce-quantum-computing-breakthrough',
    excerpt: 'Major technology companies achieve quantum supremacy with practical applications now within reach.',
    content: `
      <p>Leading technology companies have announced significant breakthroughs in quantum computing that bring practical applications closer to reality.</p>
      
      <h2>Quantum Supremacy</h2>
      <p>The new quantum processors can solve complex problems exponentially faster than traditional computers.</p>
      
      <h2>Real-World Applications</h2>
      <p>Applications in cryptography, drug discovery, and financial modeling are now becoming feasible.</p>
      
      <h2>Industry Impact</h2>
      <p>This advancement is expected to revolutionize multiple industries and create new technological possibilities.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
      alt: 'Quantum computing laboratory with advanced equipment'
    },
    tags: ['quantum-computing', 'technology', 'innovation', 'science'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 950400000),
    views: 14890,
    readTime: 6
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await Article.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const createdUsers = [];
    
    // Create users one by one to ensure password hashing middleware runs
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    
    console.log(`👥 Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

// Seed categories
const seedCategories = async (adminUser) => {
  try {
    const categoriesWithCreator = categories.map(cat => ({
      ...cat,
      createdBy: adminUser._id
    }));
    
    const createdCategories = await Category.insertMany(categoriesWithCreator);
    console.log(`📁 Created ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
    throw error;
  }
};

// Seed articles
const seedArticles = async (users, categories) => {
  try {
    const worldCategory = categories.find(cat => cat.slug === 'world');
    const politicsCategory = categories.find(cat => cat.slug === 'politics');
    const businessCategory = categories.find(cat => cat.slug === 'business');
    const sportsCategory = categories.find(cat => cat.slug === 'sports');
    const entertainmentCategory = categories.find(cat => cat.slug === 'entertainment');
    
    const editor = users.find(user => user.role === 'editor');
    const ahmed = users.find(user => user.name === 'أحمد محمد');
    const fatima = users.find(user => user.name === 'فاطمة علي');
    const admin = users.find(user => user.role === 'admin');

    const articlesWithRefs = [
      // World Articles
      {
        ...articles[0], // AI Future
        category: worldCategory._id,
        author: ahmed._id
      },
      {
        ...articles[3], // Renewable Energy
        category: worldCategory._id,
        author: editor._id
      },
      {
        ...articles[9], // Mars Mission
        category: worldCategory._id,
        author: admin._id
      },
      
      // Politics Articles
      {
        ...articles[4], // Political Reform
        category: politicsCategory._id,
        author: admin._id
      },
      {
        ...articles[7], // Climate Summit
        category: politicsCategory._id,
        author: editor._id
      },
      
      // Business Articles
      {
        ...articles[2], // Economic Outlook
        category: businessCategory._id,
        author: editor._id
      },
      {
        ...articles[8], // Cryptocurrency
        category: businessCategory._id,
        author: admin._id
      },
      
      // Sports Articles
      {
        ...articles[1], // Olympics
        category: sportsCategory._id,
        author: fatima._id
      },
      {
        ...articles[10], // World Cup
        category: sportsCategory._id,
        author: fatima._id
      },
      
      // Entertainment Articles
      {
        ...articles[6], // Streaming Wars
        category: entertainmentCategory._id,
        author: fatima._id
      },
      {
        ...articles[5], // Medical Treatment (using entertainment for now)
        category: entertainmentCategory._id,
        author: ahmed._id
      }
    ];

    const createdArticles = await Article.insertMany(articlesWithRefs);
    console.log(`📄 Created ${createdArticles.length} articles`);
    return createdArticles;
  } catch (error) {
    console.error('❌ Error seeding articles:', error.message);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await clearData();
    
    const createdUsers = await seedUsers();
    const adminUser = createdUsers.find(user => user.role === 'admin');
    
    const createdCategories = await seedCategories(adminUser);
    const createdArticles = await seedArticles(createdUsers, createdCategories);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Articles: ${createdArticles.length}`);
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('   Admin: admin@newswebsite.com / Admin123!');
    console.log('   Editor: editor@newswebsite.com / Editor123!');
    console.log('   User: ahmed@newswebsite.com / User123!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 