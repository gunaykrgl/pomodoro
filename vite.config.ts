import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from "vite-plugin-compression"
// https://vitejs.dev/config/
export default defineConfig({
  base: "/pomodoro/",
  plugins: [react(),
      viteCompression()
  ],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        worker: './src/utils/worker.js'
      }
    }
  }
  
})
