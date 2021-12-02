import {defineConfig} from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3030
  },

  resolve: {
    alias: [{
      find: 'src',
      replacement: path.resolve(path.resolve(__dirname), 'src')
    }]
  },

  plugins: [react(), cesium()]
})
