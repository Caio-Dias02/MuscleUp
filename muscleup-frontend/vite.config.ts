import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false
    }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['@tanstack/react-router'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['@radix-ui/react-avatar', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      }
    },
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      mangle: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      '@tanstack/react-router', 
      '@tanstack/react-query',
      'react',
      'react-dom',
      'lucide-react',
      'clsx',
      'tailwind-merge'
    ],
  },
})
