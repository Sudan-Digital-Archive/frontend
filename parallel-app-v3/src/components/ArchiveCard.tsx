'use client'

import { Box } from '@chakra-ui/react'
import { useColorModeValue } from './ui/color-mode'
import type { ReactNode } from 'react'

interface ArchiveCardProps {
  children: ReactNode
}

export const ArchiveCard = ({ children }: ArchiveCardProps) => {
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Box
      bg={bg}
      boxShadow="xl"
      borderRadius="xl"
      border="1px solid"
      borderColor="transparent"
      transition="all 0.3s ease-in-out"
      _hover={{
        boxShadow: '2xl',
        transform: 'translateY(-5px)',
        borderColor: 'cyan.400',
      }}
      overflow="hidden"
    >
      {children}
    </Box>
  )
}
