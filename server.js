// server.js
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import leadsRouter from './routes/lead.routes.js';
import devLeadsRouter from './routes/dev.leads.routes.js';
import { checkApiKey } from './middlewares/checkApiKey.js';

const app = express();
const port = process.env.PORT || 3003;

// Parse JSON request bodies

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Users Microservice API',
            version: '1.0.0',
            description: 'Microservice for user operations using Supabase',
        },
        servers: [
            { url: `http://localhost:${port}` },
            { url: `https://web2-leads-micro-service-nodejs-8851907900.europe-west1.run.app` },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description: 'API key authentication. Enter your API key in the format: your-api-key-value'
                }
            }
        },
        security: [
            { ApiKeyAuth: [] }
        ]
    },
    apis: ['./routes/*.js'], // Files containing Swagger annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Add API key middleware to protect all routes
app.use(checkApiKey);

// Base route
app.get('/', (req, res) => {
    res.send(`Welcome to the Users Microservice! Process ID: ${process.pid}`);
});

// Mount users API routes
app.use('/api/v2/users', leadsRouter);
app.use('/api/v2/dev/opportunities', devLeadsRouter);

app.listen(port, () => {
    console.log(`Worker ${process.pid} listening on port ${port}`);
});
