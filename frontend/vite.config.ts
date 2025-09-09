import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      // build.target を上書きしないよう、こちらで対象を明示
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: false,
    }),
  ],
  build: {
    // target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    minify: 'terser',
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // 依存を“用途別”に大きく分ける（過剰分割は避ける）
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          tanstack: ['@tanstack/react-query', '@tanstack/react-router'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          net: ['ky', 'jwt-decode'],
          moment: ['moment', 'moment-timezone'], // 使っているなら独立させる
        },
        // （任意）チャンク名を少し読みやすく
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
