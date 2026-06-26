import devServer from "@hono/vite-dev-server"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
const __dirname = import.meta.dirname

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devServer({ entry: "api/boot.ts", exclude: [/^\/(?!(api|uploads)(\/|$)).*$/] }),
    react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@contracts': path.resolve(__dirname, './contracts'),
      '@db': path.resolve(__dirname, './db'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
})
