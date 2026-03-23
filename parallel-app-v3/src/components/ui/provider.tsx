'use client'

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import { type ReactNode, useEffect, useState } from 'react'

interface ProviderProps {
  children: ReactNode
}

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        cyan: {
          300: { value: '#67e8f9' },
          400: { value: '#22d3ee' },
          500: { value: '#06b6d4' },
          600: { value: '#0891b2' },
        },
        pink: {
          400: { value: '#f472b6' },
          500: { value: '#ec4899' },
          600: { value: '#db2777' },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { base: 'white', _dark: '#1a202c' } },
          subtle: { value: { base: 'gray.50', _dark: 'gray.800' } },
          muted: { value: { base: 'gray.100', _dark: 'gray.700' } },
          emphasized: { value: { base: 'gray.200', _dark: 'gray.600' } },
        },
        fg: {
          DEFAULT: { value: { base: 'gray.900', _dark: 'white' } },
          muted: { value: { base: 'gray.600', _dark: 'gray.400' } },
          subtle: { value: { base: 'gray.500', _dark: 'gray.500' } },
        },
        border: {
          DEFAULT: { value: { base: 'gray.200', _dark: 'gray.700' } },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      bg: 'bg',
      color: 'fg',
    },
  },
})

const system = createSystem(defaultConfig, config)

export function Provider({ children }: ProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.classList.add('dark')
  }, [])

  return <ChakraProvider value={system}>{mounted && children}</ChakraProvider>
}
