import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public', // make sure this points to the 'public' directory
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
