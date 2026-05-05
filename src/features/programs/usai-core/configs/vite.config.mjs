import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'cytoscape': path.resolve(__dirname, 'node_modules/cytoscape/dist/cytoscape.cjs.js'),
        },
    },
    optimizeDeps: {
        include: ['cytoscape'],
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
    build: {
        target: 'es2020',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return undefined;
                    }

                    if (id.includes('react') || id.includes('scheduler') || id.includes('react-router')) {
                        return 'vendor-react';
                    }

                    if (id.includes('@supabase/supabase-js')) {
                        return 'vendor-supabase';
                    }

                    if (id.includes('pdfjs-dist')) {
                        return 'vendor-pdf';
                    }

                    if (id.includes('mermaid')) {
                        return 'vendor-mermaid';
                    }

                    if (id.includes('cytoscape')) {
                        return 'vendor-cytoscape';
                    }

                    if (id.includes('katex')) {
                        return 'vendor-katex';
                    }

                    if (id.includes('lodash')) {
                        return 'vendor-lodash';
                    }

                    if (id.includes('@google/genai')) {
                        return 'vendor-genai';
                    }

                    if (id.includes('stripe')) {
                        return 'vendor-stripe';
                    }

                    return undefined;
                },
            },
        },
    },
});
