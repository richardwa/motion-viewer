import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/srv': 'http://localhost:3000',
      '/motion': {
        target: 'https://pluto',
        secure: false
      },
      '/stream': {
        target: 'https://pluto',
        secure: false
      }
    }
  }
})
