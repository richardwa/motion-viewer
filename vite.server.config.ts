import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/client', import.meta.url)),
      '@s': fileURLToPath(new URL('./src/server', import.meta.url))
    }
  },
  build: {
    assetsDir: '',
    copyPublicDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'server.js',
        chunkFileNames: 'server-chunk-[hash].js'
      },
      input: {
        main: './src/server/main.ts'
      }
    }
  }
})
