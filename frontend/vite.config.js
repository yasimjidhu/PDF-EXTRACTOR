import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('pdfjs-dist')) {
            return 'pdfjs';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      'pdfjs-dist': path.resolve(__dirname, 'node_modules/pdfjs-dist'),
    }
  }
});
