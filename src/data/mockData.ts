// Mock data for article categories
export const categories = [
  { name: 'Movies', slug: 'movies' },
  { name: 'Sport', slug: 'sport' },
  { name: 'Politics', slug: 'politics' },
  { name: 'Middle East', slug: 'middle-east' },
  { name: 'Crime', slug: 'crime' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Business', slug: 'business' },
  { name: 'Health', slug: 'health' },
];

// Mock data for story sources/publishers
export const publishers = [
  { name: 'BBC News', slug: 'bbc-news', logo: '/logos/bbc-news.png' },
  { name: 'CNN', slug: 'cnn', logo: '/logos/cnn.png' },
  { name: 'Formula One', slug: 'formula-one', logo: '/logos/formula-one.png' },
  { name: 'ESPN', slug: 'espn', logo: '/logos/espn.png' },
  { name: 'BBC', slug: 'bbc', logo: '/logos/bbc.png' },
  { name: 'GOAL', slug: 'goal', logo: '/logos/goal.png' },
  { name: 'Apple', slug: 'apple', logo: '/logos/apple.png' },
  { name: 'Samsung', slug: 'samsung', logo: '/logos/samsung.png' },
  { name: 'Independent', slug: 'independent', logo: '/logos/independent.png' },
  { name: 'TheVerge', slug: 'theverge', logo: '/logos/verge.png' },
];

// Mock data for articles
export const articles = [
  {
    id: '1',
    slug: 'john-wick-chapter-4-streaming',
    title: 'Where To Watch \'John Wick: Chapter 4\'',
    excerpt: 'There\'s been no official announcement regarding John Wick: Chapter 4\'s streaming release. However, given it\'s a Lionsgate film, John Wick: Chapter 4 will eventually be released on Starz.',
    imageUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: categories[0], // Movies
    author: {
      name: 'Netflix',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-12T10:00:00Z'),
    readTime: 4,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    publisherLogo: '/logos/netflix.png'
  },
  {
    id: '2',
    slug: 'verstappen-backs-hamilton',
    title: '\'He deserves a lot more\': Verstappen backs Hamilton',
    excerpt: 'Formula 1 world champion Max Verstappen says Lewis Hamilton is "an amazing driver" who deserves more than he\'s getting from his current Mercedes car.',
    imageUrl: 'https://images.unsplash.com/photo-1541752171434-3bfb0129a010?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
    category: categories[1], // Sport
    author: {
      name: 'Formula 1',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-15T14:30:00Z'),
    readTime: 8,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },
  {
    id: '3',
    slug: 'liverpool-hammer-leeds',
    title: 'Liverpool hammer Leeds for first win in five games',
    excerpt: 'Liverpool stormed to a comfortable victory over struggling Leeds United as Jurgen Klopp\'s side gained their first league win in five games by putting six past the relegation-threatened hosts.',
    imageUrl: 'https://images.unsplash.com/photo-1523496922380-91d5afba98a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80',
    category: categories[1], // Sport
    author: {
      name: 'BBC',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-17T19:45:00Z'),
    readTime: 8,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },
  {
    id: '4',
    slug: 'papua-hunt-for-kidnapped-pilot',
    title: 'Papua: At least one killed in hunt for kidnapped NZ pilot',
    excerpt: 'At least one person has been killed in a violent attack while searching for a kidnapped New Zealand pilot in Indonesia\'s Papua region.',
    imageUrl: 'https://images.unsplash.com/photo-1491382825904-a4c6dca98e8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    category: categories[4], // Crime
    author: {
      name: 'Sky News',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-17T08:15:00Z'),
    readTime: 6,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },
  {
    id: '5',
    slug: 'israel-nuclear-road-ahead',
    title: 'Jeremy Bowen: Israel\'s \'nuclear road ahead\'',
    excerpt: 'Israel\'s armed forces have been at war with Hamas and other Palestinians are on the rise once more, with threats of attack and a hardline response.',
    imageUrl: 'https://images.unsplash.com/photo-1546990539-4b4466e92645?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
    category: categories[3], // Middle East
    author: {
      name: 'BBC',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-15T12:00:00Z'),
    readTime: 9,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },
  {
    id: '6',
    slug: 'ukraine-silence-along-southern-front',
    title: 'Ukraine\'s silence along southern front fuels counteroffensive speculation',
    excerpt: 'Observing Ukraine\'s southern frontier, you might expect a build-up of spring. Tank forces and storage of heavy weapons all along the front lines from southern Donetsk to the sea.',
    imageUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
    category: categories[2], // Politics
    author: {
      name: 'CNN',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-10T16:20:00Z'),
    readTime: 10,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },
  {
    id: '7',
    slug: 'taylor-swift-message-to-women',
    title: 'Taylor Swift is sending a powerful message to women on the Eras Tour',
    excerpt: 'My first strings of discontent hit "Taylor Swift\'s music is like ketchup: it\'s everywhere after her infectious new haircut from fan-favorite "Cruel Summer" hit.',
    imageUrl: 'https://images.unsplash.com/photo-1565035010268-a3816f98589a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1776&q=80',
    category: categories[6], // Entertainment
    author: {
      name: 'CNN',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-05T09:30:00Z'),
    readTime: 12,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },
  {
    id: '8',
    slug: 'iphone-15-rumors',
    title: 'All the rumors about the iPhone 15, expected in 2023',
    excerpt: 'Apple in September 2023 released the iPhone 15, but we\'ve been hearing rumors about the iPhone 16 since well before the launch.',
    imageUrl: 'https://images.unsplash.com/photo-1603791239531-1dda55e194a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
    category: categories[5], // Technology
    author: {
      name: 'MacRumors',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-05T11:10:00Z'),
    readTime: 12,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },
  {
    id: '9',
    slug: 'rio-de-janeiro-marvelous-city',
    title: 'Rio de Janeiro: The \'Marvelous City\' welcomes digital nomads',
    excerpt: 'Long renowned for beaches and nightlife, the Brazilian city now lures remote workers with co-working spaces, networking events, and improved infrastructure.',
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
    category: categories[5], // Technology
    author: {
      name: 'CNN Travel',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-03T15:40:00Z'),
    readTime: 8,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },
  {
    id: '10',
    slug: 'chatgpt-ai-hiring',
    title: 'ChatGPT: How generative AI could change hiring as we know it',
    excerpt: 'As AI advances, recruiters are using it to streamline hiring processes, from screening resumes to conducting preliminary interviews.',
    imageUrl: 'https://images.unsplash.com/photo-1677442135133-4da67944eeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
    category: categories[5], // Technology
    author: {
      name: 'BBC News',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80'
    },
    publishedAt: new Date('2023-04-01T14:20:00Z'),
    readTime: 10,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  },
];

// Featured articles for the homepage
export const featuredArticles = [articles[0], articles[4], articles[7]];

// Latest news articles
export const latestNews = [articles[1], articles[2], articles[3], articles[4]];

// Editor's picks
export const editorsPicks = [articles[7], articles[8], articles[9]];

// Business news
export const businessNews = articles.filter(article => 
  article.category.slug === 'business' || article.category.slug === 'technology'
).slice(0, 4);

// Sports news  
export const sportsNews = articles.filter(article => 
  article.category.slug === 'sport'
).slice(0, 4); 