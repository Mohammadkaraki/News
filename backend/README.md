# News Website Backend API

A comprehensive, production-ready backend API for a news website built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Article Management** - Full CRUD operations with advanced features
- **Category Management** - Organized content categorization
- **Advanced Search** - Full-text search with filters and sorting
- **File Upload Support** - Image handling with Cloudinary integration
- **Analytics & Statistics** - Comprehensive data insights
- **Security Features** - Rate limiting, CORS, helmet, and more
- **Data Validation** - Input validation and sanitization
- **Error Handling** - Centralized error management
- **Database Seeding** - Sample data for development

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer with Cloudinary
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://orders:12345654321@cluster0.oav6y.mongodb.net/news_website

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=30d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

### 5. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or your specified PORT).

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Endpoints

#### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/users/register` | Register new user | Public |
| POST | `/users/login` | Login user | Public |

**Register User**
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Login User**
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### Profile Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users/profile` | Get current user profile | Private |
| PUT | `/users/profile` | Update user profile | Private |
| PUT | `/users/change-password` | Change password | Private |

#### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin/Editor |
| PUT | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| GET | `/users/stats` | Get user statistics | Admin |

### Article Endpoints

#### Public Access

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/articles` | Get all published articles | Public |
| GET | `/articles/:slug` | Get article by slug | Public |
| GET | `/articles/featured` | Get featured articles | Public |
| GET | `/articles/popular` | Get popular articles | Public |
| GET | `/articles/search` | Search articles | Public |
| GET | `/articles/category/:slug` | Get articles by category | Public |
| POST | `/articles/:id/like` | Like an article | Public |
| POST | `/articles/:id/share` | Share an article | Public |

**Get Articles with Filters**
```bash
GET /api/articles?category=technology&page=1&limit=10&sort=popular&search=AI
```

**Create Article**
```bash
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Sample Article Title",
  "excerpt": "Brief description of the article content...",
  "content": "<p>Full article content with HTML formatting...</p>",
  "image": {
    "url": "https://example.com/image.jpg",
    "alt": "Image description"
  },
  "category": "64f8d4e5c123456789abcdef",
  "tags": ["technology", "ai", "future"],
  "status": "published",
  "featured": false,
  "seo": {
    "metaTitle": "SEO optimized title",
    "metaDescription": "SEO description"
  }
}
```

#### Protected Access

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/articles` | Create new article | Editor/Admin |
| PUT | `/articles/:id` | Update article | Owner/Editor/Admin |
| DELETE | `/articles/:id` | Delete article | Owner/Editor/Admin |
| GET | `/articles/stats/overview` | Get article statistics | Private |

### Category Endpoints

#### Public Access

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/categories` | Get all active categories | Public |
| GET | `/categories/:slug` | Get category by slug | Public |

**Get Categories with Article Count**
```bash
GET /api/categories?includeCount=true
```

#### Admin Only

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/categories` | Create new category | Admin |
| PUT | `/categories/:id` | Update category | Admin |
| DELETE | `/categories/:id` | Delete category | Admin |
| GET | `/categories/admin/list` | Get all categories (admin) | Admin |
| GET | `/categories/admin/stats` | Get category statistics | Admin |
| PUT | `/categories/bulk/update` | Bulk update categories | Admin |
| PUT | `/categories/bulk/reorder` | Reorder categories | Admin |
| PUT | `/categories/:id/toggle` | Toggle category status | Admin |

**Create Category**
```bash
POST /api/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Technology",
  "description": "Latest tech news and innovations",
  "color": "#3B82F6",
  "icon": "laptop",
  "sortOrder": 1
}
```

## 🔐 Authentication & Authorization

### User Roles

- **User**: Basic user with read access and profile management
- **Editor**: Can create, edit, and delete articles
- **Admin**: Full access to all resources including user and category management

### JWT Token Structure

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "user|editor|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 📊 Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "errorId": "unique_error_id"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevents abuse and DOS attacks
- **CORS Configuration** - Cross-origin request handling
- **Helmet** - Security headers
- **Input Validation** - Comprehensive data validation
- **MongoDB Injection Protection** - Sanitized queries

## 📈 Performance Features

- **Database Indexing** - Optimized query performance
- **Pagination** - Efficient data loading
- **Compression** - Gzip compression for responses
- **Connection Pooling** - MongoDB connection optimization

## 🧪 Testing

### Default Test Accounts

After running the seed script, you can use these accounts:

```
Admin Account:
Email: admin@newswebsite.com
Password: Admin123!

Editor Account:
Email: editor@newswebsite.com
Password: Editor123!

User Account:
Email: john@newswebsite.com
Password: User123!
```

### API Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints.

Example curl request:
```bash
curl -X GET \
  http://localhost:5000/api/articles \
  -H 'Content-Type: application/json'
```

## 📝 Development

### Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── articleController.js
│   ├── categoryController.js
│   └── userController.js
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── errorHandler.js    # Error handling middleware
├── models/
│   ├── Article.js         # Article model
│   ├── Category.js        # Category model
│   └── User.js            # User model
├── routes/
│   ├── articleRoutes.js
│   ├── categoryRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── generateSlug.js    # Slug generation utility
│   └── seedData.js        # Database seeding script
├── server.js              # Main server file
├── package.json
└── README.md
```

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests (when implemented)

## 🚀 Deployment

### Environment Variables for Production

Ensure all environment variables are properly set for production:

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Platforms

This backend can be deployed to:
- Heroku
- Vercel
- DigitalOcean
- AWS
- Railway
- Render

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

## 🔗 Frontend Integration

This backend is designed to work with a Next.js frontend. Use Axios or fetch to make API calls:

```javascript
// Example: Fetch articles
const fetchArticles = async () => {
  try {
    const response = await fetch('/api/articles');
    const data = await response.json();
    return data.data.articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

// Example: Login user
const loginUser = async (email, password) => {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      return data.data.user;
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

This backend provides a robust foundation for your news website with comprehensive features, security, and scalability in mind. 