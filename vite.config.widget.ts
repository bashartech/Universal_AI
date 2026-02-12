import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: './src/embed/widget.tsx',
      name: 'UniversalChatbot',
      fileName: 'chatbot',
      formats: ['iife'],
    },
    outDir: 'dist/widget',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: 'chatbot.[ext]',
      },
    },
  },
});
