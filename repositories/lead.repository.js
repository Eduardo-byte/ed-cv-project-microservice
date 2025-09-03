import supabase from '../db/supabase.js'

class LeadRepository {
    constructor() {
        this.tableName = 'users';
    }

    /**
     * Create a new user
     * @param {Object} userData - The user data to insert
     * @returns {Promise<Object>} - The created user object
     */
    async createUser(userData) {
        try {
            // Add timestamps if not provided
            const now = new Date().toISOString();

            const dataToInsert = {
                ...userData,
                registration_date: userData.registration_date || now,
                updated_at: userData.updated_at || now
            };

            const { data, error } = await supabase
                .from(this.tableName)
                .insert(dataToInsert)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    /**
    * Get all users by status
    * @returns {Promise<Array>} - Array of user objects
    */
    async getAllUsers() {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting users by status:', error);
            throw error;
        }
    }

    /**
     * Get user by ID
     * @param {string} userId - The user ID to find
     * @returns {Promise<Object|null>} - User object or null if not found
     */
    async getUserById(userId) {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // PGRST116 is the error code for "no rows returned"
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    }

    /**
     * Get user by email
     * @param {string} email - The email to find
     * @returns {Promise<Object|null>} - User object or null if not found
     */
    async getUserByEmail(email) {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // PGRST116 is the error code for "no rows returned"
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }
    }

    /**
     * Get all users by client ID
     * @param {string} clientId - The client ID to filter by
     * @returns {Promise<Array>} - Array of user objects
     */
    async getAllUsersByClientId(clientId) {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('client_id', clientId);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting users by client ID:', error);
            throw error;
        }
    }

    async getAllUsersPaginationByClientId(
        clientId, page = 1, limit = 20,
        search = '', channel = '', status = '',
        sortBy = 'newest', chat_id = ''
    ) {
        try {
            const offset = (page - 1) * limit;
            const url = 'https://sasrqcnrvbodywiqeueb.supabase.co/graphql/v1';
            const key = process.env.SUPABASE_KEY;

            const paginationQuery = `
      query MessagesWithUserByChatId($chat_id: UUID!, $limit: Int!, $offset: Int!) {
        messagesCollection(
          filter: { chat_id: { eq: $chat_id } }
          first: $limit
          offset: $offset
        ) {
          edges {
            node {
              message_id
              user_id
              chat_id
              content
              created_at
              users {
                user_id
                first_name
                last_name
                email
                phone_number
                registration_date
                status
                channel
                avatar_img
              }
            }
          }
        }
      }`;

            const countQuery = `
      query UniqueUserCount($chat_id: UUID!) {
        count_unique_users(chat_uuid: $chat_id)
      }`;

            // Fetch both in parallel
            const [pagRes, countRes] = await Promise.all([
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'apikey': key,
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: paginationQuery,
                        variables: { chat_id, limit, offset }
                    })
                }),
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'apikey': key,
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: countQuery,
                        variables: { chat_id }
                    })
                }),
            ]);

            const pagJson = await pagRes.json();
            const countJson = await countRes.json();

            if (pagJson.errors) throw new Error(JSON.stringify(pagJson.errors));
            if (countJson.errors) throw new Error(JSON.stringify(countJson.errors));

            const messages = pagJson.data.messagesCollection.edges.map(e => e.node);
            const totalUniqueUsers = countJson.data.count_unique_users;

            return {
                messages,
                totalUniqueUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUniqueUsers / limit)
            };
        } catch (error) {
            console.error('Error in getAllUsersPaginationByClientId:', error);
            throw error;
        }
    }


    /**
     * Get all users by status
     * @param {string} status - The status to filter by
     * @returns {Promise<Array>} - Array of user objects
     */
    async getAllUsersByStatus(status) {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('status', status);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting users by status:', error);
            throw error;
        }
    }

    /**
     * Get all users by channel
     * @param {string} channel - The channel to filter by
     * @returns {Promise<Array>} - Array of user objects
     */
    async getAllUsersByChannel(channel) {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('channel', channel);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting users by channel:', error);
            throw error;
        }
    }

    /**
     * Get paginated users
     * @param {number} offset - Starting index for pagination.
     * @param {number} limit - Number of users per page.
     * @returns {Promise<Object>} - Object containing users array and total count.
     */
    async getUsersPaginated(offset, limit) {
        try {
            // Using Supabase select with range for pagination and exact count
            const { data, error, count } = await supabase
                .from(this.tableName)
                .select('*', { count: 'exact' })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            return {
                users: data || [],
                total: count || 0
            };
        } catch (error) {
            console.error('UserRepository - Error fetching paginated users:', error);
            throw error;
        }
    }

    /**
     * Update user by ID
     * @param {string} userId - The user ID to update
     * @param {Object} updateData - The data to update
     * @returns {Promise<Object|null>} - Updated user object or null if not found
     */
    async updateUserById(userId, updateData) {
        try {
            // Add updated_at timestamp
            const dataToUpdate = {
                ...updateData,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from(this.tableName)
                .update(dataToUpdate)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating user by ID:', error);
            throw error;
        }
    }

    /**
     * Delete user by ID
     * @param {string} userId - The user ID to delete
     * @returns {Promise<boolean>} - True if deleted successfully
     */
    async deleteUserById(userId) {
        try {
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('user_id', userId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting user by ID:', error);
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
            // Format the field name to ensure consistency (replace spaces with underscores)
            const formattedFieldName = fieldName.replace(/\s+/g, '_');

            const criteria = JSON.stringify([{ name: formattedFieldName, value: fieldValue }]);

            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .filter('custom_fields', 'cs', criteria);

            // console.log(data);
            if (error) {
                if (error.code === 'PGRST116') {
                    // PGRST116 is the error code for "no rows returned"
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error getting user by custom field:', error);
            throw error;
        }
    }

    /**
     * Get all users by custom field name and value
     * @param {string} fieldName - The name of the custom field
     * @param {string} fieldValue - The value of the custom field
     * @returns {Promise<Array>} - Array of user objects
     */
    async getAllUsersByCustomField(fieldName, fieldValue) {
        try {
            // Format the field name to ensure consistency (replace spaces with underscores)
            const formattedFieldName = fieldName.replace(/\s+/g, '_');

            // // Use containedBy to search within the custom_fields JSONB array
            // const { data, error } = await supabase
            //     .from(this.tableName)
            //     .select('*')
            //     .contains('custom_fields', [{ name: formattedFieldName, value: fieldValue }]);
            const criteria = JSON.stringify([{ name: formattedFieldName, value: fieldValue }]);

            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .filter('custom_fields', 'cs', criteria);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting users by custom field:', error);
            throw error;
        }
    }

    /**
     * Get all users that have a specific custom field name (regardless of value)
     * @param {string} fieldName - The name of the custom field
     * @returns {Promise<Array>} - Array of user objects
     */
    async getAllUsersByCustomFieldName(fieldName) {
        try {
            // Format the field name to ensure consistency (replace spaces with underscores)
            const formattedFieldName = fieldName.replace(/\s+/g, '_');

            const criteria = JSON.stringify([{ name: formattedFieldName }]);

            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .filter('custom_fields', 'cs', criteria);
            // Use a raw query to search for users with a custom field with the given name
            // const { data, error } = await supabase
            //     .from(this.tableName)
            //     .select('*')
            //     .or(`custom_fields->>[name].eq.${formattedFieldName}`);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error getting users by custom field name:', error);
            throw error;
        }
    }
}

export default LeadRepository;
