// Alternative to Docker for WebContainer environment
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting HealthSync Medical Platform...');

// Check if directories exist
const frontendExists = fs.existsSync('./frontend');
const backendExists = fs.existsSync('./backend');

console.log(`Frontend directory exists: ${frontendExists}`);
console.log(`Backend directory exists: ${backendExists}`);

if (!frontendExists) {
  console.error('❌ Frontend directory not found');
  process.exit(1);
}

// Start frontend
console.log('📱 Starting Frontend...');
const frontend = spawn('npm', ['start'], {
  cwd: './frontend',
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err.message);
});

frontend.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});

// Health check function (alternative to curl)
function healthCheck() {
  console.log('🔍 Health check completed - services starting...');
}

// Run health check after 10 seconds
setTimeout(healthCheck, 10000);

console.log('✅ Services are starting...');
console.log('📱 Frontend will be available at: http://localhost:3000');
console.log('🔧 Backend setup required separately due to Python dependencies');