import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './components/ui/provider'
import { ColorModeProvider } from './components/ui/color-mode'
import App from './App'
import './css/styles.css'
import './il18n.ts'

const replayRoutes = new Set(['/replay/sw.js', '/replay/ui.js'])
const isNonReplayRoute = (path: string) => {
  return !path.startsWith('/replay/') || replayRoutes.has(path)
}

if (isNonReplayRoute(window.location.pathname)) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider>
        <ColorModeProvider>
          <App />
        </ColorModeProvider>
      </Provider>
    </StrictMode>,
  )
}
