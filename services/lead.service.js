import LeadRepository from '../repositories/lead.repository.js';
import Lead from '../models/lead.model.js';

class UserService {
    constructor() {
        this.repository = new LeadRepository();
    }

    /**
     * Create a new user
     * @param {Object} userData - The user data
     * @returns {Promise<Object>} - The created user
     */
    async createUser(userData) {
        try {
            // Create and validate user model
            const user = new Lead(userData);
            const validation = user.validate();

            if (!validation.isValid) {
                const error = new Error('Invalid user data: ' + validation.errors.join(', '));
                error.status = 400;
                throw error;
            }

            return await this.repository.createUser(user.toJSON());
        } catch (error) {
            console.error('UserService - Error creating user:', error);
            throw error;
        }
    }

    /**
     * Get users with pagination
     * @param {number} offset - The starting index for pagination.
     * @param {number} limit - The number of users per page.
     * @returns {Promise<Object>} - An object containing the users array and total count.
     */
    async getUsersPaginated(offset, limit) {
        try {
            return await this.repository.getUsersPaginated(offset, limit);
        } catch (error) {
            console.error('UserService - Error getting paginated users:', error);
            throw error;
        }
    }


    /**
     * Get user by ID
     * @param {string} userId - The user ID
     * @returns {Promise<Object|null>} - User object or null if not found
     */
    async getUserById(userId) {
        try {
            return await this.repository.getUserById(userId);
        } catch (error) {
            console.error('UserService - Error getting user by ID:', error);
            throw error;
        }
    }

    /**
     * Get user by email
     * @param {string} email - The email
     * @returns {Promise<Object|null>} - User object or null if not found
     */
    async getUserByEmail(email) {
        try {
            return await this.repository.getUserByEmail(email);
        } catch (error) {
            console.error('UserService - Error getting user by email:', error);
            throw error;
        }
    }

    /**
     * Get all users by client ID
     * @param {string} clientId - The client ID
     * @returns {Promise<Array>} - Array of users
     */
    async getAllUsersByClientId(clientId) {
        try {
            return await this.repository.getAllUsersByClientId(clientId);
        } catch (error) {
            console.error('UserService - Error getting users by client ID:', error);
            throw error;
        }
    }

    async getAllUsersPaginationByClientId(clientId, page = 1, limit = 20, search = '', channel = '', status = '', sortBy = 'newest', chat_id = '') {
        try {
            return await this.repository.getAllUsersPaginationByClientId(
                clientId, page, limit, search, channel, status, sortBy, chat_id
            );
        } catch (error) {
            console.error('UserService - Error getting users by client ID:', error);
            throw error;
        }
    }


    /**
     * Get all users by status
     * @param {string} status - The status
     * @returns {Promise<Array>} - Array of users
     */
    async getAllUsersByStatus(status) {
        try {
            return await this.repository.getAllUsersByStatus(status);
        } catch (error) {
            console.error('UserService - Error getting users by status:', error);
            throw error;
        }
    }

    /**
     * Get all users by channel
     * @param {string} channel - The channel
     * @returns {Promise<Array>} - Array of users
     */
    async getAllUsersByChannel(channel) {
        try {
            return await this.repository.getAllUsersByChannel(channel);
        } catch (error) {
            console.error('UserService - Error getting users by channel:', error);
            throw error;
        }
    }

    /**
     * Update user by ID
     * @param {string} userId - The user ID
     * @param {Object} updateData - The data to update
     * @returns {Promise<Object|null>} - Updated user or null if not found
     */
    async updateUserById(userId, updateData) {
        try {
            // First check if user exists
            const existingUser = await this.repository.getUserById(userId);
            if (!existingUser) {
                const error = new Error(`User with ID ${userId} not found`);
                error.status = 404;
                throw error;
            }

            // Validate update data if it changes important fields like email
            if (updateData.email || updateData.status || updateData.channel) {
                // Create a merged model for validation
                const mergedData = { ...existingUser, ...updateData };
                const user = new Lead(mergedData);
                const validation = user.validate();

                if (!validation.isValid) {
                    const error = new Error('Invalid user data: ' + validation.errors.join(', '));
                    error.status = 400;
                    throw error;
                }
            }

            return await this.repository.updateUserById(userId, updateData);
        } catch (error) {
            console.error('UserService - Error updating user:', error);
            throw error;
        }
    }

    /**
     * Delete user by ID
     * @param {string} userId - The user ID
     * @returns {Promise<boolean>} - True if deleted successfully
     */
    async deleteUserById(userId) {
        try {
            // First check if user exists
            const existingUser = await this.repository.getUserById(userId);
            if (!existingUser) {
                const error = new Error(`User with ID ${userId} not found`);
                error.status = 404;
                throw error;
            }

            return await this.repository.deleteUserById(userId);
        } catch (error) {
            console.error('UserService - Error deleting user:', error);
            throw error;
        }
    }

    /**
     * Get user by custom field name and value
     * @param {string} fieldName - The name of the custom field
     * @param {string} fieldValue - The value of the custom field
     * @returns {Promise<Object|null>} - User object or null if not found
     */
    async getUserByCustomField(fieldName, fieldValue) {
        try {
            if (!fieldName) {
                const error = new Error('Field name is required');
                error.status = 400;
                throw error;
            }

            return await this.repository.getUserByCustomField(fieldName, fieldValue);
        } catch (error) {
            console.error('UserService - Error getting user by custom field:', error);
            throw error;
        }
    }

    /**
     * Get all users by custom field name and value
     * @param {string} fieldName - The name of the custom field
     * @param {string} fieldValue - The value of the custom field
     * @returns {Promise<Array>} - Array of users
     */
    async getAllUsersByCustomField(fieldName, fieldValue) {
        try {
            if (!fieldName) {
                const error = new Error('Field name is required');
                error.status = 400;
                throw error;
            }

            return await this.repository.getAllUsersByCustomField(fieldName, fieldValue);
        } catch (error) {
            console.error('UserService - Error getting users by custom field:', error);
            throw error;
        }
    }

    /**
     * Get all users that have a specific custom field name (regardless of value)
     * @param {string} fieldName - The name of the custom field
     * @returns {Promise<Array>} - Array of users
     */
    async getAllUsersByCustomFieldName(fieldName) {
        try {
            if (!fieldName) {
                const error = new Error('Field name is required');
                error.status = 400;
                throw error;
            }

            return await this.repository.getAllUsersByCustomFieldName(fieldName);
        } catch (error) {
            console.error('UserService - Error getting users by custom field name:', error);
            throw error;
        }
    }

    /**
     * Find users by any custom field criteria
     * @param {Object} criteria - Object with field name as key and field value as value
     * @returns {Promise<Array>} - Array of users matching any of the criteria
     */
    async findUsersByCustomFields(criteria) {
        try {
            if (!criteria || typeof criteria !== 'object' || Object.keys(criteria).length === 0) {
                const error = new Error('Valid criteria object is required');
                error.status = 400;
                throw error;
            }

            // Get all users
            const allUsers = await this.repository.getAllUsers();

            // Filter users that match any of the criteria
            return allUsers.filter(user => {
                if (!user.custom_fields || !Array.isArray(user.custom_fields)) {
                    return false;
                }

                // Check if any of the user's custom fields match any of the criteria
                return Object.entries(criteria).some(([criteriaName, criteriaValue]) => {
                    const formattedCriteriaName = criteriaName.replace(/\s+/g, '_');

                    return user.custom_fields.some(field =>
                        field.name === formattedCriteriaName &&
                        (criteriaValue === undefined || field.value === criteriaValue)
                    );
                });
            });
        } catch (error) {
            console.error('UserService - Error finding users by custom fields:', error);
            throw error;
        }
    }
}

export default UserService;
