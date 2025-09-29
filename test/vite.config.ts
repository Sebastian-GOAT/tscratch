import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'esbuild',
    outDir: 'dist'
  },
  server: {
    port: 5173,
    open: false
  }
});