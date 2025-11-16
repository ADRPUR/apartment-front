import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
            manifest: {
                name: 'Apartment Calculator',
                short_name: 'AptCalc',
                theme_color: '#0ea5e9',
                background_color: '#0b1220',
                start_url: '/',
                display: 'standalone',
                icons: [
                    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                    { src: 'pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
                ]
            },
            workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] }
        })
    ],
    build: {
        // Enable source maps for production debugging (can be disabled for smaller builds)
        sourcemap: false,
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                // Manual chunking strategy for better caching
                manualChunks: {
                    // React core
                    'vendor-react': ['react', 'react-dom'],
                    // Charts library
                    'vendor-charts': ['recharts'],
                    // Animation library
                    'vendor-animation': ['framer-motion'],
                    // PDF generation (lazy loaded)
                    'vendor-pdf': ['jspdf', 'html2canvas'],
                    // Form libraries
                    'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
                    // State management
                    'vendor-state': ['zustand'],
                },
                // Better file naming for caching
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        },
        // Minification options
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.logs in production
                drop_debugger: true,
            },
        },
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'zustand'],
    },
})
