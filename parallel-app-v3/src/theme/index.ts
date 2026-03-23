import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

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
          300: { value: '#f9a8d4' },
          400: { value: '#f472b6' },
          500: { value: '#ec4899' },
          600: { value: '#db2777' },
        },
      },
      fonts: {
        heading: {
          value:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        body: {
          value:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { base: '#ffffff', _dark: '#1a1a1a' } },
          subtle: { value: { base: '#f8f8f8', _dark: '#252525' } },
          muted: { value: { base: '#f0f0f0', _dark: '#2d2d2d' } },
          emphasized: { value: { base: '#e0e0e0', _dark: '#3d3d3d' } },
        },
        fg: {
          DEFAULT: { value: { base: '#1a1a1a', _dark: '#ffffff' } },
          muted: { value: { base: '#666666', _dark: '#a0a0a0' } },
          subtle: { value: { base: '#999999', _dark: '#707070' } },
        },
        border: {
          DEFAULT: { value: { base: '#e5e5e5', _dark: '#3d3d3d' } },
        },
        accent: {
          primary: { value: { base: 'cyan.300', _dark: 'cyan.400' } },
          secondary: { value: { base: 'pink.400', _dark: 'pink.400' } },
        },
        dropdownBg: {
          value: { base: '#ffffff', _dark: '#1a1a1a' },
        },
        dropdownHover: {
          value: {
            base: 'rgba(103, 232, 249, 0.15)',
            _dark: 'rgba(103, 232, 249, 0.15)',
          },
        },
        dropdownHoverPink: {
          value: {
            base: 'rgba(244, 114, 182, 0.15)',
            _dark: 'rgba(236, 72, 153, 0.15)',
          },
        },
        toast: {
          bg: { value: { base: 'cyan.300', _dark: 'cyan.900' } },
          bgError: { value: { base: 'pink.400', _dark: 'pink.600' } },
          text: { value: { base: '#1a1a1a', _dark: 'white' } },
        },
        card: {
          bg: { value: { base: '#ffffff', _dark: '#252525' } },
          border: { value: { base: '#e5e5e5', _dark: '#3d3d3d' } },
        },
        input: {
          bg: { value: { base: '#ffffff', _dark: '#252525' } },
          border: { value: { base: 'cyan.300', _dark: '#404040' } },
          text: { value: { base: '#1a1a1a', _dark: '#ffffff' } },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      bg: 'bg',
      color: 'fg',
      fontFamily: 'body',
    },
    'ol, ul': {
      listStyleType: 'decimal',
      paddingLeft: '1.5rem',
    },
    ul: {
      listStyleType: 'disc',
    },
  },
})

export const system = createSystem(defaultConfig, config)
