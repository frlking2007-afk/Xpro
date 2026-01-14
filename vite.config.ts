import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
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
  build: {
    // Enable minification (use esbuild - faster and built-in)
    minify: 'esbuild',
    // Remove console.log in production
    esbuild: {
      drop: ['console', 'debugger'],
    },
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core libraries - combine react and react-dom to avoid circular deps
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          
          // React Router - separate chunk
          if (id.includes('node_modules/react-router')) {
            return 'react-router-vendor';
          }
          
          // Supabase - separate chunk
          if (id.includes('node_modules/@supabase/supabase-js')) {
            return 'supabase-vendor';
          }
          
          // TanStack Query - separate chunk
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'react-query-vendor';
          }
          
          // TanStack Table - separate chunk
          if (id.includes('node_modules/@tanstack/react-table')) {
            return 'react-table-vendor';
          }
          
          // UI libraries
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/lucide-react')) {
            return 'ui-vendor';
          }
          
          // Chart library - separate chunk (large)
          if (id.includes('node_modules/recharts')) {
            return 'chart-vendor';
          }
          
          // Form libraries
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform/resolvers') || id.includes('node_modules/zod')) {
            return 'form-vendor';
          }
          
          // 3D libraries - separate chunk (very large)
          if (id.includes('node_modules/three') || id.includes('node_modules/postprocessing')) {
            return 'three-vendor';
          }
          
          // Date library
          if (id.includes('node_modules/date-fns')) {
            return 'date-vendor';
          }
          
          // Other node_modules - catch all (but exclude react to avoid circular deps)
          if (id.includes('node_modules') && !id.includes('react')) {
            return 'vendor';
          }
        },
        // Optimize asset names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (disable in production for smaller bundle)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    cssMinify: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
    ],
    exclude: ['three', 'postprocessing'], // Exclude heavy 3D libraries from pre-bundling
  },
})
