'use client'

import { Box, Text } from '@chakra-ui/react'
import { useToast } from '../../context/ToastContext'

export function Toast() {
  const { toast } = useToast()

  if (!toast) return null

  return (
    <Box
      position="fixed"
      bottom={6}
      left="50%"
      transform="translateX(-50%)"
      bg={toast.type === 'error' ? 'toast.bgError' : 'toast.bg'}
      color="toast.text"
      px={6}
      py={3}
      borderRadius="lg"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.2)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      gap={2}
    >
      <Text fontWeight="semibold">{toast.message}</Text>
    </Box>
  )
}
