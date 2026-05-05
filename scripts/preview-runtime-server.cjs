const fs = require('fs');
const fsp = fs.promises;
const http = require('http');
const path = require('path');
const ts = require('typescript');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const dotenv = require('dotenv');

const args = process.argv.slice(2);

const readArg = (flag, fallbackValue) => {
    const index = args.indexOf(flag);
    if (index !== -1 && args[index + 1]) {
        return args[index + 1];
    }
    return fallbackValue;
};

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');
const publicRoot = path.join(projectRoot, 'public');
const host = process.env.HOST || readArg('--host', '127.0.0.1');
const requestedPort = Number(process.env.PORT || readArg('--port', '4173'));

if (!Number.isInteger(requestedPort) || requestedPort <= 0 || requestedPort > 65535) {
    console.error(`[preview-runtime] Invalid port: ${requestedPort}`);
    process.exit(1);
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
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const readEnvFile = (filename) => {
    const filePath = path.join(projectRoot, filename);
    if (!fs.existsSync(filePath)) {
        return {};
    }

    return dotenv.parse(fs.readFileSync(filePath, 'utf8'));
};

const mergedEnv = {
    ...readEnvFile('.env'),
    ...readEnvFile('.env.production'),
    ...readEnvFile('.env.local'),
    ...process.env,
};

const previewEnv = {
    DEV: true,
    PROD: false,
    MODE: 'development',
    BASE_URL: '/',
    SSR: false,
    VITE_ENABLE_DEMO_LOGIN: mergedEnv.VITE_ENABLE_DEMO_LOGIN || 'true',
    VITE_API_BASE_URL: mergedEnv.VITE_API_BASE_URL,
    VITE_SUPABASE_URL: mergedEnv.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: mergedEnv.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_SUPABASE_KEY: mergedEnv.VITE_SUPABASE_KEY,
};

const safeStat = async (targetPath) => {
    try {
        return await fsp.stat(targetPath);
    } catch {
        return null;
    }
};

const ensureInsideRoot = (targetPath) => {
    const relativePath = path.relative(projectRoot, targetPath);
    return relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
};

const toBrowserPath = (targetPath) => `/${path.relative(projectRoot, targetPath).split(path.sep).join('/')}`;

const resolveLocalSpecifier = (specifier, importerPath) => {
    const basePath = specifier.startsWith('@/') ?
        path.join(srcRoot, specifier.slice(2)) :
        specifier.startsWith('/') ?
            path.join(projectRoot, specifier.slice(1)) :
            path.resolve(path.dirname(importerPath), specifier);

    const searchCandidates = path.extname(basePath) ?
        [basePath] :
        [
            `${basePath}.tsx`,
            `${basePath}.ts`,
            `${basePath}.jsx`,
            `${basePath}.js`,
            `${basePath}.mjs`,
            path.join(basePath, 'index.tsx'),
            path.join(basePath, 'index.ts'),
            path.join(basePath, 'index.jsx'),
            path.join(basePath, 'index.js'),
            path.join(basePath, 'index.mjs'),
        ];

    for (const candidate of searchCandidates) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            return candidate;
        }
    }

    return null;
};

const rewriteBareSpecifier = (specifier) => {
    if (specifier.startsWith('http://') || specifier.startsWith('https://') || specifier.startsWith('data:')) {
        return specifier;
    }

    return `https://esm.sh/${specifier}?bundle&target=es2020&dev`;
};

const rewriteImportSpecifiers = (code, importerPath) => {
    const rewriteSpecifier = (specifier) => {
        if (specifier.endsWith('.css')) {
            return null;
        }

        if (specifier.startsWith('.') || specifier.startsWith('@/') || specifier.startsWith('/')) {
            const resolved = resolveLocalSpecifier(specifier, importerPath);
            if (!resolved) {
                return specifier;
            }

            return toBrowserPath(resolved);
        }

        return rewriteBareSpecifier(specifier);
    };

    const staticImportPattern = /((?:import|export)\s+(?:[\s\S]*?\s+from\s*)?["'])([^"']+)(["'])/g;
    const dynamicImportPattern = /(import\(\s*["'])([^"']+)(["']\s*\))/g;

    const applyRewrite = (pattern, input) => input.replace(pattern, (match, prefix, specifier, suffix) => {
        const rewritten = rewriteSpecifier(specifier);
        if (rewritten === null) {
            return '';
        }

        return `${prefix}${rewritten}${suffix}`;
    });

    return applyRewrite(dynamicImportPattern, applyRewrite(staticImportPattern, code));
};

const stripCssImports = (source) => source.replace(/^\s*import\s+['"][^'"]+\.css['"];\s*$/gm, '');

const replaceImportMetaEnv = (source) => {
    let result = source;
    for (const [key, value] of Object.entries(previewEnv)) {
        const literal = value === undefined ? 'undefined' : JSON.stringify(value);
        result = result.replace(new RegExp(`import\\.meta\\.env\\.${key}\\b`, 'g'), literal);
    }

    return result.replace(/import\.meta\.env\b/g, JSON.stringify(previewEnv));
};

const buildPreviewCss = async () => {
    const combinedCss = [
        await fsp.readFile(path.join(srcRoot, 'index.css'), 'utf8'),
        await fsp.readFile(path.join(srcRoot, 'styles', 'zen-ops.css'), 'utf8'),
    ].join('\n');

    const result = await postcss([
        tailwindcss(path.join(projectRoot, 'tailwind.config.js')),
        autoprefixer,
    ]).process(combinedCss, {
        from: path.join(srcRoot, 'index.css'),
    });

    return result.css;
};

const sendText = (res, statusCode, contentType, body) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.end(body);
};

const sendFile = async (res, filePath) => {
    const extension = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypeByExtension[extension] || 'application/octet-stream';
    const data = await fsp.readFile(filePath);
    res.statusCode = 200;
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.end(data);
};

const transformIndexHtml = async () => {
    const htmlPath = path.join(projectRoot, 'index.html');
    const html = await fsp.readFile(htmlPath, 'utf8');
    const cssLink = '\n  <link rel="stylesheet" href="/@preview/app.css" />';
    if (html.includes('/@preview/app.css')) {
        return html;
    }

    return html.replace('</head>', `${cssLink}\n</head>`);
};

const transformModule = async (filePath) => {
    const source = await fsp.readFile(filePath, 'utf8');
    const sanitizedSource = replaceImportMetaEnv(stripCssImports(source));
    const transpiled = ts.transpileModule(sanitizedSource, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2020,
            jsx: ts.JsxEmit.ReactJSX,
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
        },
        fileName: filePath,
    });

    return rewriteImportSpecifiers(transpiled.outputText, filePath);
};

const serveRequest = async (req, res) => {
    const requestUrl = new URL(req.url || '/', `http://${host}:${requestedPort}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === '/@preview/app.css') {
        const css = await buildPreviewCss();
        sendText(res, 200, 'text/css; charset=utf-8', css);
        return;
    }

    if (pathname === '/@preview/health') {
        sendText(res, 200, 'application/json; charset=utf-8', JSON.stringify({
            ok: true,
            mode: 'runtime-preview',
        }));
        return;
    }

    if (pathname === '/' || pathname === '/index.html') {
        sendText(res, 200, 'text/html; charset=utf-8', await transformIndexHtml());
        return;
    }

    const projectPath = path.join(projectRoot, pathname.slice(1));
    const publicPath = path.join(publicRoot, pathname.slice(1));

    if (pathname.startsWith('/src/') || pathname.startsWith('/server/')) {
        if (!ensureInsideRoot(projectPath)) {
            sendText(res, 403, 'text/plain; charset=utf-8', 'Forbidden.');
            return;
        }

        if (!fs.existsSync(projectPath)) {
            sendText(res, 404, 'text/plain; charset=utf-8', 'Not found.');
            return;
        }

        const extension = path.extname(projectPath).toLowerCase();
        if (['.ts', '.tsx', '.js', '.jsx', '.mjs'].includes(extension)) {
            const output = await transformModule(projectPath);
            sendText(res, 200, 'application/javascript; charset=utf-8', output);
            return;
        }

        await sendFile(res, projectPath);
        return;
    }

    if (fs.existsSync(publicPath) && (await safeStat(publicPath))?.isFile()) {
        await sendFile(res, publicPath);
        return;
    }

    if (fs.existsSync(projectPath) && (await safeStat(projectPath))?.isFile()) {
        await sendFile(res, projectPath);
        return;
    }

    sendText(res, 200, 'text/html; charset=utf-8', await transformIndexHtml());
};

const server = http.createServer((req, res) => {
    serveRequest(req, res).catch((error) => {
        console.error(`[preview-runtime] ${error.stack || error.message}`);
        sendText(res, 500, 'text/plain; charset=utf-8', 'Preview runtime error.');
    });
});

const maxPortAttempts = 20;
let activePort = requestedPort;
let attempts = 0;

const startServer = () => {
    server.listen(activePort, host, () => {
        console.log(`[preview-runtime] Preview running at http://${host}:${activePort}`);
        console.log('[preview-runtime] Uses in-process TypeScript/PostCSS transforms. Refresh the browser after edits.');
    });
};

server.on('error', (error) => {
    if (error && error.code === 'EADDRINUSE') {
        attempts += 1;
        if (attempts > maxPortAttempts) {
            console.error(`[preview-runtime] Could not find a free port after ${maxPortAttempts + 1} attempts.`);
            process.exit(1);
        }

        activePort += 1;
        console.warn(`[preview-runtime] Port ${activePort - 1} is in use. Retrying on ${activePort}...`);
        startServer();
        return;
    }

    console.error(`[preview-runtime] Server error: ${error.message}`);
    process.exit(1);
});

startServer();
