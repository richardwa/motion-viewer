import { fileURLToPath, URL } from 'node:url'

import { build, defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/server', import.meta.url))
    }
  },
  build: {
    outDir: './dist/server',
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
