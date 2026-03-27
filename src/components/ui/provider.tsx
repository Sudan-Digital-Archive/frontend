
import { ChakraProvider } from '@chakra-ui/react'
import { type ReactNode, useEffect, useState } from 'react'
import { system } from '../../theme'
import { ColorModeProvider } from './color-mode'

interface ProviderProps {
  children: ReactNode
}

export function Provider({ children }: ProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
