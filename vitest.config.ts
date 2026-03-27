import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: '/src',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './testUtils/testSetup.ts',
  },
})
