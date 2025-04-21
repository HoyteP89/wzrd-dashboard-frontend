import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './',
<<<<<<< HEAD
  publicDir: 'public', // specify the public directory
  build: {
    outDir: 'dist',
    emptyOutDir: true,
=======
  build: {
    outDir: 'dist',
    emptyOutDir: true
>>>>>>> 020b259 (Initial commit with Tailwind CSS setup)
  }
})
