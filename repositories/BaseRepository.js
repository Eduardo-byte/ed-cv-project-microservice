import supabase from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Base Repository class with common CRUD operations
 * Provides standardized database interaction patterns
 */
class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.client = supabase;
  }

  /**
   * Build query with filters, sorting, and pagination
   * @param {Object} options - Query options
   * @returns {Object} Supabase query builder
   */
  buildQuery(options = {}) {
    let query = this.client.from(this.tableName).select(options.select || '*');

    // Apply filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'string' && value.includes('%')) {
            query = query.like(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });
    }

    // Apply sorting
    if (options.orderBy) {
      const { column, ascending = true } = options.orderBy;
      query = query.order(column, { ascending });
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + options.limit - 1);
      }
    }

    return query;
  }

  /**
   * Find all records with optional filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Query result
   */
  async findAll(options = {}) {
    try {
      logger.info(`Finding all records in ${this.tableName}`, { options });

      const query = this.buildQuery(options);
      const { data, error, count } = await query;

      if (error) {
        logger.error(`Error finding all in ${this.tableName}:`, error);
        throw error;
      }

      logger.info(`Found ${data?.length || 0} records in ${this.tableName}`);

      return {
        success: true,
        data: data || [],
        count: count || data?.length || 0,
        metadata: {
          table: this.tableName,
          executionTime: new Date().toISOString(),
          resultsCount: data?.length || 0
        }
      };

    } catch (error) {
      logger.error(`Repository error in findAll for ${this.tableName}:`, error);
      throw {
        success: false,
        error: 'Database query failed',
        message: error.message,
        table: this.tableName
      };
    }
  }

  /**
   * Find single record by ID
   * @param {string} id - Record ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Query result
   */
  async findById(id, options = {}) {
    try {
      logger.info(`Finding record by ID in ${this.tableName}`, { id });

      const query = this.client
        .from(this.tableName)
        .select(options.select || '*')
        .eq('id', id)
        .single();

      const { data, error } = await query;

      if (error) {
        if (error.code === 'PGRST116') {
          logger.warn(`Record not found in ${this.tableName} with ID: ${id}`);
          return {
            success: false,
            error: 'Record not found',
            data: null
          };
        }
        
        logger.error(`Error finding by ID in ${this.tableName}:`, error);
        throw error;
      }

      logger.info(`Found record in ${this.tableName} with ID: ${id}`);

      return {
        success: true,
        data,
        metadata: {
          table: this.tableName,
          id,
          executionTime: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.error(`Repository error in findById for ${this.tableName}:`, error);
      throw {
        success: false,
        error: 'Database query failed',
        message: error.message,
        table: this.tableName,
        id
      };
    }
  }

  /**
   * Create new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record
   */
  async create(data) {
    try {
      logger.info(`Creating record in ${this.tableName}`, { data });

      const { data: created, error } = await this.client
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        logger.error(`Error creating record in ${this.tableName}:`, error);
        throw error;
      }

      logger.info(`Record created in ${this.tableName}`, { id: created.id });

      return {
        success: true,
        data: created,
        metadata: {
          table: this.tableName,
          operation: 'create',
          executionTime: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.error(`Repository error in create for ${this.tableName}:`, error);
      throw {
        success: false,
        error: 'Failed to create record',
        message: error.message,
        table: this.tableName
      };
    }
  }

  /**
   * Update record by ID
   * @param {string} id - Record ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated record
   */
  async update(id, data) {
    try {
      logger.info(`Updating record in ${this.tableName}`, { id, data });

      const { data: updated, error } = await this.client
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error(`Error updating record in ${this.tableName}:`, error);
        throw error;
      }

      logger.info(`Record updated in ${this.tableName}`, { id });

      return {
        success: true,
        data: updated,
        metadata: {
          table: this.tableName,
          operation: 'update',
          id,
          executionTime: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.error(`Repository error in update for ${this.tableName}:`, error);
      throw {
        success: false,
        error: 'Failed to update record',
        message: error.message,
        table: this.tableName,
        id
      };
    }
  }

  /**
   * Delete record by ID
   * @param {string} id - Record ID
   * @returns {Promise<Object>} Deletion result
   */
  async delete(id) {
    try {
      logger.info(`Deleting record from ${this.tableName}`, { id });

      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        logger.error(`Error deleting record from ${this.tableName}:`, error);
        throw error;
      }

      logger.info(`Record deleted from ${this.tableName}`, { id });

      return {
        success: true,
        data: { id },
        metadata: {
          table: this.tableName,
          operation: 'delete',
          id,
          executionTime: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.error(`Repository error in delete for ${this.tableName}:`, error);
      throw {
        success: false,
        error: 'Failed to delete record',
        message: error.message,
        table: this.tableName,
        id
      };
    }
  }

  /**
   * Get record count with optional filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Record count
   */
  async count(filters = {}) {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { count, error } = await query;

      if (error) {
        logger.error(`Error counting records in ${this.tableName}:`, error);
        throw error;
      }

      return count || 0;

    } catch (error) {
      logger.error(`Repository error in count for ${this.tableName}:`, error);
      throw {
        success: false,
        error: 'Failed to count records',
        message: error.message,
        table: this.tableName
      };
    }
  }
}

export default BaseRepository;
