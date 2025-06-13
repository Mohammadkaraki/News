const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Article = require('../models/Article');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@newswebsite.com',
    password: 'Admin123!',
    role: 'admin',
    isVerified: true,
    isActive: true
  },
  {
    name: 'Editor User',
    email: 'editor@newswebsite.com',
    password: 'Editor123!',
    role: 'editor',
    isVerified: true,
    isActive: true
  },
  {
    name: 'John Doe',
    email: 'john@newswebsite.com',
    password: 'User123!',
    role: 'user',
    isVerified: true,
    isActive: true,
    bio: 'Technology enthusiast and writer'
  },
  {
    name: 'Jane Smith',
    email: 'jane@newswebsite.com',
    password: 'User123!',
    role: 'user',
    isVerified: true,
    isActive: true,
    bio: 'Sports journalist and blogger'
  }
];

const categories = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech news and innovations',
    color: '#3B82F6',
    icon: 'laptop',
    sortOrder: 1
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Sports news and updates',
    color: '#EF4444',
    icon: 'trophy',
    sortOrder: 2
  },
  {
    name: 'Politics',
    slug: 'politics',
    description: 'Political news and analysis',
    color: '#8B5CF6',
    icon: 'building',
    sortOrder: 3
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Business and finance news',
    color: '#10B981',
    icon: 'briefcase',
    sortOrder: 4
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Entertainment and celebrity news',
    color: '#F59E0B',
    icon: 'film',
    sortOrder: 5
  },
  {
    name: 'Health',
    slug: 'health',
    description: 'Health and wellness news',
    color: '#06B6D4',
    icon: 'heart',
    sortOrder: 6
  }
];

const articles = [
  {
    title: 'The Future of Artificial Intelligence in 2024',
    slug: 'the-future-of-artificial-intelligence-in-2024',
    excerpt: 'Exploring the latest developments in AI technology and what they mean for businesses and consumers alike.',
    content: `
      <p>Artificial Intelligence continues to evolve at an unprecedented pace, reshaping industries and transforming the way we work and live. As we move through 2024, several key trends are emerging that will define the future of AI.</p>
      
      <h2>Machine Learning Advances</h2>
      <p>Recent breakthroughs in machine learning algorithms have enabled more sophisticated pattern recognition and predictive capabilities. These advances are particularly notable in natural language processing and computer vision.</p>
      
      <h2>Ethical AI Development</h2>
      <p>The focus on responsible AI development has intensified, with organizations implementing robust frameworks for ethical AI deployment. This includes addressing bias, ensuring transparency, and maintaining human oversight.</p>
      
      <h2>Industry Applications</h2>
      <p>From healthcare diagnostics to autonomous vehicles, AI applications are becoming more practical and accessible. The integration of AI into everyday business processes is accelerating digital transformation across sectors.</p>
      
      <h2>Looking Ahead</h2>
      <p>As AI technology continues to mature, we can expect to see even more innovative applications that will further revolutionize how we interact with technology and each other.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      alt: 'Artificial Intelligence concept with futuristic brain illustration'
    },
    tags: ['artificial-intelligence', 'machine-learning', 'technology', 'future'],
    status: 'published',
    featured: true,
    publishedAt: new Date(),
    views: 15420,
    readTime: 5
  },
  {
    title: 'Olympic Games 2024: Top Athletes to Watch',
    slug: 'olympic-games-2024-top-athletes-to-watch',
    excerpt: 'Meet the rising stars and returning champions who are set to make headlines at the upcoming Olympic Games.',
    content: `
      <p>The 2024 Olympic Games promise to showcase incredible athletic talent from around the world. Here are the top athletes who are expected to dominate their respective sports.</p>
      
      <h2>Swimming Sensations</h2>
      <p>Several young swimmers have been breaking records and are poised to make a significant impact at the Games. Their dedication and training regimens have been nothing short of extraordinary.</p>
      
      <h2>Track and Field Stars</h2>
      <p>The track and field events will feature some of the most competitive fields in Olympic history, with multiple world record holders competing for gold.</p>
      
      <h2>Team Sports to Watch</h2>
      <p>Basketball, volleyball, and soccer teams from various countries have been preparing intensively, promising exciting matches and potential upsets.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      alt: 'Olympic athletes competing in various sports'
    },
    tags: ['olympics', 'sports', 'athletes', '2024'],
    status: 'published',
    featured: true,
    publishedAt: new Date(Date.now() - 86400000),
    views: 12350,
    readTime: 4
  },
  {
    title: 'Global Economic Outlook: Navigating Uncertain Times',
    slug: 'global-economic-outlook-navigating-uncertain-times',
    excerpt: 'Analysis of current economic trends and their potential impact on markets and consumers worldwide.',
    content: `
      <p>The global economy faces a complex landscape of challenges and opportunities. Understanding these dynamics is crucial for businesses and investors navigating the current climate.</p>
      
      <h2>Market Volatility</h2>
      <p>Recent market fluctuations have highlighted the interconnected nature of global economies and the rapid pace at which sentiment can shift.</p>
      
      <h2>Inflation Trends</h2>
      <p>Central banks worldwide are grappling with inflation management while trying to maintain economic growth momentum.</p>
      
      <h2>Emerging Markets</h2>
      <p>Several emerging markets show promising signs of growth, offering new opportunities for international investment and trade partnerships.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      alt: 'Financial charts and graphs showing economic data'
    },
    tags: ['economy', 'business', 'markets', 'finance'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 172800000),
    views: 8940,
    readTime: 6
  },
  {
    title: 'Breakthrough in Renewable Energy Technology',
    slug: 'breakthrough-in-renewable-energy-technology',
    excerpt: 'Scientists announce a major advancement in solar panel efficiency that could revolutionize clean energy adoption.',
    content: `
      <p>A team of researchers has developed a new type of solar panel that achieves unprecedented efficiency rates, potentially transforming the renewable energy landscape.</p>
      
      <h2>Technical Innovation</h2>
      <p>The breakthrough involves a novel approach to photovoltaic cell design that maximizes light absorption while minimizing energy loss.</p>
      
      <h2>Environmental Impact</h2>
      <p>This advancement could significantly accelerate the transition to clean energy by making solar power more cost-effective and efficient.</p>
      
      <h2>Commercial Applications</h2>
      <p>Industry experts predict that this technology could be commercially available within the next few years, pending further testing and refinement.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop',
      alt: 'Solar panels in a field with clear blue sky'
    },
    tags: ['renewable-energy', 'solar-power', 'environment', 'technology'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 259200000),
    views: 6780,
    readTime: 4
  },
  {
    title: 'Major Political Reform Announced by Government',
    slug: 'major-political-reform-announced-by-government',
    excerpt: 'New legislation aims to modernize voting systems and increase citizen participation in democratic processes.',
    content: `
      <p>The government has announced comprehensive political reforms designed to enhance democratic participation and modernize electoral systems.</p>
      
      <h2>Digital Voting Initiatives</h2>
      <p>The introduction of secure digital voting platforms aims to increase accessibility while maintaining election integrity.</p>
      
      <h2>Citizen Engagement</h2>
      <p>New programs will facilitate greater public involvement in policy-making processes through digital consultations and town halls.</p>
      
      <h2>Transparency Measures</h2>
      <p>Enhanced reporting requirements will provide citizens with better visibility into government operations and decision-making processes.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
      alt: 'Government building with democratic symbols'
    },
    tags: ['politics', 'democracy', 'reform', 'government'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 345600000),
    views: 11200,
    readTime: 5
  },
  {
    title: 'Revolutionary Medical Treatment Shows Promise',
    slug: 'revolutionary-medical-treatment-shows-promise',
    excerpt: 'Clinical trials reveal breakthrough therapy could transform treatment for previously incurable conditions.',
    content: `
      <p>A groundbreaking medical treatment has shown remarkable success in clinical trials, offering hope for patients with conditions previously considered untreatable.</p>
      
      <h2>Clinical Results</h2>
      <p>Phase III trials demonstrated significant improvement in patient outcomes with minimal side effects.</p>
      
      <h2>Treatment Mechanism</h2>
      <p>The therapy works by targeting specific cellular pathways, representing a new approach to personalized medicine.</p>
      
      <h2>Future Availability</h2>
      <p>Regulatory approval is expected within the next year, making this treatment accessible to patients worldwide.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      alt: 'Medical research laboratory with scientists working'
    },
    tags: ['health', 'medical', 'research', 'breakthrough'],
    status: 'published',
    featured: true,
    publishedAt: new Date(Date.now() - 432000000),
    views: 18650,
    readTime: 7
  },
  {
    title: 'Streaming Wars Heat Up with New Platform Launch',
    slug: 'streaming-wars-heat-up-with-new-platform-launch',
    excerpt: 'Another major player enters the competitive streaming market with exclusive content and innovative features.',
    content: `
      <p>The entertainment industry welcomes a new streaming platform that promises to shake up the competitive landscape with unique offerings.</p>
      
      <h2>Exclusive Content</h2>
      <p>The platform launches with a slate of original series and films from renowned creators and A-list talent.</p>
      
      <h2>Technology Innovation</h2>
      <p>Advanced recommendation algorithms and interactive features set this platform apart from existing competitors.</p>
      
      <h2>Market Impact</h2>
      <p>Industry analysts predict significant shifts in market share as consumers evaluate their streaming subscriptions.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=400&fit=crop',
      alt: 'Streaming entertainment on multiple devices'
    },
    tags: ['entertainment', 'streaming', 'technology', 'media'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 518400000),
    views: 9430,
    readTime: 3
  },
  {
    title: 'Climate Summit Reaches Historic Agreement',
    slug: 'climate-summit-reaches-historic-agreement',
    excerpt: 'World leaders unite on ambitious climate action plan with concrete targets and funding commitments.',
    content: `
      <p>An unprecedented climate summit has concluded with a historic agreement that sets ambitious targets for global carbon reduction and environmental protection.</p>
      
      <h2>Key Commitments</h2>
      <p>Nations have pledged to achieve net-zero emissions by 2050 with intermediate milestones every five years.</p>
      
      <h2>Funding Mechanisms</h2>
      <p>A new international fund will support developing countries in their transition to renewable energy systems.</p>
      
      <h2>Implementation Timeline</h2>
      <p>The agreement includes binding commitments with regular progress reviews and accountability measures.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
      alt: 'Wind turbines in a green landscape representing renewable energy'
    },
    tags: ['climate', 'environment', 'politics', 'sustainability'],
    status: 'published',
    featured: true,
    publishedAt: new Date(Date.now() - 604800000),
    views: 22100,
    readTime: 6
  },
  {
    title: 'Cryptocurrency Market Sees Major Institutional Adoption',
    slug: 'cryptocurrency-market-sees-major-institutional-adoption',
    excerpt: 'Major financial institutions announce integration of cryptocurrency services amid growing mainstream acceptance.',
    content: `
      <p>The cryptocurrency market has reached a new milestone with several major financial institutions announcing comprehensive digital asset services.</p>
      
      <h2>Institutional Services</h2>
      <p>Traditional banks are now offering cryptocurrency custody, trading, and investment services to their clients.</p>
      
      <h2>Regulatory Clarity</h2>
      <p>Recent regulatory guidance has provided the framework needed for institutional adoption and consumer protection.</p>
      
      <h2>Market Implications</h2>
      <p>This development is expected to bring greater stability and legitimacy to the cryptocurrency ecosystem.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop',
      alt: 'Cryptocurrency and blockchain technology concept'
    },
    tags: ['cryptocurrency', 'finance', 'blockchain', 'business'],
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 691200000),
    views: 13760,
    readTime: 5
  },
  {
    title: 'Space Exploration Milestone: Mars Mission Success',
    slug: 'space-exploration-milestone-mars-mission-success',
    excerpt: 'Historic Mars mission achieves breakthrough discoveries about the possibility of ancient life on the red planet.',
    content: `
      <p>A groundbreaking Mars mission has achieved remarkable success, providing unprecedented insights into the planet's geology and potential for ancient life.</p>
      
      <h2>Scientific Discoveries</h2>
      <p>The mission has uncovered evidence of ancient water systems and organic compounds that suggest Mars may have once harbored life.</p>
      
      <h2>Technological Achievements</h2>
      <p>Advanced robotics and communication systems have enabled real-time exploration and data collection from the Martian surface.</p>
      
      <h2>Future Missions</h2>
      <p>These findings pave the way for future human missions to Mars and expanded exploration of our solar system.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
      alt: 'Mars planet surface with rover and space exploration equipment'
    },
    tags: ['space', 'mars', 'science', 'exploration'],
    status: 'published',
    featured: true,
    publishedAt: new Date(Date.now() - 777600000),
    views: 31500,
    readTime: 8
  },
  {
    title: 'World Cup 2024: Unexpected Upsets Rock Tournament',
    slug: 'world-cup-2024-unexpected-upsets-rock-tournament',
    excerpt: 'Underdog teams create major surprises as traditional powerhouses struggle in early tournament rounds.',
    content: `
      <p>The 2024 World Cup has been full of surprises as several underdog teams have defeated traditional football powerhouses in stunning upsets.</p>
      
      <h2>Major Upsets</h2>
      <p>Three former world champions have already been eliminated in the group stages, marking one of the most unpredictable tournaments in history.</p>
      
      <h2>Rising Stars</h2>
      <p>Young players from emerging football nations are capturing global attention with their exceptional performances.</p>
      
      <h2>Tournament Dynamics</h2>
      <p>The unexpected results have created new storylines and rivalries that are captivating fans worldwide.</p>
    `,
    image: {
      url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop',
      alt: 'Soccer players celebrating victory in a stadium'
    },
    tags: ['world-cup', 'soccer', 'sports', 'tournament'],
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
    const createdUsers = await User.insertMany(users);
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
    const techCategory = categories.find(cat => cat.slug === 'technology');
    const sportsCategory = categories.find(cat => cat.slug === 'sports');
    const businessCategory = categories.find(cat => cat.slug === 'business');
    const politicsCategory = categories.find(cat => cat.slug === 'politics');
    const healthCategory = categories.find(cat => cat.slug === 'health');
    const entertainmentCategory = categories.find(cat => cat.slug === 'entertainment');
    
    const editor = users.find(user => user.role === 'editor');
    const john = users.find(user => user.name === 'John Doe');
    const jane = users.find(user => user.name === 'Jane Smith');
    const admin = users.find(user => user.role === 'admin');

    const articlesWithRefs = [
      // Technology Articles
      {
        ...articles[0], // AI Future
        category: techCategory._id,
        author: john._id
      },
      {
        ...articles[3], // Renewable Energy
        category: techCategory._id,
        author: editor._id
      },
      {
        ...articles[8], // Cryptocurrency
        category: techCategory._id,
        author: admin._id
      },
      {
        ...articles[11], // Quantum Computing
        category: techCategory._id,
        author: john._id
      },
      
      // Sports Articles
      {
        ...articles[1], // Olympics
        category: sportsCategory._id,
        author: jane._id
      },
      {
        ...articles[10], // World Cup
        category: sportsCategory._id,
        author: jane._id
      },
      
      // Business Articles
      {
        ...articles[2], // Economic Outlook
        category: businessCategory._id,
        author: editor._id
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
      
      // Health Articles
      {
        ...articles[5], // Medical Treatment
        category: healthCategory._id,
        author: john._id
      },
      
      // Entertainment Articles
      {
        ...articles[6], // Streaming Wars
        category: entertainmentCategory._id,
        author: jane._id
      },
      
      // Science (using Technology category for now)
      {
        ...articles[9], // Mars Mission
        category: techCategory._id,
        author: admin._id
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
    console.log('   User: john@newswebsite.com / User123!');
    
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