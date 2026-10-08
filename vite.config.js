import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        '..',
        'C:/Users/bhara/.gemini/antigravity-ide/brain/1574b414-254e-4b64-9fe6-7ce40a1675c8/.user_uploaded'
      ]
    }
  }
})
