// cluster.js
import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Master process ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart any dead workers.
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting a new worker...`);
        cluster.fork();
    });
} else {
    // In worker processes, import and start the server.
    import('./server.js')
        .then(() => {
            console.log(`Worker process ${process.pid} started`);
        })
        .catch((error) => {
            console.error('Error starting worker process:', error);
        });
}
