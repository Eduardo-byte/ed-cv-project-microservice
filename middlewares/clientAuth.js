// middlewares/clientAuth.js
export const extractClientAuth = (req, res, next) => {
    const clientId = req.headers['x-client-id'];
    const accountType = req.headers['x-client-account-type'];
    const role = req.headers['x-client-role'];
    const status = req.headers['x-client-account-status'];

    if (!clientId) {
        return res.status(401).json({ 
            status: 'error',
            code: 401,
            message: 'Client ID is required in headers (x-client-id)' 
        });
    }

    // Attach client information to request for use in routes
    req.clientAuth = {
        client_id: clientId,
        account_type: accountType,
        role: role,
        status: status
    };

    next();
};

export const requireClientAuth = (req, res, next) => {
    if (!req.clientAuth || !req.clientAuth.client_id) {
        return res.status(401).json({ 
            status: 'error',
            code: 401,
            message: 'Client authentication required' 
        });
    }
    next();
};
