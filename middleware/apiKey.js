import logger from '../config/logger.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * API Key Authentication Middleware
 * Validates API key from header or query parameter
 */
export const validateApiKey = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.apikey;
    console.log('apiKey', apiKey);
    const validApiKey = process.env.API_KEY;
    console.log('validApiKey', validApiKey);

    if (!validApiKey) {
      logger.error('API_KEY not configured in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
        message: 'API key validation not properly configured'
      });
    }
    console.log('apiKey', apiKey);
    if (!apiKey) {
      logger.warn('API key missing in request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });

      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'API key is required. Provide it in X-API-Key header or apikey query parameter.'
      });
    }

    if (apiKey !== validApiKey) {
      logger.warn('Invalid API key attempt', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        providedKey: apiKey.substring(0, 8) + '...' // Log partial key for debugging
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid authentication',
        message: 'Invalid API key provided'
      });
    }

    // API key is valid, continue
    logger.info('API key validated successfully', {
      ip: req.ip,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('Error in API key validation:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: 'Failed to validate API key'
    });
  }
};

/**
 * Optional API Key middleware - validates if provided but doesn't require it
 */
export const optionalApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apikey;
  
  if (!apiKey) {
    // No API key provided, but that's okay for optional routes
    return next();
  }

  // If API key is provided, validate it
  validateApiKey(req, res, next);
};

export default { validateApiKey, optionalApiKey };
