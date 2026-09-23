import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/instagram': {
          target: 'https://graph.instagram.com',
          changeOrigin: true,
          rewrite: () => `/me/media?fields=id,media_type,media_url,thumbnail_url,caption,children{media_url}&limit=24&access_token=${env.VITE_INSTAGRAM_TOKEN}`,
        }
      }
    }
  }
})
