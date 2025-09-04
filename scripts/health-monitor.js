import cron from 'node-cron';
import fetch from 'node-fetch';
import logger from '../config/logger.js';

// Set health URL based on environment
const HEALTH_URL = process.env.APP_URL 
  ? `${process.env.APP_URL}/api/v1/health/live`
  : 'http://localhost:3001/api/v1/health/live';

// Run in both development and production
if (HEALTH_URL) {
  const env = process.env.NODE_ENV || 'development';
  
  // Run every 5 minutes for health monitoring
  cron.schedule('*/10 * * * * ', async () => {
    try {
      const response = await fetch(HEALTH_URL);
      if (response.ok) {
        logger.info(`🩺 HEALTH CHECK OK (${env}) - ${HEALTH_URL}`);
      } else {
        logger.warn(`Health monitor check failed: ${response.status} (${env})`);
      }
    } catch (error) {
      logger.error('Health monitor error:', error.message);
    }
  });

  logger.info(`🚀 HEALTH MONITORING ACTIVE (${env}) - URL: ${HEALTH_URL}`);
  console.log(`🚀 HEALTH MONITORING ACTIVE (${env}) - URL: ${HEALTH_URL}`);
}
