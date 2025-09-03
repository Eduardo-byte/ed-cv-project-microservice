import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from './logger.js';

// Load environment variables first
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase configuration. Check SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  throw new Error('Database configuration error');
}

// Create Supabase client with additional options
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // For server-side usage
  },
  db: {
    schema: 'public'
  }
});

// Test database connection
export const testConnection = async () => {
  try {
    logger.info('Testing database connection...');
    
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (error) {
      logger.error('Database connection test failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return false;
    }

    logger.info('✅ Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection error:', error);
    return false;
  }
};

// Database health check
export const healthCheck = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    return { healthy: !error, error: error?.message };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

export default supabase;
