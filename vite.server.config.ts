import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    ssr: true,
    assetsDir: '',
    copyPublicDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'server-chunk-[hash].js'
      },
      input: {
        main: './src/server/main.ts'
      }
    }
  }
})
