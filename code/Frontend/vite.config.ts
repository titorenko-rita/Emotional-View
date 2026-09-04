import react from '@vitejs/plugin-react'
import * as path from "path"
import { defineConfig } from 'vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://web:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/alertmanager': {
        target: 'http://alertmanager:9093',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/alertmanager/, '')
      },
      '/cadvisor': {
        target: 'http://cadvisor:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/cadvisor/, '')
      },
      '/prometheus': {
        target: 'http://prometheus:9090',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/prometheus/, '')
      },
      '/grafana': {
        target: 'http://grafana:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/grafana/, '')
      },
      '/nodeexporter': {
        target: 'http://nodeexporter:9100',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/nodeexporter/, '')
      },
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      app: path.resolve(__dirname, '.src/app'),
      components: path.resolve(__dirname, '.src/components'),
      hooks: path.resolve(__dirname, '.src/hooks'),
      pages: path.resolve(__dirname, '.src/pages'),
      shared: path.resolve(__dirname, '.src/shared'),
    }
  }
})