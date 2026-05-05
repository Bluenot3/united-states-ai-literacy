const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const cwd = process.cwd();

const checks = [];

const runSpawnCheck = (label, file, args) => {
  const result = spawnSync(file, args, {
    cwd,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  checks.push({
    label,
    kind: 'spawn',
    file,
    args,
    ok: !result.error && result.status === 0,
    status: result.status ?? null,
    error: result.error
      ? {
          code: result.error.code,
          message: result.error.message,
          syscall: result.error.syscall,
        }
      : null,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  });
};

const runFsCheck = (label, targetPath) => {
  try {
    const stat = fs.statSync(targetPath);
    checks.push({
      label,
      kind: 'fs',
      ok: true,
      path: targetPath,
      isDirectory: stat.isDirectory(),
      size: stat.size,
    });
  } catch (error) {
    checks.push({
      label,
      kind: 'fs',
      ok: false,
      path: targetPath,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }
};

runFsCheck('workspace-root', cwd);
runFsCheck('vite-config', path.join(cwd, 'vite.config.mjs'));
runFsCheck('esbuild-binary', path.join(cwd, 'node_modules', '@esbuild', 'win32-x64', 'esbuild.exe'));

runSpawnCheck('node-from-node', 'node', ['-v']);
runSpawnCheck('cmd-from-node', 'cmd.exe', ['/c', 'echo', 'preview-runtime']);
runSpawnCheck('powershell-from-node', 'powershell.exe', ['-NoProfile', '-Command', 'Write-Output preview-runtime']);
runSpawnCheck('esbuild-from-node', '.\\node_modules\\@esbuild\\win32-x64\\esbuild.exe', ['--version']);

try {
  const esbuild = require('esbuild');
  checks.push({
    label: 'esbuild-module-load',
    kind: 'module',
    ok: true,
    version: esbuild.version,
  });
} catch (error) {
  checks.push({
    label: 'esbuild-module-load',
    kind: 'module',
    ok: false,
    error: {
      code: error.code,
      message: error.message,
    },
  });
}

console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  cwd,
  node: process.version,
  checks,
}, null, 2));

const hasFailure = checks.some((check) => !check.ok);
process.exitCode = hasFailure ? 1 : 0;
