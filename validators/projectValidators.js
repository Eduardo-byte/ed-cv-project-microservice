import { body } from 'express-validator';

export const projectValidators = {
  createProject: [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters')
      .trim(),
    
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 1, max: 5000 })
      .withMessage('Description must be between 1 and 5000 characters')
      .trim(),
    
    body('project_type')
      .notEmpty()
      .withMessage('Project type is required')
      .isIn(['company', 'personal', 'freelance'])
      .withMessage('Project type must be one of: company, personal, freelance'),
    
    body('status')
      .optional()
      .isIn(['completed', 'in_progress', 'planned', 'archived'])
      .withMessage('Status must be one of: completed, in_progress, planned, archived'),
    
    body('technologies')
      .optional()
      .isArray()
      .withMessage('Technologies must be an array')
      .custom((value) => {
        if (value && value.length > 50) {
          throw new Error('Technologies array cannot have more than 50 items');
        }
        return true;
      }),
    
    body('features')
      .optional()
      .isArray()
      .withMessage('Features must be an array')
      .custom((value) => {
        if (value && value.length > 50) {
          throw new Error('Features array cannot have more than 50 items');
        }
        return true;
      }),
    
    body('metrics')
      .optional()
      .isObject()
      .withMessage('Metrics must be an object'),
    
    body('start_date')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO 8601 date'),
    
    body('end_date')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO 8601 date'),
    
    body('github_url')
      .optional()
      .isURL()
      .withMessage('GitHub URL must be a valid URL')
      .isLength({ max: 500 })
      .withMessage('GitHub URL cannot exceed 500 characters'),
    
    body('live_url')
      .optional()
      .isURL()
      .withMessage('Live URL must be a valid URL')
      .isLength({ max: 500 })
      .withMessage('Live URL cannot exceed 500 characters'),
    
    body('image_url')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL')
      .isLength({ max: 500 })
      .withMessage('Image URL cannot exceed 500 characters'),
    
    body('priority')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Priority must be an integer between 0 and 100'),
    
    body('is_featured')
      .optional()
      .isBoolean()
      .withMessage('is_featured must be a boolean')
  ],

  updateProject: [
    body('title')
      .optional()
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters')
      .trim(),
    
    body('description')
      .optional()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Description must be between 1 and 5000 characters')
      .trim(),
    
    body('project_type')
      .optional()
      .isIn(['company', 'personal', 'freelance'])
      .withMessage('Project type must be one of: company, personal, freelance'),
    
    body('status')
      .optional()
      .isIn(['completed', 'in_progress', 'planned', 'archived'])
      .withMessage('Status must be one of: completed, in_progress, planned, archived'),
    
    body('technologies')
      .optional()
      .isArray()
      .withMessage('Technologies must be an array')
      .custom((value) => {
        if (value && value.length > 50) {
          throw new Error('Technologies array cannot have more than 50 items');
        }
        return true;
      }),
    
    body('features')
      .optional()
      .isArray()
      .withMessage('Features must be an array')
      .custom((value) => {
        if (value && value.length > 50) {
          throw new Error('Features array cannot have more than 50 items');
        }
        return true;
      }),
    
    body('metrics')
      .optional()
      .isObject()
      .withMessage('Metrics must be an object'),
    
    body('start_date')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO 8601 date'),
    
    body('end_date')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO 8601 date'),
    
    body('github_url')
      .optional()
      .isURL()
      .withMessage('GitHub URL must be a valid URL')
      .isLength({ max: 500 })
      .withMessage('GitHub URL cannot exceed 500 characters'),
    
    body('live_url')
      .optional()
      .isURL()
      .withMessage('Live URL must be a valid URL')
      .isLength({ max: 500 })
      .withMessage('Live URL cannot exceed 500 characters'),
    
    body('image_url')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL')
      .isLength({ max: 500 })
      .withMessage('Image URL cannot exceed 500 characters'),
    
    body('priority')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Priority must be an integer between 0 and 100'),
    
    body('is_featured')
      .optional()
      .isBoolean()
      .withMessage('is_featured must be a boolean')
  ]
};
