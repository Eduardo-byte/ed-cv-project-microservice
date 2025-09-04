import cluster from 'cluster';
import os from 'os';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const numCPUs = os.cpus().length;
const isDevelopment = process.env.NODE_ENV !== 'production';

if (cluster.isPrimary) {
  console.log(`🚀 CV API Microservice - Cluster Master`);
  console.log(`📊 Primary process ${process.pid} is running`);
  console.log(`💻 CPUs available: ${numCPUs}`);
  
  // Use 1 worker in development, 2 in production for this simple microservice
  const numWorkers = isDevelopment ? 1 : 2;
  console.log(`👥 Starting ${numWorkers} worker${numWorkers > 1 ? 's' : ''}...`);

  // Fork workers
  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    console.log(`✅ Worker ${worker.process.pid} started`);
  }

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`❌ Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    
    if (!isDevelopment) {
      console.log('🔄 Starting a new worker...');
      const newWorker = cluster.fork();
      console.log(`✅ New worker ${newWorker.process.pid} started`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Master received SIGTERM, shutting down workers...');
    
    for (const id in cluster.workers) {
      cluster.workers[id].kill('SIGTERM');
    }
    
    setTimeout(() => {
      console.log('🔴 Force killing remaining workers...');
      for (const id in cluster.workers) {
        cluster.workers[id].kill('SIGKILL');
      }
      process.exit(0);
    }, 10000);
  });

} else {
  // Worker process - import and start the actual server
  console.log(`👨‍💼 Worker ${process.pid} starting server...`);
  
  // Dynamically import the server to start it
  import('./server.js').then(() => {
    console.log(`✅ Worker ${process.pid} server started successfully`);
  }).catch(error => {
    console.error(`❌ Worker ${process.pid} failed to start:`, error);
    process.exit(1);
  });
}
