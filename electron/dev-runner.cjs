const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting AccounTech development server...');

const vite = spawn('npx', ['vite', '--port', '5173'], {
  stdio: 'inherit',
  shell: true
});

function checkViteReady(attemptsLeft = 30) {
  if (attemptsLeft <= 0) {
    console.error('❌ Vite dev server failed to start in time.');
    vite.kill();
    process.exit(1);
  }

  http.get('http://localhost:5173', (res) => {
    console.log('✨ Vite dev server ready! Launching AccounTech desktop window...');
    const env = { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:5173' };
    const electron = spawn('npx', ['electron', '.', '--no-sandbox'], {
      stdio: 'inherit',
      env,
      shell: true
    });

    electron.on('close', (code) => {
      console.log('👋 AccounTech window closed.');
      vite.kill();
      process.exit(code || 0);
    });
  }).on('error', () => {
    setTimeout(() => checkViteReady(attemptsLeft - 1), 500);
  });
}

setTimeout(() => checkViteReady(), 1000);

process.on('SIGINT', () => {
  vite.kill();
  process.exit(0);
});
