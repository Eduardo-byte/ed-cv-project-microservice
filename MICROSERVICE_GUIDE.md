# 🚀 CV API Microservice Migration Guide

## Overview
This guide explains how to extract and use the new CV API microservice that has been created from your existing monolithic application.

## What Was Created

### 📁 New API Microservice Structure
```
api/
├── config/                 # Configuration (database, email, logging)
├── middleware/             # Express middleware (auth, validation)
├── repositories/           # Data access layer (Supabase operations)
├── services/              # Business logic layer
├── routes/                # API route handlers
├── validators/            # Request validation rules
├── database/              # SQL schema files
├── logs/                  # Application logs (auto-created)
├── cluster.js             # Multi-process clustering
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
└── README.md              # Comprehensive documentation
```

## Migration Steps

### 1. Extract the API Folder
```bash
# Move the api folder to your new microservice project
mv /Users/eduardobrito/Desktop/ed_cv_project/api /path/to/your/new/api-project/
```

### 2. Set Up the Microservice
```bash
cd /path/to/your/new/api-project/api
npm install
```

### 3. Configure Environment
```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your actual values
```

### 4. Database Setup
```bash
# Run the database schemas in Supabase
# 1. Run projects_schema.sql (already exists)
# 2. Run contact_schema.sql (new table for contact messages)
```

### 5. Start the Microservice
```bash
# Development
npm run dev

# Production with clustering
npm run prod
```

## Frontend Integration

### Updated Configuration
The frontend has been updated to point to the new microservice:

**Before (Monolithic):**
```javascript
// Old endpoints pointing to various external APIs
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;
```

**After (Microservice):**
```javascript
// New endpoints pointing to dedicated API microservice
const API_BASE_URL = import.meta.env.PROD 
    ? '/api/v1'  // Production: served from same domain
    : 'http://localhost:3001/api/v1';  // Development: dedicated port
```

### Updated Endpoints
- **Projects**: `/api/v1/projects/*`
- **Contact**: `/api/v1/contact/*`
- **Health**: `/api/v1/health/*`

## Deployment Architecture

### Option 1: Separate Deployments
```
Frontend (Port 3000) ──┐
                      │
Backend API (Port 3001)──→ Supabase Database
                      │
Email Service ────────┘
```

### Option 2: Reverse Proxy (Production)
```
Nginx/Load Balancer
├── /          → Frontend Static Files
├── /api/v1/*  → API Microservice (Port 3001)
└── /api-docs  → Swagger Documentation
```

## What's Different

### Old Server (server.js)
- Mixed frontend serving and API routes
- Direct route handlers in main file
- Basic error handling
- No proper architecture separation

### New Microservice
- **Clean Architecture**: Routes → Services → Repositories
- **Comprehensive Logging**: Winston with file rotation
- **Health Checks**: Kubernetes-ready health endpoints
- **Clustering**: Multi-process support with graceful shutdown
- **Swagger Documentation**: Interactive API documentation
- **Input Validation**: Comprehensive request validation
- **Security**: Rate limiting, CORS, security headers
- **Error Handling**: Centralized error management

## API Documentation

### Swagger UI
Access interactive documentation at: `http://localhost:3001/api-docs`

### Key Improvements
1. **Better Error Responses**: Consistent error format with details
2. **Comprehensive Validation**: Input sanitization and validation
3. **Rate Limiting**: Protection against abuse
4. **Health Monitoring**: Multiple health check endpoints
5. **Structured Logging**: JSON logs with rotation
6. **Performance**: Compression, clustering, optimized queries

## Environment Variables

### Required Variables
```env
# Server
PORT=3001
NODE_ENV=production

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Email
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Frontend Updates Needed

### 1. Contact Form Service
The contact service has been updated to use the new endpoint:
```javascript
// Old: POST /api/contact
// New: POST /api/v1/contact
```

### 2. Projects Service  
The API project service now points to the dedicated microservice:
```javascript
// Old: Various external API endpoints
// New: http://localhost:3001/api/v1/projects/*
```

### 3. Error Handling
Update your frontend error handling to work with the new standardized error responses:
```javascript
{
  "success": false,
  "error": "Validation failed",
  "message": "Detailed error message",
  "details": [...] // Additional error details
}
```

## Production Deployment

### Docker Example
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "run", "prod"]
```

### Docker Compose Example
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Monitoring

### Health Checks
- **Liveness**: `/api/v1/health/live`
- **Readiness**: `/api/v1/health/ready` 
- **Full Health**: `/api/v1/health`

### Logging
- **Console**: Development logging
- **Files**: `logs/combined.log`, `logs/error.log`
- **Rotation**: Automatic log file rotation

## Testing the Migration

### 1. Start Both Services
```bash
# Terminal 1: API Microservice
cd api && npm run dev

# Terminal 2: Frontend
cd .. && npm run dev
```

### 2. Test Endpoints
```bash
# Health check
curl http://localhost:3001/api/v1/health

# Projects
curl http://localhost:3001/api/v1/projects

# Documentation
open http://localhost:3001/api-docs
```

### 3. Frontend Integration
- Contact form should work through the new API
- Projects should load from the new microservice
- Check browser network tab for correct endpoint calls

## Support

For questions or issues during migration:
- Check the API documentation at `/api-docs`
- Review logs in `api/logs/`
- Verify environment variables
- Test individual endpoints with curl or Postman

The microservice is now fully functional and ready to be deployed as a separate project! 🎉
