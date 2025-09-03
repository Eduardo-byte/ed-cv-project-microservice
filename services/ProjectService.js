import ProjectRepository from '../repositories/ProjectRepository.js';
import logger from '../config/logger.js';

/**
 * Project Service
 * Handles business logic for project operations
 */
class ProjectService {
  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  /**
   * Get all projects with filtering and pagination
   * @param {Object} options - Service options
   * @returns {Promise<Object>} Projects response
   */
  async getAllProjects(options = {}) {
    try {
      logger.info('ProjectService: Getting all projects', { options });

      // Validate and sanitize options
      const sanitizedOptions = this.sanitizeQueryOptions(options);
      
      const result = await this.projectRepository.getAllProjects(sanitizedOptions);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch projects');
      }

      return this.formatResponse(result, 'Projects retrieved successfully');

    } catch (error) {
      logger.error('ProjectService: Error getting all projects', error);
      throw this.formatError(error, 'Failed to fetch projects');
    }
  }

  /**
   * Get single project by ID
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Project response
   */
  async getProjectById(projectId) {
    try {
      logger.info('ProjectService: Getting project by ID', { projectId });

      // Validate project ID
      if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID provided');
      }

      const result = await this.projectRepository.findById(projectId);
      
      if (!result.success) {
        if (result.error === 'Record not found') {
          throw new Error('Project not found');
        }
        throw new Error(result.message || 'Failed to fetch project');
      }

      return this.formatResponse(result, 'Project retrieved successfully');

    } catch (error) {
      logger.error('ProjectService: Error getting project by ID', error);
      throw this.formatError(error, 'Failed to fetch project');
    }
  }

  /**
   * Get projects by type
   * @param {string} type - Project type (company, personal, freelance)
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Projects response
   */
  async getProjectsByType(type, options = {}) {
    try {
      logger.info('ProjectService: Getting projects by type', { type, options });

      // Validate project type
      const validTypes = ['company', 'personal', 'freelance'];
      if (!validTypes.includes(type)) {
        throw new Error(`Invalid project type. Must be one of: ${validTypes.join(', ')}`);
      }

      const sanitizedOptions = this.sanitizeQueryOptions(options);
      const result = await this.projectRepository.getProjectsByType(type, sanitizedOptions);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch projects by type');
      }

      return this.formatResponse(result, `${type.charAt(0).toUpperCase() + type.slice(1)} projects retrieved successfully`);

    } catch (error) {
      logger.error('ProjectService: Error getting projects by type', error);
      throw this.formatError(error, 'Failed to fetch projects by type');
    }
  }

  /**
   * Get featured projects
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Featured projects response
   */
  async getFeaturedProjects(options = {}) {
    try {
      logger.info('ProjectService: Getting featured projects', { options });

      const sanitizedOptions = this.sanitizeQueryOptions(options);
      const result = await this.projectRepository.getFeaturedProjects(sanitizedOptions);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch featured projects');
      }

      return this.formatResponse(result, 'Featured projects retrieved successfully');

    } catch (error) {
      logger.error('ProjectService: Error getting featured projects', error);
      throw this.formatError(error, 'Failed to fetch featured projects');
    }
  }

  /**
   * Get project statistics
   * @returns {Promise<Object>} Statistics response
   */
  async getProjectStats() {
    try {
      logger.info('ProjectService: Getting project statistics');

      const result = await this.projectRepository.getProjectStats();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch project statistics');
      }

      return this.formatResponse(result, 'Project statistics retrieved successfully');

    } catch (error) {
      logger.error('ProjectService: Error getting project stats', error);
      throw this.formatError(error, 'Failed to fetch project statistics');
    }
  }

  /**
   * Search projects by keyword
   * @param {string} keyword - Search keyword
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Search results
   */
  async searchProjects(keyword, options = {}) {
    try {
      logger.info('ProjectService: Searching projects', { keyword, options });

      // Sanitize keyword
      const sanitizedKeyword = keyword ? keyword.trim().substring(0, 100) : '';
      
      if (sanitizedKeyword.length < 2 && sanitizedKeyword.length > 0) {
        throw new Error('Search keyword must be at least 2 characters long');
      }

      const sanitizedOptions = this.sanitizeQueryOptions(options);
      const result = await this.projectRepository.searchProjects(sanitizedKeyword, sanitizedOptions);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to search projects');
      }

      return this.formatResponse(result, `Search completed. Found ${result.data.length} projects`);

    } catch (error) {
      logger.error('ProjectService: Error searching projects', error);
      throw this.formatError(error, 'Failed to search projects');
    }
  }

  /**
   * Create new project
   * @param {Object} projectData - Project data
   * @returns {Promise<Object>} Created project response
   */
  async createProject(projectData) {
    try {
      logger.info('ProjectService: Creating new project', { 
        title: projectData.title,
        type: projectData.project_type 
      });

      // Validate required fields
      const validationErrors = this.validateProjectData(projectData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      // Sanitize data
      const sanitizedData = this.sanitizeProjectData(projectData);
      
      const result = await this.projectRepository.create(sanitizedData);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to create project');
      }

      logger.info('ProjectService: Project created successfully', { id: result.data.id });
      return this.formatResponse(result, 'Project created successfully');

    } catch (error) {
      logger.error('ProjectService: Error creating project', error);
      throw this.formatError(error, 'Failed to create project');
    }
  }

  /**
   * Update existing project
   * @param {string} projectId - Project ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated project response
   */
  async updateProject(projectId, updateData) {
    try {
      logger.info('ProjectService: Updating project', { projectId });

      // Validate project ID
      if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID provided');
      }

      // Sanitize update data
      const sanitizedData = this.sanitizeProjectData(updateData, true);
      
      const result = await this.projectRepository.update(projectId, sanitizedData);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update project');
      }

      logger.info('ProjectService: Project updated successfully', { id: projectId });
      return this.formatResponse(result, 'Project updated successfully');

    } catch (error) {
      logger.error('ProjectService: Error updating project', error);
      throw this.formatError(error, 'Failed to update project');
    }
  }

  /**
   * Delete project
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteProject(projectId) {
    try {
      logger.info('ProjectService: Deleting project', { projectId });

      // Validate project ID
      if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID provided');
      }

      const result = await this.projectRepository.delete(projectId);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete project');
      }

      logger.info('ProjectService: Project deleted successfully', { id: projectId });
      return this.formatResponse(result, 'Project deleted successfully');

    } catch (error) {
      logger.error('ProjectService: Error deleting project', error);
      throw this.formatError(error, 'Failed to delete project');
    }
  }

  // Private helper methods

  /**
   * Sanitize query options
   * @param {Object} options - Raw options
   * @returns {Object} Sanitized options
   */
  sanitizeQueryOptions(options) {
    const sanitized = {};

    if (options.filters) {
      sanitized.filters = {};
      
      if (options.filters.type) {
        const validTypes = ['company', 'personal', 'freelance'];
        if (validTypes.includes(options.filters.type)) {
          sanitized.filters.type = options.filters.type;
        }
      }
      
      if (options.filters.status) {
        const validStatuses = ['completed', 'in_progress', 'planned', 'archived'];
        if (validStatuses.includes(options.filters.status)) {
          sanitized.filters.status = options.filters.status;
        }
      }
      
      if (typeof options.filters.featured === 'boolean') {
        sanitized.filters.featured = options.filters.featured;
      }
    }

    if (options.limit && Number.isInteger(options.limit) && options.limit > 0 && options.limit <= 100) {
      sanitized.limit = options.limit;
    }

    if (options.offset && Number.isInteger(options.offset) && options.offset >= 0) {
      sanitized.offset = options.offset;
    }

    return sanitized;
  }

  /**
   * Validate project data
   * @param {Object} data - Project data
   * @returns {Array} Validation errors
   */
  validateProjectData(data) {
    const errors = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!data.project_type) {
      errors.push('Project type is required');
    } else {
      const validTypes = ['company', 'personal', 'freelance'];
      if (!validTypes.includes(data.project_type)) {
        errors.push(`Project type must be one of: ${validTypes.join(', ')}`);
      }
    }

    if (data.status) {
      const validStatuses = ['completed', 'in_progress', 'planned', 'archived'];
      if (!validStatuses.includes(data.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
      }
    }

    return errors;
  }

  /**
   * Sanitize project data
   * @param {Object} data - Raw project data
   * @param {boolean} isUpdate - Whether this is an update operation
   * @returns {Object} Sanitized data
   */
  sanitizeProjectData(data, isUpdate = false) {
    const sanitized = {};

    if (data.title) {
      sanitized.title = data.title.trim().substring(0, 255);
    }

    if (data.description) {
      sanitized.description = data.description.trim().substring(0, 5000);
    }

    if (data.project_type) {
      sanitized.project_type = data.project_type;
    }

    if (data.status) {
      sanitized.status = data.status;
    }

    if (Array.isArray(data.technologies)) {
      sanitized.technologies = data.technologies.slice(0, 50); // Limit array size
    }

    if (Array.isArray(data.features)) {
      sanitized.features = data.features.slice(0, 50);
    }

    if (data.metrics && typeof data.metrics === 'object') {
      sanitized.metrics = data.metrics;
    }

    if (data.github_url && typeof data.github_url === 'string') {
      sanitized.github_url = data.github_url.trim().substring(0, 500);
    }

    if (data.live_url && typeof data.live_url === 'string') {
      sanitized.live_url = data.live_url.trim().substring(0, 500);
    }

    if (data.image_url && typeof data.image_url === 'string') {
      sanitized.image_url = data.image_url.trim().substring(0, 500);
    }

    if (typeof data.priority === 'number' && Number.isInteger(data.priority)) {
      sanitized.priority = Math.max(0, Math.min(100, data.priority));
    }

    if (typeof data.is_featured === 'boolean') {
      sanitized.is_featured = data.is_featured;
    }

    if (data.start_date) {
      sanitized.start_date = data.start_date;
    }

    if (data.end_date) {
      sanitized.end_date = data.end_date;
    }

    return sanitized;
  }

  /**
   * Format successful response
   * @param {Object} result - Repository result
   * @param {string} message - Success message
   * @returns {Object} Formatted response
   */
  formatResponse(result, message) {
    return {
      success: true,
      message,
      data: result.data,
      metadata: {
        ...result.metadata,
        service: 'ProjectService',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Format error response
   * @param {Error} error - Original error
   * @param {string} defaultMessage - Default error message
   * @returns {Object} Formatted error
   */
  formatError(error, defaultMessage) {
    return {
      success: false,
      error: defaultMessage,
      message: error.message || defaultMessage,
      service: 'ProjectService',
      timestamp: new Date().toISOString()
    };
  }
}

export default ProjectService;
