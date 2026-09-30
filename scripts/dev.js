const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

// Ensure backend/.env exists before starting
const envPath = path.join(backendDir, '.env');
const envExamplePath = path.join(backendDir, '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('\x1b[33m%s\x1b[0m', '⚡ Auto-created backend/.env from backend/.env.example');
}

console.log('\x1b[36m%s\x1b[0m', '🚀 Launching Skill Binimoy (Backend & Frontend)...');

function runService(name, cwd, colorCode) {
  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';

  const child = spawn(npmCmd, ['run', 'dev'], {
    cwd,
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim().length > 0) {
        console.log(`\x1b[${colorCode}m[${name}]\x1b[0m ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim().length > 0) {
        console.error(`\x1b[${colorCode}m[${name}]\x1b[0m ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`\x1b[${colorCode}m[${name}]\x1b[0m process exited with code ${code}`);
  });

  return child;
}

const backendProc = runService('BACKEND', backendDir, '34');  // Blue
const frontendProc = runService('FRONTEND', frontendDir, '32'); // Green

function cleanExit() {
  console.log('\n\x1b[33m%s\x1b[0m', '🛑 Shutting down development servers...');
  try {
    if (backendProc && !backendProc.killed) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', backendProc.pid, '/f', '/t'], { stdio: 'ignore' });
      } else {
        backendProc.kill('SIGTERM');
      }
    }
  } catch (e) {}

  try {
    if (frontendProc && !frontendProc.killed) {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', frontendProc.pid, '/f', '/t'], { stdio: 'ignore' });
      } else {
        frontendProc.kill('SIGTERM');
      }
    }
  } catch (e) {}

  setTimeout(() => process.exit(0), 500);
}

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);
