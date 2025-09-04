import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

// Import configuration
import logger from './config/logger.js';
import { testConnection } from './config/database.js';
import { verifyEmailConfig } from './config/email.js';

// Import middleware
import { validateApiKey } from './middleware/apiKey.js';

// Import routes
import projectRoutes from './routes/project.routes.js';
import contactRoutes from './routes/contact.routes.js';
import healthRoutes from './routes/health.routes.js';

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 3001;
const API_VERSION = process.env.API_VERSION || 'v1';
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGINS = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000'];

// Create Express application
const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CV API Microservice',
      version: '1.0.0',
      description: `A comprehensive API for managing CV website projects and contact messages.
      

**Health endpoints** are public and do not require authentication.
**Contact endpoints** are public for form submissions.
**Project endpoints** require API key authentication.`,
      contact: {
        name: 'Eduardo Brito',
        email: 'edbrito.luis@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/${API_VERSION}`,
        description: 'Development server'
      },
      {
        url: `https://ed-cv-project-microservice.onrender.com/api/${API_VERSION}`,
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Projects',
        description: 'Project management endpoints'
      },
      {
        name: 'Contact',
        description: 'Contact form and message management endpoints'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API Key for accessing protected endpoints.'
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Global middleware

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for Swagger UI
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: NODE_ENV === 'production' ? CORS_ORIGINS : true,
  credentials: true,
  allowedHeaders: [
        'Origin', 
        'X-Requested-With', 
        'Content-Type', 
        'Accept', 
        'Authorization',
        'x-api-key'  
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']

}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (NODE_ENV === 'production') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
} else {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CV API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true
  }
}));

// API Routes
app.use(`/api/${API_VERSION}/health`, healthRoutes); // Public health check
app.use(`/api/${API_VERSION}/projects`, validateApiKey, projectRoutes); // Protected projects
app.use(`/api/${API_VERSION}/contact`, contactRoutes); // Public contact form

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 CV API Microservice',
    version: '1.0.0',
    environment: NODE_ENV,
    documentation: '/api-docs',
    health: `/api/${API_VERSION}/health`,
    endpoints: {
      projects: `/api/${API_VERSION}/projects`,
      contact: `/api/${API_VERSION}/contact`
    },
    timestamp: new Date().toISOString()
  });
});

// API info endpoint
app.get(`/api/${API_VERSION}`, (req, res) => {
  res.json({
    name: 'CV API Microservice',
    version: '1.0.0',
    description: 'API for managing CV website projects and contact messages',
    documentation: '/api-docs',
    endpoints: {
      health: `/api/${API_VERSION}/health`,
      projects: `/api/${API_VERSION}/projects`,
      contact: `/api/${API_VERSION}/contact`
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
          availableEndpoints: {
        documentation: '/api-docs',
        health: `/api/${API_VERSION}/health`,
        projects: `/api/${API_VERSION}/projects`,
        contact: `/api/${API_VERSION}/contact`
      }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.logError(err, {
    route: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle specific error types
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON'
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Payload too large',
      message: 'Request body is too large'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    ...(NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Initialize server
async function initializeServer() {
  try {
    logger.info('🚀 Starting CV API Microservice...');
    
    // Test database connection
    logger.info('📊 Testing database connection...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    // Verify email configuration
    logger.info('📧 Verifying email configuration...');
    const emailConfigured = await verifyEmailConfig();
    if (!emailConfigured) {
      logger.warn('⚠️  Email configuration verification failed - email features may not work');
    }

    logger.info('✅ All services initialized successfully');

  } catch (error) {
    logger.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
}

// Start server
const server = app.listen(PORT, async () => {
  await initializeServer();
  
  logger.info(`🚀 CV API Microservice running on port ${PORT}`);
  logger.info(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info(`💚 Health Check: http://localhost:${PORT}/api/${API_VERSION}/health`);
  logger.info(`🔗 API Endpoints: http://localhost:${PORT}/api/${API_VERSION}`);
  logger.info(`🌍 Environment: ${NODE_ENV}`);
  logger.info(`👨‍💼 Worker PID: ${process.pid}`);
  
  if (NODE_ENV === 'development') {
    logger.info(`📋 Available routes:`);
    logger.info(`   GET  /api/${API_VERSION}/health`);
    logger.info(`   GET  /api/${API_VERSION}/projects`);
    logger.info(`   POST /api/${API_VERSION}/contact`);
    logger.info(`   GET  /api-docs (Swagger documentation)`);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle graceful shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
