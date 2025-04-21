import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public', // specifies where the public directory is
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
