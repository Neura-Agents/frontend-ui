import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    strictPort: true,
    proxy: {
      '/backend': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy agent discovery requests to Kong
      '^/[^/]+/.well-known/agent.json': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
