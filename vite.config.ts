import { defineConfig, Terser } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@monaco-editor/react',
      'lucide-react',
      'zustand',
      'recharts'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    outDir: 'dist',
    sourcemap: true
  },
});
