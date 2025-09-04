import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendEmail } from '../config/email.js';
import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

const router = express.Router();

// Rate limiting for contact form submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many contact form submissions',
    message: 'Please wait before submitting another message'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject must be less than 200 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters')
];

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Send contact form message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               subject:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Project Inquiry"
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *                 example: "Hi, I'm interested in discussing a project with you."
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Server error
 */
router.post('/', contactLimiter, contactValidation, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    logger.info('POST /contact - Sending email', { 
      email: email,
      subject: subject || 'Contact Form Submission'
    });

    const mailOptions = {
      to: process.env.EMAIL_USER, // Send to your email
      subject: subject || `Contact Form: Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent from: ${req.ip || 'Unknown IP'}</small></p>
        <p><small>User Agent: ${req.get('User-Agent') || 'Unknown'}</small></p>
        <p><small>Timestamp: ${new Date().toISOString()}</small></p>
      `
    };

    await sendEmail(mailOptions);
    
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    
    res.json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logRequest(req, res, duration);
    logger.logError(error, { route: 'POST /contact' });
    
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
});

export default router;