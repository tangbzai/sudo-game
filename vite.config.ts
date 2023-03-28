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
  plugins: [react()],
})
