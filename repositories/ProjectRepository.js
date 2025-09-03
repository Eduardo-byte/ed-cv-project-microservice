import BaseRepository from './BaseRepository.js';
import logger from '../config/logger.js';

/**
 * Project Repository
 * Handles all database operations for projects
 */
class ProjectRepository extends BaseRepository {
  constructor() {
    super('projects');
  }

  /**
   * Get all projects with filtering and sorting
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Projects data
   */
  async getAllProjects(options = {}) {
    try {
      logger.info('Getting all projects', { options });

      const queryOptions = {
        select: '*',
        orderBy: { column: 'created_at', ascending: false },
        ...options
      };

      // Handle filters
      if (options.filters) {
        queryOptions.filters = {};
        
        // Project type filter
        if (options.filters.type) {
          queryOptions.filters.project_type = options.filters.type;
        }
        
        // Status filter
        if (options.filters.status) {
          queryOptions.filters.status = options.filters.status;
        }
        
        // Featured filter
        if (options.filters.featured !== undefined) {
          queryOptions.filters.is_featured = options.filters.featured;
        }
      }

      return await this.findAll(queryOptions);

    } catch (error) {
      logger.error('Error in getAllProjects:', error);
      throw error;
    }
  }

  /**
   * Get projects by type (company, personal, freelance)
   * @param {string} type - Project type
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Filtered projects
   */
  async getProjectsByType(type, options = {}) {
    try {
      logger.info(`Getting projects by type: ${type}`, { options });

      return await this.getAllProjects({
        ...options,
        filters: {
          ...options.filters,
          type
        }
      });

    } catch (error) {
      logger.error(`Error getting projects by type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Get featured projects only
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Featured projects
   */
  async getFeaturedProjects(options = {}) {
    try {
      logger.info('Getting featured projects', { options });

      return await this.getAllProjects({
        ...options,
        filters: {
          ...options.filters,
          featured: true
        }
      });

    } catch (error) {
      logger.error('Error getting featured projects:', error);
      throw error;
    }
  }

  /**
   * Get project statistics
   * @returns {Promise<Object>} Project statistics
   */
  async getProjectStats() {
    try {
      logger.info('Getting project statistics');

      const { data, error } = await this.client
        .from(this.tableName)
        .select('status, project_type, is_featured');

      if (error) {
        logger.error('Error getting project stats:', error);
        throw error;
      }

      // Calculate statistics
      const stats = {
        total: data?.length || 0,
        completed: data?.filter(p => p.status === 'completed').length || 0,
        inProgress: data?.filter(p => p.status === 'in_progress').length || 0,
        planned: data?.filter(p => p.status === 'planned').length || 0,
        archived: data?.filter(p => p.status === 'archived').length || 0,
        featured: data?.filter(p => p.is_featured).length || 0,
        company: data?.filter(p => p.project_type === 'company').length || 0,
        personal: data?.filter(p => p.project_type === 'personal').length || 0,
        freelance: data?.filter(p => p.project_type === 'freelance').length || 0
      };

      logger.info('Project statistics calculated', stats);

      return {
        success: true,
        data: stats,
        metadata: {
          table: this.tableName,
          operation: 'stats',
          executionTime: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.error('Error calculating project stats:', error);
      throw {
        success: false,
        error: 'Failed to calculate statistics',
        message: error.message,
        table: this.tableName
      };
    }
  }

  /**
   * Search projects by keyword in title, description, or technologies
   * @param {string} keyword - Search keyword
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Search results
   */
  async searchProjects(keyword, options = {}) {
    try {
      logger.info('Searching projects', { keyword, options });

      if (!keyword) {
        return await this.getAllProjects(options);
      }

      const searchTerm = `%${keyword.toLowerCase()}%`;
      
      let query = this.client
        .from(this.tableName)
        .select('*')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .order('created_at', { ascending: false });

      // Apply additional filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
        if (options.offset) {
          query = query.range(options.offset, options.offset + options.limit - 1);
        }
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error searching projects:', error);
        throw error;
      }

      logger.info(`Found ${data?.length || 0} projects matching "${keyword}"`);

      return {
        success: true,
        data: data || [],
        metadata: {
          table: this.tableName,
          operation: 'search',
          keyword,
          resultsCount: data?.length || 0,
          executionTime: new Date().toISOString()
        }
      };

    } catch (error) {
      logger.error('Error in searchProjects:', error);
      throw {
        success: false,
        error: 'Search failed',
        message: error.message,
        keyword
      };
    }
  }

  /**
   * Update project priority
   * @param {string} id - Project ID
   * @param {number} priority - New priority
   * @returns {Promise<Object>} Updated project
   */
  async updatePriority(id, priority) {
    try {
      logger.info(`Updating project priority`, { id, priority });

      return await this.update(id, { priority });

    } catch (error) {
      logger.error('Error updating project priority:', error);
      throw error;
    }
  }

  /**
   * Toggle featured status
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Updated project
   */
  async toggleFeatured(id) {
    try {
      logger.info(`Toggling featured status for project ${id}`);

      // First get current status
      const project = await this.findById(id);
      if (!project.success) {
        throw new Error('Project not found');
      }

      const newFeaturedStatus = !project.data.is_featured;
      
      return await this.update(id, { is_featured: newFeaturedStatus });

    } catch (error) {
      logger.error('Error toggling featured status:', error);
      throw error;
    }
  }
}

export default ProjectRepository;
