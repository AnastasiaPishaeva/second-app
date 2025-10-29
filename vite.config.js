import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        first: resolve(__dirname, 'index.html'),
        second: resolve(__dirname, 'meme.html'),
        third: resolve(__dirname, 'book.html'),
      },
    },
  },
});
