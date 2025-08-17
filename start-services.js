#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting HealthSync Medical Platform Services...\n');

// Function to start a service
function startService(name, command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Starting ${name}...`);
    
    const service = spawn(command, args, {
      cwd: cwd || process.cwd(),
      stdio: 'pipe',
      shell: true
    });

    service.stdout.on('data', (data) => {
      console.log(`[${name}] ${data.toString().trim()}`);
    });

    service.stderr.on('data', (data) => {
      console.error(`[${name}] ${data.toString().trim()}`);
    });

    service.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${name} started successfully`);
        resolve();
      } else {
        console.error(`❌ ${name} failed with code ${code}`);
        reject(new Error(`${name} failed`));
      }
    });

    service.on('error', (error) => {
      console.error(`❌ Failed to start ${name}:`, error.message);
      reject(error);
    });

    // For long-running services, resolve after a short delay
    if (name.includes('Frontend') || name.includes('Backend')) {
      setTimeout(() => {
        console.log(`✅ ${name} is starting...`);
        resolve();
      }, 3000);
    }
  });
}

// Main function to start all services
async function startAllServices() {
  try {
    console.log('🔧 Setting up environment...\n');
    
    // Check if frontend directory exists
    const frontendPath = path.join(process.cwd(), 'frontend');
    const backendPath = path.join(process.cwd(), 'backend');
    
    console.log(`Frontend path: ${frontendPath}`);
    console.log(`Backend path: ${backendPath}`);
    
    // Install frontend dependencies
    console.log('\n📦 Installing frontend dependencies...');
    await startService('Frontend Dependencies', 'npm', ['install'], frontendPath);
    
    // Start frontend
    console.log('\n🌐 Starting frontend server...');
    startService('Frontend Server', 'npm', ['start'], frontendPath);
    
    console.log('\n✅ All services are starting up!');
    console.log('\n🌐 Frontend will be available at: http://localhost:3000');
    console.log('📚 Backend API docs will be at: http://localhost:8000/docs');
    console.log('\n💡 Note: Backend requires Python setup - see README.md for details');
    
  } catch (error) {
    console.error('\n❌ Error starting services:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down services...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down services...');
  process.exit(0);
});

// Start the services
startAllServices();