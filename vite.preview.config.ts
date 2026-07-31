/**
 * Build config for the standalone Pioneer design preview (preview/index.html).
 * Separate from vite.config.ts so the harness can never leak into the app build.
 */
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  // The harness lives in preview/, so root it there — the built page lands at
  // dist-preview/index.html, directly hostable on any static host.
  root: path.resolve(__dirname, 'preview'),
  base: './',
  publicDir: path.resolve(__dirname, 'public'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      cytoscape: path.resolve(__dirname, 'node_modules/cytoscape/dist/cytoscape.cjs.js'),
    },
  },
  optimizeDeps: { include: ['cytoscape'] },
  build: {
    target: 'es2020',
    outDir: path.resolve(__dirname, 'dist-preview'),
    emptyOutDir: true,
  },
  server: { host: '127.0.0.1', port: 5180 },
});
