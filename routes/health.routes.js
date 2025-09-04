import express from 'express';
import { healthCheck as dbHealthCheck } from '../config/database.js';
import { emailHealthCheck } from '../config/email.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [healthy, unhealthy, degraded]
 *         message:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         version:
 *           type: string
 *         uptime:
 *           type: string
 *         services:
 *           type: object
 *           properties:
 *             database:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 healthy:
 *                   type: boolean
 *                 error:
 *                   type: string
 *             email:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 healthy:
 *                   type: boolean
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health check completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *       503:
 *         description: Service unavailable
 */
router.get('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    logger.info('GET /api/v1/health - Health check requested');

    // Check database health
    const dbHealth = await dbHealthCheck();
    
    // Check email service health
    const emailHealth = await emailHealthCheck();

    // Determine overall health status
    const allServicesHealthy = dbHealth.healthy && emailHealth.healthy;
    const someServicesHealthy = dbHealth.healthy || emailHealth.healthy;
    
    let overallStatus = 'healthy';
    let statusCode = 200;
    
    if (!allServicesHealthy) {
      if (someServicesHealthy) {
        overallStatus = 'degraded';
        statusCode = 200; // Still functional, but degraded
      } else {
        overallStatus = 'unhealthy';
        statusCode = 503; // Service unavailable
      }
    }

    // Calculate uptime
    const uptime = process.uptime();
    const uptimeFormatted = formatUptime(uptime);

    const healthStatus = {
      status: overallStatus,
      message: getHealthMessage(overallStatus),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: uptimeFormatted,
      environment: process.env.NODE_ENV || 'development',
      processId: process.pid,
      services: {
        database: {
          status: dbHealth.healthy ? 'healthy' : 'unhealthy',
          healthy: dbHealth.healthy,
          error: dbHealth.error || null
        },
        email: {
          status: emailHealth.healthy ? 'healthy' : 'unhealthy',
          healthy: emailHealth.healthy,
          error: emailHealth.error || null
        }
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    };

    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.info(`Health check completed: ${overallStatus}`, { 
      duration: `${duration}ms`,
      dbHealthy: dbHealth.healthy,
      emailHealthy: emailHealth.healthy 
    });

    res.status(statusCode).json(healthStatus);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'GET /api/v1/health' });

    res.status(503).json({
      status: 'unhealthy',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: error.message,
      version: '1.0.0'
    });
  }
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe
 *     tags: [Health]
 *     description: Returns 200 if the service is ready to accept requests
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/ready', async (req, res) => {
  const startTime = Date.now();
  
  try {
    logger.info('GET /api/v1/health/ready - Readiness check requested');

    // Perform minimal checks for readiness
    const dbHealth = await dbHealthCheck();
    
    if (!dbHealth.healthy) {
      throw new Error('Database not ready');
    }

    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);

    res.json({
      status: 'ready',
      message: 'Service is ready to accept requests',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'GET /api/v1/health/ready' });

    res.status(503).json({
      status: 'not_ready',
      message: 'Service is not ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     tags: [Health]
 *     description: Returns 200 if the service is alive
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get('/live', (req, res) => {
  const startTime = Date.now();
  
  logger.info('GET /api/v1/health/live - Liveness check requested');
  
  const duration = Date.now() - startTime;
  logger.logRequest(req, res, duration);

  res.json({
    status: 'alive',
    message: 'Service is alive',
    timestamp: new Date().toISOString(),
    uptime: formatUptime(process.uptime()),
    processId: process.pid
  });
});

// Helper functions

function getHealthMessage(status) {
  switch (status) {
    case 'healthy':
      return 'CV API Microservice is running normally';
    case 'degraded':
      return 'CV API Microservice is running with some issues';
    case 'unhealthy':
      return 'CV API Microservice is experiencing critical issues';
    default:
      return 'Unknown health status';
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export default router;
