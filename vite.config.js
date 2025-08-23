import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ensure _redirects is copied to the build output
      external: [],
    },
    outDir: 'dist'
  },
  preview: {
    // This helps with local preview, but won't affect production
    historyApiFallback: true
  }
})
