import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from './logger.js';

// Load environment variables first
dotenv.config();

// Email configuration
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

if (!emailConfig.auth.user || !emailConfig.auth.pass) {
  logger.error('Missing email configuration. Check EMAIL_USER and EMAIL_PASS environment variables.');
  throw new Error('Email configuration error');
}

// Create email transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    logger.info('Verifying email configuration...');
    
    await transporter.verify();
    
    logger.info('✅ Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('❌ Email configuration verification failed:', error);
    return false;
  }
};

// Send email helper
export const sendEmail = async (mailOptions) => {
  try {
    logger.info('Sending email...', { 
      to: mailOptions.to, 
      subject: mailOptions.subject 
    });

    const info = await transporter.sendMail({
      from: emailConfig.auth.user,
      ...mailOptions
    });

    logger.info('✅ Email sent successfully', { 
      messageId: info.messageId,
      to: mailOptions.to 
    });

    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };

  } catch (error) {
    logger.error('❌ Failed to send email:', error);
    
    throw {
      success: false,
      error: 'Failed to send email',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Email health check
export const emailHealthCheck = async () => {
  try {
    await transporter.verify();
    return { healthy: true };
  } catch (error) {
    return { 
      healthy: false, 
      error: error.message 
    };
  }
};

export default transporter;
