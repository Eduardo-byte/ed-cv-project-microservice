# CV API Microservice

A comprehensive Node.js microservice for managing CV website projects and contact messages. Built with Express.js, Supabase, and following enterprise-level architecture patterns.

## Features

### 🏗️ Architecture
- **Layered Architecture**: Routes → Services → Repositories pattern
- **Microservice Ready**: Designed for containerization and cloud deployment
- **Clustering Support**: Multi-process support with graceful shutdown
- **Health Checks**: Comprehensive health monitoring endpoints

### 📊 API Features
- **Project Management**: Full CRUD operations for portfolio projects
- **Contact Management**: Handle contact form submissions with email notifications
- **Advanced Filtering**: Search, filter, and paginate through data
- **Statistics**: Get insights and analytics for projects and messages

### 🔒 Security & Performance
- **Rate Limiting**: Configurable request rate limiting
- **Input Validation**: Comprehensive request validation and sanitization
- **Security Headers**: Helmet.js for security headers
- **CORS Support**: Configurable cross-origin resource sharing
- **Compression**: Gzip compression for responses

### 📚 Documentation
- **Swagger/OpenAPI**: Interactive API documentation
- **Comprehensive Logging**: Winston-based structured logging
- **Error Handling**: Global error handling with detailed responses

## Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account and database
- Gmail account for email services (or other SMTP provider)

### Installation

1. **Clone and install dependencies**
```bash
cd api
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**
```bash
# Run the SQL schemas in your Supabase database
cat database/projects_schema.sql | supabase db sql
cat database/contact_schema.sql | supabase db sql
```

4. **Start the service**
```bash
# Development
npm run dev

# Production with clustering
npm run prod
```

## Configuration

### Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration - Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Email Configuration - Gmail
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_app_specific_password

# API Configuration
API_VERSION=v1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
JWT_SECRET=your_jwt_secret_here
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=info
```

## API Documentation

### Swagger UI
Access interactive API documentation at: `http://localhost:3001/api-docs`

### Key Endpoints

#### Health Check
```
GET /api/v1/health           # Full health check
GET /api/v1/health/ready     # Readiness probe
GET /api/v1/health/live      # Liveness probe
```

#### Projects
```
GET    /api/v1/projects                    # Get all projects
GET    /api/v1/projects/featured           # Get featured projects
GET    /api/v1/projects/stats              # Get project statistics
GET    /api/v1/projects/search?q=keyword   # Search projects
GET    /api/v1/projects/type/:type         # Get projects by type
GET    /api/v1/projects/:id                # Get project by ID
POST   /api/v1/projects                    # Create project (admin)
```

#### Contact
```
POST   /api/v1/contact                     # Submit contact form
GET    /api/v1/contact/messages            # Get messages (admin)
GET    /api/v1/contact/messages/stats      # Get contact stats (admin)
GET    /api/v1/contact/messages/search     # Search messages (admin)
GET    /api/v1/contact/messages/:id        # Get message by ID (admin)
PATCH  /api/v1/contact/messages/:id/reply  # Mark as replied (admin)
```

## Architecture

### Project Structure
```
api/
├── config/                 # Configuration files
│   ├── database.js         # Supabase configuration
│   ├── email.js           # Email service configuration
│   └── logger.js          # Winston logging configuration
├── middleware/             # Express middleware
│   └── auth.js            # Authentication middleware
├── repositories/           # Data access layer
│   ├── BaseRepository.js   # Base repository with CRUD operations
│   ├── ProjectRepository.js # Project data operations
│   └── ContactRepository.js # Contact data operations
├── services/              # Business logic layer
│   ├── ProjectService.js   # Project business logic
│   └── ContactService.js   # Contact business logic
├── routes/                # API routes
│   ├── projectRoutes.js   # Project endpoints
│   ├── contactRoutes.js   # Contact endpoints
│   └── healthRoutes.js    # Health check endpoints
├── validators/            # Request validation
│   ├── projectValidators.js
│   └── contactValidators.js
├── database/              # Database schemas
│   ├── projects_schema.sql
│   └── contact_schema.sql
├── logs/                  # Application logs
├── cluster.js             # Clustering configuration
├── server.js              # Main application file
└── package.json           # Dependencies and scripts
```

### Data Flow
```
Request → Routes → Validators → Services → Repositories → Database
Response ← Routes ← Services ← Repositories ← Database
```

## Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run dev:cluster # Start with clustering in development
npm run prod       # Start production server with clustering
npm test           # Run tests
npm run swagger    # Generate swagger documentation
```

### Development Features
- **Hot Reload**: Nodemon for automatic server restart
- **Detailed Logging**: Console and file logging in development
- **Error Stack Traces**: Full error details in development mode
- **Swagger UI**: Interactive API testing interface

## Production Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "run", "prod"]
```

### Key Production Features
- **Process Clustering**: Utilizes all CPU cores
- **Graceful Shutdown**: Proper cleanup on termination signals
- **Health Checks**: Kubernetes/Docker health probe endpoints
- **Production Logging**: Structured JSON logs
- **Security Headers**: Comprehensive security middleware
- **Rate Limiting**: Protection against abuse

## Monitoring & Logging

### Health Monitoring
- **Health Status**: Overall service health with dependency checks
- **Readiness**: Database connectivity verification
- **Liveness**: Service responsiveness check
- **Metrics**: Memory usage, uptime, and performance metrics

### Logging
- **Structured Logging**: JSON format for easy parsing
- **Log Levels**: Configurable logging levels
- **File Rotation**: Automatic log file rotation
- **Request Logging**: Detailed HTTP request/response logging

## Security

### Implemented Security Measures
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: IP-based request throttling  
- **Security Headers**: Helmet.js security headers
- **CORS Protection**: Configurable cross-origin policies
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Spam Detection**: Contact form spam filtering

### Authentication (Optional)
- **JWT Support**: Token-based authentication
- **API Key Support**: Service-to-service authentication
- **Role-based Access**: Admin-only endpoints

## Database Schema

### Projects Table
- Full project information with metadata
- Support for different project types (company, personal, freelance)
- Technology stack and feature tracking
- Featured project support

### Contact Messages Table  
- Contact form submissions with status tracking
- Email notifications and spam protection
- Admin management capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, please contact: edbrito.luis@gmail.com
