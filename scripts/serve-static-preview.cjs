const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync, exec } = require('child_process');

const args = process.argv.slice(2);

const readArg = (flag, fallbackValue) => {
    const index = args.indexOf(flag);
    if (index !== -1 && args[index + 1]) {
        return args[index + 1];
    }
    return fallbackValue;
};

const host = process.env.HOST || readArg('--host', '127.0.0.1');
const requestedPort = Number(process.env.PORT || readArg('--port', '4173'));
const shouldOpen = args.includes('--open');
const distRoot = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distRoot, 'index.html');

if (!Number.isInteger(requestedPort) || requestedPort <= 0 || requestedPort > 65535) {
    console.error(`[preview] Invalid port: ${requestedPort}`);
    process.exit(1);
}

const runBuild = () => {
    const buildCommand = process.platform === 'win32'
        ? ['cmd', ['/c', 'npm run build']]
        : ['npm', ['run', 'build']];

    console.log('[preview] dist is missing. Running `npm run build`...');
    const buildResult = spawnSync(buildCommand[0], buildCommand[1], {
        cwd: process.cwd(),
        stdio: 'inherit',
        env: process.env,
    });

    return buildResult.status === 0;
};

if (!fs.existsSync(distRoot) || !fs.statSync(distRoot).isDirectory() || !fs.existsSync(indexPath)) {
    const buildSucceeded = runBuild();

    if (!buildSucceeded || !fs.existsSync(indexPath)) {
        console.error('[preview] Could not prepare dist output.');
        process.exit(1);
    }
}

const mimeTypeByExtension = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.wasm': 'application/wasm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const sendFile = (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypeByExtension[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readError, data) => {
        if (readError) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Internal server error.');
            return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.end(data);
    });
};

const server = http.createServer((req, res) => {
    const requestUrl = req.url || '/';
    const pathname = decodeURIComponent(requestUrl.split('?')[0]);
    const normalized = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    const requested = normalized === path.sep || normalized === '/' ? '/index.html' : normalized;

    const resolvedPath = path.resolve(distRoot, `.${requested}`);
    const isInsideDist = resolvedPath.startsWith(distRoot);

    if (!isInsideDist) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Forbidden.');
        return;
    }

    fs.stat(resolvedPath, (statError, stats) => {
        if (!statError && stats.isFile()) {
            sendFile(res, resolvedPath);
            return;
        }

        sendFile(res, indexPath);
    });
});

const maxPortAttempts = 20;
let activePort = requestedPort;
let attempts = 0;

const openBrowser = (url) => {
    if (!shouldOpen) {
        return;
    }

    const safeExec = (command) => {
        try {
            exec(command, (error) => {
                if (error) {
                    console.warn(`[preview] Could not auto-open browser: ${error.message}`);
                }
            });
        } catch (error) {
            console.warn(`[preview] Could not auto-open browser: ${error.message}`);
        }
    };

    if (process.platform === 'win32') {
        safeExec(`start "" "${url}"`);
        return;
    }

    if (process.platform === 'darwin') {
        safeExec(`open "${url}"`);
        return;
    }

    safeExec(`xdg-open "${url}"`);
};

const startServer = () => {
    server.listen(activePort, host, () => {
        const url = `http://${host}:${activePort}`;
        console.log(`[preview] Static preview running at ${url}`);
        console.log('[preview] Press Ctrl+C to stop.');
        openBrowser(url);
    });
};

server.on('error', (error) => {
    if (error && error.code === 'EADDRINUSE') {
        attempts += 1;
        if (attempts > maxPortAttempts) {
            console.error(`[preview] Could not find a free port after ${maxPortAttempts + 1} attempts.`);
            process.exit(1);
        }

        activePort += 1;
        console.warn(`[preview] Port ${activePort - 1} is in use. Retrying on ${activePort}...`);
        startServer();
        return;
    }

    console.error(`[preview] Server error: ${error.message}`);
    process.exit(1);
});

startServer();
