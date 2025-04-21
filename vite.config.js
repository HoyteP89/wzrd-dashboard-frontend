import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public', // Ensure this line is correctly set
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
