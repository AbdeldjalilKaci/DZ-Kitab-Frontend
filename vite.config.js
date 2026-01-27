import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // NUCLEAR BUILD-TIME VALIDATION
  // Only check during build command (not preview or dev)
  if (command === 'build' && (!env.VITE_API_URL || env.VITE_API_URL.includes("localhost"))) {
    console.error("\n\n################################################################")
    console.error("BUILD FAILURE: VITE_API_URL is missing or set to localhost!")
    console.error("Production builds must have a valid external API URL.")
    console.error("Found VITE_API_URL=" + env.VITE_API_URL)
    console.error("################################################################\n\n")
    process.exit(1)
  }

  // Combined configuration
  return {
    plugins: [react()],
    server: {
      host: true, // Listen on all addresses
      port: 5173, // Development port
    },
    preview: {
      host: true,
      port: 4173, // Railway preview port
    },
    // Optional: Add base URL if deploying to subpath
    base: '/',
    
    // Optional build optimizations for production
    build: {
      target: 'es2020',
      minify: 'terser',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          }
        }
      }
    }
  }
})