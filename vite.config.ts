import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const modulePath = id.split('node_modules/')[1]
            const topLevelFolder = modulePath.split('/')[0]
            if (topLevelFolder !== '.pnpm') {
              return topLevelFolder
            }
            const scopedPackageName = modulePath.split('/')[1]
            const chunkName =
              scopedPackageName.split('@')[
                scopedPackageName.startsWith('@') ? 1 : 0
              ]
            return chunkName
          }
        },
      },
    },
  },
})
