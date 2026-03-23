'use client'

import { Box, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { GitHub } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from '../hooks/useWindowSize'

const Footer = () => {
  const { t } = useTranslation()
  const width = useWindowSize()
  const isMobile = width <= 768

  return (
    <Box p={6}>
      <Box maxW="6xl" mx="auto" fontSize="xs">
        <VStack
          gap={2}
          textAlign={isMobile ? 'center' : 'center'}
          justifyContent="center"
          alignItems="center"
        >
          <Text lineHeight="2.5">{t('footer_text')}</Text>
          <Link
            href="https://github.com/Sudan-Digital-Archive/sudan-digital-archive-frontend"
            target="_blank"
            rel="noopener noreferrer"
            color="gray.100"
            fontWeight="bold"
          >
            <HStack gap={2} alignItems="center">
              <GitHub size={16} />
              <Text>Github</Text>
            </HStack>
          </Link>
        </VStack>
      </Box>
    </Box>
  )
}

export default Footer
