// middlewares/checkApiKey.js
export const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: 'API key is missing' });
    }
    if (apiKey !== process.env.MICROSERVICE_API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
    }
    next();
};
