# CV API Microservice

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> A comprehensive Node.js microservice for managing CV/portfolio website projects and contact messages. Built with Express.js, Supabase, and following enterprise-level architecture patterns.

## 📖 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [📚 API Documentation](#-api-documentation)
- [🏗️ Architecture](#️-architecture)
- [🔧 Development](#-development)
- [🚀 Deployment](#-deployment)
- [📊 Monitoring](#-monitoring)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [🔧 Tech Stack](#-tech-stack)
- [📄 License](#-license)
- [📞 Support](#-support)

## ✨ Features

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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account and database
- Gmail account for email services (or other SMTP provider)

### Installation

1. **Clone the repository and install dependencies**
```bash
git clone https://github.com/Eduardo-byte/cv-api-microservice.git
cd cv-api-microservice
npm install
```

2. **Environment Configuration**
```bash
# Create your .env file with the following variables:
cp .env.example .env  # (create .env.example first with the template below)
# Edit .env with your configuration
```

**Required Environment Variables:**
Create a `.env` file with these variables (see Configuration section below for complete list).

3. **Database Setup**
```bash
# Run the SQL schema in your Supabase database
# Copy and paste the content of database/projects_schema.sql into your Supabase SQL editor
# Or use the Supabase CLI:
supabase db sql < database/projects_schema.sql
```

4. **Start the service**
```bash
# Development
npm run dev

# Production with clustering
npm run prod
```

## ⚙️ Configuration

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

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# API Security (optional)
API_KEY=your_api_key_here

# Logging
LOG_LEVEL=info
```

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at: `http://localhost:3001/api-docs`

**🔐 Authentication in Swagger:**
1. Open the Swagger UI at `http://localhost:3001/api-docs`
2. Click the **"Authorize"** button (🔒 lock icon) at the top right
4. Click **"Authorize"** and then **"Close"**
5. You can now test all protected endpoints!

**Note:** Health and Contact endpoints are public and don't require authentication.

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
```

## 🏗️ Architecture

### Project Structure
```
cv-api-microservice/
├── config/                 # Configuration files
│   ├── database.js         # Supabase configuration
│   ├── email.js           # Email service configuration
│   └── logger.js          # Winston logging configuration
├── middleware/             # Express middleware
│   └── apiKey.js          # API key validation middleware
├── repositories/           # Data access layer
│   ├── base.repository.js   # Base repository with CRUD operations
│   └── project.repository.js # Project data operations
├── services/              # Business logic layer
│   └── project.service.js   # Project business logic
├── routes/                # API routes
│   ├── project.routes.js   # Project endpoints
│   ├── contact.routes.js   # Contact endpoints
│   └── health.routes.js    # Health check endpoints
├── validators/            # Request validation
│   └── projectValidators.js
├── database/              # Database schemas
│   └── projects_schema.sql
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

## 🔧 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run dev:cluster # Start with clustering in development
npm run prod       # Start production server with clustering
npm test           # Run tests (not configured yet)
npm run lint       # Run linter (not configured yet)
```

### Development Features
- **Hot Reload**: Nodemon for automatic server restart
- **Detailed Logging**: Console and file logging in development
- **Error Stack Traces**: Full error details in development mode
- **Swagger UI**: Interactive API testing interface

## 🚀 Deployment

### Environment Setup
Make sure to set all required environment variables in production:
- Database credentials (Supabase)
- Email service credentials  
- API keys and security settings
- CORS origins for your domain

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

## 📊 Monitoring & Logging

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

## 🔒 Security

### Implemented Security Measures
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: IP-based request throttling  
- **Security Headers**: Helmet.js security headers
- **CORS Protection**: Configurable cross-origin policies
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Spam Detection**: Contact form spam filtering

### API Authentication
- **API Key Support**: Service-to-service authentication for protected endpoints
- **Configurable**: Easy to extend with JWT or other auth methods

## 🗄️ Database Schema

### Projects Table
- **Comprehensive project data**: Title, description, type, status, technologies
- **Project types**: Company, personal, freelance projects
- **Rich metadata**: GitHub URLs, live URLs, images, metrics
- **Featured projects**: Priority and featured status support
- **Search & filtering**: Full-text search capabilities

See `database/projects_schema.sql` for the complete schema definition.

## 🔧 Tech Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: Supabase (PostgreSQL)
- **Email**: Nodemailer with Gmail/SMTP
- **Documentation**: Swagger/OpenAPI 3.0

### Key Dependencies
- **Security**: Helmet, CORS, Express Rate Limit
- **Validation**: Express Validator
- **Logging**: Winston
- **Process Management**: Node.js Cluster
- **Utilities**: Compression, Morgan, Dotenv

### Architecture Pattern
- **Clean Architecture**: Layered approach (Routes → Services → Repositories)
- **Dependency Injection**: Service and repository pattern
- **Error Handling**: Centralized error management
- **Configuration**: Environment-based configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Process

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
4. **Make** your changes
5. **Test** your changes thoroughly
6. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
7. **Push** to the branch (`git push origin feature/AmazingFeature`)
8. **Open** a Pull Request

### Code Style
- Use ES6+ features
- Follow the existing code structure (Routes → Services → Repositories)
- Add appropriate logging
- Update documentation as needed

### Reporting Issues
Please use the [GitHub Issues](https://github.com/Eduardo-byte/cv-api-microservice/issues) page to report bugs or request features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: edbrito.luis@gmail.com
- **GitHub Issues**: [Report a bug or request a feature](https://github.com/Eduardo-byte/cv-api-microservice/issues)
- **Documentation**: Check the [API documentation](http://localhost:3001/api-docs) when running locally

---

<div align="center">

**Built with ❤️ by [Eduardo Brito](https://github.com/Eduardo-byte)**

[⭐ Star this repo](https://github.com/Eduardo-byte/cv-api-microservice) • [🐛 Report Bug](https://github.com/Eduardo-byte/cv-api-microservice/issues) • [✨ Request Feature](https://github.com/Eduardo-byte/cv-api-microservice/issues)

</div>
