import express from 'express';
import LeadService from '../services/lead.service.js';
import Lead from '../models/lead.model.js';

const router = express.Router();
const userService = new LeadService();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user
 *           example: 3fbfc827-fe5d-4f70-bf5d-3b707667ca61
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: user@example.com
 *         first_name:
 *           type: string
 *           description: The user's first name
 *           example: John
 *         last_name:
 *           type: string
 *           description: The user's last name
 *           example: Doe
 *         phone_number:
 *           type: string
 *           description: The user's phone number
 *           example: "+1234567890"
 *         registration_date:
 *           type: string
 *           format: date-time
 *           description: The registration timestamp
 *           example: '2025-03-20T15:29:54.492Z'
 *         client_id:
 *           type: string
 *           format: uuid
 *           description: The client ID
 *           example: a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 *           example: '2025-03-20T15:29:54.492Z'
 *         status:
 *           type: string
 *           description: The user's status
 *           enum: [new, in-progress, qualified, negotiation, lost]
 *           example: new
 *         channel:
 *           type: string
 *           description: The channel the user came from
 *           enum: [website, telegram, facebook, instagram, twitter]
 *           example: website
 *         avatar_img:
 *           type: string
 *           description: URL to the user's avatar image
 *           example: https://example.com/avatars/user123.jpg
 *         custom_fields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Unique identifier for the custom field
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Creation timestamp
 *               updated_at:
 *                 type: string
 *                 format: date-time
 *                 description: Update timestamp
 *               type:
 *                 type: string
 *                 description: Type of the custom field
 *               name:
 *                 type: string
 *                 description: Name of the custom field (spaces replaced with underscores)
 *               value:
 *                 type: string
 *                 description: Value of the custom field
 *               description:
 *                 type: string
 *                 description: Description of the custom field
 *           description: Array of custom fields for the user
 *           example:
 *             - id: "3fbfc827-fe5d-4f70-bf5d-3b707667ca61"
 *               created_at: "2025-03-20T15:29:54.492Z"
 *               updated_at: "2025-03-20T15:29:54.492Z"
 *               type: "text"
 *               name: "reference_lead_id"
 *               value: "123456"
 *               description: "Reference ID from the lead system"
 *     
 *     UserInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: user@example.com
 *         first_name:
 *           type: string
 *           description: The user's first name
 *           example: John
 *         last_name:
 *           type: string
 *           description: The user's last name
 *           example: Doe
 *         phone_number:
 *           type: string
 *           description: The user's phone number
 *           example: "+1234567890"
 *         client_id:
 *           type: string
 *           format: uuid
 *           description: The client ID
 *           example: a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p
 *         status:
 *           type: string
 *           description: The user's status
 *           enum: [new, in-progress, qualified, negotiation, lost]
 *           example: new
 *         channel:
 *           type: string
 *           description: The channel the user came from
 *           enum: [website, telegram, facebook, instagram, twitter]
 *           example: website
 *         avatar_img:
 *           type: string
 *           description: URL to the user's avatar image
 *           example: https://example.com/avatars/user123.jpg
 *         custom_fields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the custom field
 *               name:
 *                 type: string
 *                 description: Name of the custom field (spaces will be replaced with underscores)
 *               value:
 *                 type: string
 *                 description: Value of the custom field
 *               description:
 *                 type: string
 *                 description: Description of the custom field
 *           description: Array of custom fields for the user
 *           example:
 *             - type: "text"
 *               name: "reference_lead_id"
 *               value: "123456"
 *               description: "Reference ID from the lead system"
 *     
 *     UserUpdateInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: updated@example.com
 *         first_name:
 *           type: string
 *           description: The user's first name
 *           example: Updated
 *         last_name:
 *           type: string
 *           description: The user's last name
 *           example: Name
 *         phone_number:
 *           type: string
 *           description: The user's phone number
 *           example: "+1987654321"
 *         client_id:
 *           type: string
 *           format: uuid
 *           description: The client ID
 *           example: a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p
 *         status:
 *           type: string
 *           description: The user's status
 *           enum: [new, in-progress, qualified, negotiation, lost]
 *           example: qualified
 *         channel:
 *           type: string
 *           description: The channel the user came from
 *           enum: [website, telegram, facebook, instagram, twitter]
 *           example: telegram
 *         avatar_img:
 *           type: string
 *           description: URL to the user's avatar image
 *           example: https://example.com/avatars/updated.jpg
 *         custom_fields:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the custom field
 *               name:
 *                 type: string
 *                 description: Name of the custom field (spaces will be replaced with underscores)
 *               value:
 *                 type: string
 *                 description: Value of the custom field
 *               description:
 *                 type: string
 *                 description: Description of the custom field
 *           description: Array of custom fields for the user
 *     
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Error status
 *           example: error
 *         code:
 *           type: integer
 *           description: HTTP status code
 *           example: 400
 *         message:
 *           type: string
 *           description: Error message
 *           example: Invalid user data
 */

/**
 * @swagger
 * /api/v2/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', async (req, res) => {
    try {
        const userData = req.body;

        const createdUser = await userService.createUser(userData);

        return res.status(201).json(createdUser);
    } catch (error) {
        console.error('Error creating user:', error);

        // Check if it's a validation error
        if (error.status === 400) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to create user',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users per page (default is 10)
 *     responses:
 *       200:
 *         description: List of users with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
    try {
        // Get pagination query parameters, defaulting to page=1 and limit=10
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // Get paginated users from the service layer
        const { users, total } = await userService.getUsersPaginated(offset, limit);

        if (!users || users.length === 0) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: 'No users found'
            });
        }

        return res.status(200).json({
            total,
            page,
            limit,
            users
        });
    } catch (error) {
        console.error('Error getting users:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get users',
            details: error.message
        });
    }
});


/**
 * @swagger
 * /api/v2/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `User with ID ${id} not found`
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get user by ID',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's email
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `User with email ${email} not found`
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user by email:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get user by email',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/client/{clientId}:
 *   get:
 *     summary: Get all users by client ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/client/:clientId', async (req, res) => {
    try {
        const { clientId } = req.params;
        const users = await userService.getAllUsersByClientId(clientId);

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users by client ID:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get users by client ID',
            details: error.message
        });
    }
});


/**
 * @swagger
 * /api/v2/users/pagination/client/{clientId}:
 *   get:
 *     summary: Get all users by client ID (paginated + filters)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         required: false
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search by name/email/company
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by channel
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         required: false
 *         description: Sort (newest/oldest/name)
 *       - in: query
 *         name: chat_id
 *         schema:
 *           type: string
 *         required: false
 *         description: chat_id
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get('/pagination/client/:clientId', async (req, res) => {
    try {
        console.log("im here")
        const { clientId } = req.params;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const search = req.query.search || '';
        const channel = req.query.channel || '';
        const status = req.query.status || '';
        const sortBy = req.query.sortBy || 'newest';
        const chat_id = req.query.chat_id || '';



        const response = await userService.getAllUsersPaginationByClientId(
            clientId, page, limit, search, channel, status, sortBy, chat_id
        );

        return res.status(200).json({
            messages: response.messages,
            totalPages: response.totalPages,
            page: response.page,
            limit: response.limit,
        });
    } catch (error) {
        console.error('Error getting users by client ID:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get users by client ID',
            details: error.message
        });
    }
});




/**
 * @swagger
 * /api/v2/users/status/{status}:
 *   get:
 *     summary: Get all users by status
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, in-progress, qualified, negotiation, lost]
 *         required: true
 *         description: The user status
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;

        // Validate status
        if (!['new', 'in-progress', 'qualified', 'negotiation', 'lost'].includes(status)) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Invalid status parameter. Must be one of: active, inactive, pending, blocked'
            });
        }

        const users = await userService.getAllUsersByStatus(status);

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users by status:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get users by status',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/channel/{channel}:
 *   get:
 *     summary: Get all users by channel
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: channel
 *         schema:
 *           type: string
 *           enum: [website, telegram, facebook, instagram, twitter]
 *         required: true
 *         description: The user channel
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/channel/:channel', async (req, res) => {
    try {
        const { channel } = req.params;

        // Validate channel
        if (!['website', 'telegram', 'facebook', 'instagram', 'twitter'].includes(channel)) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Invalid channel parameter. Must be one of: web, mobile, facebook, instagram, widget, api'
            });
        }

        const users = await userService.getAllUsersByChannel(channel);

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users by channel:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get users by channel',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedUser = await userService.updateUserById(id, updateData);

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);

        // Check if it's a not found error
        if (error.status === 404) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: error.message
            });
        }

        // Check if it's a validation error
        if (error.status === 400) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to update user',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/delete:
 *   delete:
 *     summary: Delete one or more users by their IDs
 *     tags: [Users]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               user_ids: ["3fbfc827-fe5d-4f70-bf5d-3b707667ca61"]
 *     parameters:
 *       - in: query
 *         name: user_ids
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: false
 *         description: An array (or single string) of user IDs
 *     responses:
 *       200:
 *         description: Users deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Users deleted successfully
 *       400:
 *         description: No user IDs provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: One or more users not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.delete('/delete', async (req, res) => {
    try {
        let userIds = req.query.user_ids || req.body.user_ids;
        if (!userIds) {
            return res.status(400).json({ message: "No user IDs provided" });
        }

        // Wrap in array if not already an array
        if (!Array.isArray(userIds)) {
            userIds = [userIds];
        }

        // Process each user ID
        await Promise.all(userIds.map(id => userService.deleteUserById(id)));

        return res.status(200).json({
            status: 'success',
            message: 'Users deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);

        // Check if it's a not found error
        if (error.status === 404) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to delete user',
            details: error.message
        });
    }
});


/**
 * @swagger
 * components:
 *   schemas:
 *     CustomField:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the custom field (auto-generated)
 *           example: 3fbfc827-fe5d-4f70-bf5d-3b707667ca61
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp (auto-generated)
 *           example: '2025-03-20T15:29:54.492Z'
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp (auto-generated)
 *           example: '2025-03-20T15:29:54.492Z'
 *         type:
 *           type: string
 *           description: The type of the custom field
 *           example: text
 *         name:
 *           type: string
 *           description: The name of the custom field (spaces will be replaced with underscores)
 *           example: reference_lead_id
 *         value:
 *           type: string
 *           description: The value of the custom field
 *           example: "123456"
 *         description:
 *           type: string
 *           description: The description of the custom field
 *           example: Reference ID from the lead system
 *     
 *     CustomFieldInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         type:
 *           type: string
 *           description: The type of the custom field
 *           example: text
 *         name:
 *           type: string
 *           description: The name of the custom field (spaces will be replaced with underscores)
 *           example: reference lead id
 *         value:
 *           type: string
 *           description: The value of the custom field
 *           example: "123456"
 *         description:
 *           type: string
 *           description: The description of the custom field
 *           example: Reference ID from the lead system
 */

/**
 * @swagger
 * /api/v2/users/{id}/custom-fields:
 *   get:
 *     summary: Get all custom fields for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of user's custom fields
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomField'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/custom-fields', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `User with ID ${id} not found`
            });
        }

        return res.status(200).json(user.custom_fields || []);
    } catch (error) {
        console.error('Error getting user custom fields:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get user custom fields',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/{id}/custom-fields:
 *   post:
 *     summary: Add a custom field to a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomFieldInput'
 *     responses:
 *       201:
 *         description: The created custom field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomField'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/custom-fields', async (req, res) => {
    try {
        console.log("inside /:id/custom-fields");
        const { id } = req.params;
        const fieldData = req.body;
        // Validate required fields
        if (!fieldData.name) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'field name is required'
            });
        }

        // Get user
        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `User with ID ${id} not found`
            });
        }

        // Use the model's method to add a custom field
        const userModel = new Lead(user);
        const customField = userModel.addCustomField(fieldData);

        // Update the user with the new custom fields
        await userService.updateUserById(id, { custom_fields: userModel.custom_fields });

        return res.status(201).json(customField);
    } catch (error) {
        console.error('Error adding custom field:', error);

        // Check if it's a validation error
        if (error.status === 400) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to add custom field',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/{userId}/custom-fields/{fieldId}:
 *   get:
 *     summary: Get a specific custom field for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: fieldId
 *         schema:
 *           type: string
 *         required: true
 *         description: The custom field ID
 *     responses:
 *       200:
 *         description: The custom field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomField'
 *       404:
 *         description: User or custom field not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:userId/custom-fields/:fieldId', async (req, res) => {
    try {
        const { userId, fieldId } = req.params;

        // Get user
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `User with ID ${userId} not found`
            });
        }

        // Use the model's method to get a custom field
        const userModel = new Lead(user);
        const customField = userModel.getCustomFieldById(fieldId);

        if (!customField) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `Custom field with ID ${fieldId} not found`
            });
        }

        return res.status(200).json(customField);
    } catch (error) {
        console.error('Error getting custom field:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get custom field',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/{userId}/custom-fields/{fieldId}:
 *   put:
 *     summary: Update a custom field for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: fieldId
 *         schema:
 *           type: string
 *         required: true
 *         description: The custom field ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomFieldInput'
 *     responses:
 *       200:
 *         description: The updated custom field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomField'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User or custom field not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:userId/custom-fields/:fieldId', async (req, res) => {
    try {
        const { userId, fieldId } = req.params;
        const updateData = req.body;

        // Get user
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `User with ID ${userId} not found`
            });
        }

        // Use the model's method to update a custom field
        const userModel = new Lead(user);
        const updatedField = userModel.updateCustomField(fieldId, updateData);

        if (!updatedField) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `Custom field with ID ${fieldId} not found`
            });
        }

        // Update the user with the updated custom fields
        await userService.updateUserById(userId, { custom_fields: userModel.custom_fields });

        return res.status(200).json(updatedField);
    } catch (error) {
        console.error('Error updating custom field:', error);

        // Check if it's a validation error
        if (error.status === 400) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to update custom field',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/custom-field/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Get user by custom field name and value
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: fieldName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the custom field
 *       - in: path
 *         name: fieldValue
 *         schema:
 *           type: string
 *         required: true
 *         description: The value of the custom field
 *     responses:
 *       200:
 *         description: The user with the specified custom field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/custom-field/:fieldName/:fieldValue', async (req, res) => {
    try {
        const { fieldName, fieldValue } = req.params;

        const user = await userService.getUserByCustomField(fieldName, fieldValue);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `User with custom field ${fieldName}=${fieldValue} not found`
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user by custom field:', error);

        // Check if it's a validation error
        if (error.status === 400) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get user by custom field',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/custom-fields/{fieldName}/{fieldValue}:
 *   get:
 *     summary: Get all users by custom field name and value
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: fieldName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the custom field
 *       - in: path
 *         name: fieldValue
 *         schema:
 *           type: string
 *         required: true
 *         description: The value of the custom field
 *     responses:
 *       200:
 *         description: List of users with the specified custom field
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/custom-fields/:fieldName/:fieldValue', async (req, res) => {
    try {
        const { fieldName, fieldValue } = req.params;
        const users = await userService.getAllUsersByCustomField(fieldName, fieldValue);

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users by custom field:', error);

        // Check if it's a validation error
        if (error.status === 400) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get users by custom field',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/get-custom-by-name/{fieldName}:
 *   get:
 *     summary: Get all users that have a specific custom field name
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: fieldName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the custom field
 *     responses:
 *       200:
 *         description: List of users with the specified custom field name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/get-custom-by-name/:fieldName', async (req, res) => {
    try {
        const { fieldName } = req.params;
        const users = await userService.getAllUsersByCustomFieldName(fieldName);

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users by custom field name:', error);

        // Check if it's a validation error
        if (error.status === 400) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to get users by custom field name',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/fetch-custom-fields:
 *   post:
 *     summary: Find users by any custom field criteria
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Object with field names as keys and field values as values
 *             example:
 *               reference_lead_id: "123456"
 *               source: "facebook"
 *     responses:
 *       200:
 *         description: List of users matching any of the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/fetch-custom-fields', async (req, res) => {
    try {
        console.log("inside /search/custom-fields");
        const criteria = req.body;

        if (!criteria || typeof criteria !== 'object' || Object.keys(criteria).length === 0) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Valid criteria object is required'
            });
        }

        const users = await userService.findUsersByCustomFields(criteria);

        return res.status(200).json(users);
    } catch (error) {
        console.error('Error finding users by custom fields:', error);

        // Check if it's a validation error
        if (error.status === 400) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to find users by custom fields',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/v2/users/{userId}/custom-fields/{fieldId}:
 *   delete:
 *     summary: Delete a custom field for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: fieldId
 *         schema:
 *           type: string
 *         required: true
 *         description: The custom field ID
 *     responses:
 *       200:
 *         description: Custom field deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Custom field deleted successfully
 *       404:
 *         description: User or custom field not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:userId/custom-fields/:fieldId', async (req, res) => {
    try {
        const { userId, fieldId } = req.params;

        // Get user
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `User with ID ${userId} not found`
            });
        }

        // Use the model's method to remove a custom field
        const userModel = new Lead(user);
        const removed = userModel.removeCustomField(fieldId);

        if (!removed) {
            return res.status(404).json({
                status: 'error',
                code: 404,
                message: `Custom field with ID ${fieldId} not found`
            });
        }

        // Update the user with the updated custom fields
        await userService.updateUserById(userId, { custom_fields: userModel.custom_fields });

        return res.status(200).json({
            status: 'success',
            message: 'Custom field deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting custom field:', error);
        return res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Failed to delete custom field',
            details: error.message
        });
    }
});

export default router;
