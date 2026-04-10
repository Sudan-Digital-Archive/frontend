import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'

type ColorMode = 'light' | 'dark'

interface ColorModeContextType {
  colorMode: ColorMode
  setColorMode: (mode: ColorMode) => void
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined,
)

// eslint-disable-next-line react-refresh/only-export-components
export function useColorMode() {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

const STORAGE_KEY = 'sda-color-mode'

function getInitialColorMode(): ColorMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorModeState] =
    useState<ColorMode>(getInitialColorMode)

  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEY, colorMode)
  }, [colorMode])

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode)
  }, [])

  const toggleColorMode = useCallback(() => {
    setColorModeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = { colorMode, setColorMode, toggleColorMode }

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  )
}
