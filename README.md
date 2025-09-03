# Node.js Users Microservice with Swagger and Clustering

This project replicates a FastAPI “users” microservice using Node.js, Express, Swagger for API documentation, and Supabase as the database. It’s designed to handle high-concurrency scenarios by using asynchronous operations and Node’s clustering capabilities.

## Features

- **RESTful API Endpoints:** Full CRUD operations for user management.
- **Swagger Documentation:** Interactive API docs available via Swagger UI.
- **Clustering:** Utilizes Node.js clustering to leverage multi-core systems.
- **Supabase Integration:** Uses Supabase for backend database operations.
- **Asynchronous & Concurrent:** All routes, services, and CRUD operations are built with async/await to efficiently handle concurrent requests.
- **Stress Testing:** Comprehensive stress tests using Jest and Supertest simulate high load and generate detailed logs.
- **Logging:** Detailed logs are produced during stress tests to help monitor responses and diagnose issues.

## Project Structure
.
├── README.md
├── cluster.js
├── db
│   └── supabase.js
├── middlewares
│   └── checkApiKey.js
├── models
│   └── lead.model.js
├── package-lock.json
├── package.json
├── repositories
│   └── lead.repository.js
├── routes
│   └── lead.routes.js
├── server.js
├── services
│   └── lead.service.js
└── tests
    ├── readOnlyStress.test.js
    ├── stress-test.log
    └── users.test.js



## Setup & Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd node-swagger-users
   ```

2. **Install Dependencies:**

   ```bash
   npm install

3. **Configure Environment Variables:**

Create a .env file in the project root with your environment settings. For example:

   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   SECRET_KEY=your_secret_key
   ```

4. **Start the Service:**
   ```bash
   npm start



**Testing**
   ```bash 
   npm run stress-test
   ```

These tests are configured to send multiple concurrent requests to all endpoints (both read and write) and log detailed output to a log file (located in the tests directory). You can adjust the concurrency level by changing the NUM_REQUESTS constant in the test file.

Concurrency & Performance
Asynchronous Design:
All routes, services, and CRUD functions use asynchronous operations (async/await) so they can handle many concurrent requests.

Clustering:
The project leverages Node.js clustering (via cluster.js) to distribute the load across multiple CPU cores.

Stress Testing:
Stress tests help you gauge how your service performs under heavy load. Use the generated logs (e.g., tests/stress-test.log) to monitor performance and identify potential bottlenecks.

Logging
During stress tests, detailed logs are written both to the console and to a log file (tests/stress-test.log). These logs include:

The number of requests sent per endpoint.
The response status and any errors encountered.
Data returned by the endpoints (e.g., created, updated, or aggregated user data).
Troubleshooting
JSON Parsing Errors:
If you encounter errors such as "Unterminated string in JSON," check your data sources (CSV or database) for malformed JSON or unexpected characters.

Timeouts & AggregateErrors:
If many requests time out or you see AggregateErrors, it may indicate that under extreme load your endpoints or database queries are overwhelmed. Consider reducing NUM_REQUESTS during testing or optimizing your endpoints and database interactions.

Contributing
Contributions, issues, and feature requests are welcome! Please check the issues page for details or submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

