import { Box } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface ArchiveCardProps {
  children: ReactNode
}

export const ArchiveCard = ({ children }: ArchiveCardProps) => {
  return (
    <Box
      bg="card.bg"
      boxShadow="xl"
      borderRadius="xl"
      border="1px solid"
      borderColor="card.border"
      transition="all 0.3s ease-in-out"
      _hover={{
        boxShadow: '2xl',
        transform: 'translateY(-5px)',
      }}
      overflow="hidden"
      height="100%"
      minH="200px"
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  )
}
