import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify';

// eslint-disable-next-line no-undef
/* const apiUrl = process.env.VITE_API_URL_LOCALNETWORK || 'http://localhost:88';
 */

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.107:88',  // O backend do ZoneMinder está rodando aqui
        changeOrigin: true,             // Permite mudar a origem
      },
      '/cgi-bin': {
        target: 'http://192.168.1.107:88',
        changeOrigin: true,
      }
    }
  },
  build: {
    sourcemap: true,
  },
})
