import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': 'src',
    },
  },
  server: {
    host: true,
  },
  css: {
    modules: {
      generateScopedName: '[folder]_[name]_[local]_[hash:base64:5]',
      hashPrefix: 'prefix',
    },
  },
  plugins: [react()],
})
