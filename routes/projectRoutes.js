import express from 'express';
import ProjectService from '../services/ProjectService.js';
import { validationResult } from 'express-validator';
import { projectValidators } from '../validators/projectValidators.js';
import logger from '../config/logger.js';

const router = express.Router();
const projectService = new ProjectService();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique project identifier
 *         title:
 *           type: string
 *           description: Project title
 *           example: "E-commerce Platform"
 *         description:
 *           type: string
 *           description: Project description
 *         project_type:
 *           type: string
 *           enum: [company, personal, freelance]
 *           description: Type of project
 *         status:
 *           type: string
 *           enum: [completed, in_progress, planned, archived]
 *           description: Project status
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           description: Technologies used
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Project features
 *         metrics:
 *           type: object
 *           description: Project metrics
 *         start_date:
 *           type: string
 *           format: date
 *           description: Project start date
 *         end_date:
 *           type: string
 *           format: date
 *           description: Project end date
 *         github_url:
 *           type: string
 *           format: uri
 *           description: GitHub repository URL
 *         live_url:
 *           type: string
 *           format: uri
 *           description: Live project URL
 *         image_url:
 *           type: string
 *           format: uri
 *           description: Project image URL
 *         priority:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Project priority
 *         is_featured:
 *           type: boolean
 *           description: Whether project is featured
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     ProjectStats:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         completed:
 *           type: integer
 *         inProgress:
 *           type: integer
 *         planned:
 *           type: integer
 *         archived:
 *           type: integer
 *         featured:
 *           type: integer
 *         company:
 *           type: integer
 *         personal:
 *           type: integer
 *         freelance:
 *           type: integer
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [company, personal, freelance]
 *         description: Filter by project type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, in_progress, planned, archived]
 *         description: Filter by project status
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured projects only
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of projects to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of projects to skip
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 metadata:
 *                   type: object
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  const startTime = Date.now();
  console.log("GET /api/v1/projects");
  try {
    logger.info('GET /api/v1/projects', { query: req.query });

    const options = {
      filters: {},
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined
    };

    if (req.query.type) options.filters.type = req.query.type;
    if (req.query.status) options.filters.status = req.query.status;
    if (req.query.featured !== undefined) options.filters.featured = req.query.featured === 'true';

    const result = await projectService.getAllProjects(options);
    
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    
    res.json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'GET /api/v1/projects' });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /projects/search:
 *   get:
 *     summary: Search projects by keyword
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search keyword
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [company, personal, freelance]
 *         description: Filter by project type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of results to return
 *     responses:
 *       200:
 *         description: Search completed successfully
 *       400:
 *         description: Invalid search parameters
 *       500:
 *         description: Server error
 */
router.get('/search', async (req, res) => {
  const startTime = Date.now();
  
  try {
    logger.info('GET /api/v1/projects/search', { query: req.query });

    if (!req.query.q) {
      return res.status(400).json({
        success: false,
        error: 'Search keyword is required',
        message: 'Please provide a search keyword using the "q" parameter'
      });
    }

    const options = {
      filters: {},
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    };

    if (req.query.type) options.filters.type = req.query.type;

    const result = await projectService.searchProjects(req.query.q, options);
    
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    
    res.json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'GET /api/v1/projects/search' });
    
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /projects/stats:
 *   get:
 *     summary: Get project statistics
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProjectStats'
 *       500:
 *         description: Server error
 */
router.get('/stats', async (req, res) => {
  const startTime = Date.now();
  
  try {
    logger.info('GET /api/v1/projects/stats');

    const result = await projectService.getProjectStats();
    
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    
    res.json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'GET /api/v1/projects/stats' });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /projects/featured:
 *   get:
 *     summary: Get featured projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of featured projects to return
 *     responses:
 *       200:
 *         description: Featured projects retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/featured', async (req, res) => {
  const startTime = Date.now();
  
  try {
    logger.info('GET /api/v1/projects/featured', { query: req.query });

    const options = {
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    };

    const result = await projectService.getFeaturedProjects(options);
    
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    
    res.json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'GET /api/v1/projects/featured' });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured projects',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /projects/type/{type}:
 *   get:
 *     summary: Get projects by type
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [company, personal, freelance]
 *         description: Project type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of projects to return
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       400:
 *         description: Invalid project type
 *       500:
 *         description: Server error
 */
router.get('/type/:type', async (req, res) => {
  const startTime = Date.now();
  
  try {
    logger.info('GET /api/v1/projects/type/:type', { 
      params: req.params, 
      query: req.query 
    });

    const options = {
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    };

    const result = await projectService.getProjectsByType(req.params.type, options);
    
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    
    res.json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'GET /api/v1/projects/type/:type' });
    
    const statusCode = error.message.includes('Invalid project type') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: statusCode === 400 ? 'Invalid project type' : 'Failed to fetch projects',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  const startTime = Date.now();
  
  try {
    logger.info('GET /api/v1/projects/:id', { params: req.params });

    const result = await projectService.getProjectById(req.params.id);
    
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    
    res.json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'GET /api/v1/projects/:id' });
    
    const statusCode = error.message.includes('not found') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: statusCode === 404 ? 'Project not found' : 'Failed to fetch project',
      message: error.message
    });
  }
});

// POST routes for admin functions (if needed in the future)
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create new project (Admin)
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - project_type
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               project_type:
 *                 type: string
 *                 enum: [company, personal, freelance]
 *               status:
 *                 type: string
 *                 enum: [completed, in_progress, planned, archived]
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               github_url:
 *                 type: string
 *               live_url:
 *                 type: string
 *               is_featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', projectValidators.createProject, async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    logger.info('POST /api/v1/projects', { body: req.body });

    const result = await projectService.createProject(req.body);
    
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    
    res.status(201).json(result);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'POST /api/v1/projects' });
    
    const statusCode = error.message.includes('Validation') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: statusCode === 400 ? 'Validation error' : 'Failed to create project',
      message: error.message
    });
  }
});

export default router;
