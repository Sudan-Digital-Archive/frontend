import { Box, HStack, Link, Text, Stack } from '@chakra-ui/react'
import { GitHub } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from '../hooks/useWindowSize'
import { useColorMode } from './ui/color-mode'

const Footer = () => {
  const { t, i18n } = useTranslation()
  const width = useWindowSize()
  const isMobile = width <= 768
  const { colorMode } = useColorMode()

  const footerText = t('footer_text')
  const isEnglish = i18n.language === 'en'

  const renderHighlightedText = () => {
    if (isEnglish) {
      const parts = footerText.split(/(free|open source|software)/gi)
      return parts.map((part, index) => {
        if (
          part.toLowerCase() === 'free' ||
          part.toLowerCase() === 'open source' ||
          part.toLowerCase() === 'software'
        ) {
          return (
            <Box
              key={index}
              as="span"
              display="inline"
              px="1.5"
              py="1"
              rounded="full"
              bg={colorMode === 'dark' ? 'pink.600' : 'pink.400'}
              color={colorMode === 'dark' ? 'white' : 'fg.DEFAULT'}
              fontWeight="medium"
            >
              {part}
            </Box>
          )
        }
        return <span key={index}>{part}</span>
      })
    } else {
      const parts = footerText.split(/(برمجيات|مفتوحة|المصدر)/gi)
      return parts.map((part, index) => {
        if (part === 'برمجيات' || part === 'مفتوحة' || part === 'المصدر') {
          return (
            <Box
              key={index}
              as="span"
              display="inline"
              px="1.5"
              py="1"
              rounded="full"
              bg={colorMode === 'dark' ? 'pink.600' : 'pink.400'}
              color={colorMode === 'dark' ? 'white' : 'fg.DEFAULT'}
              fontWeight="medium"
            >
              {part}
            </Box>
          )
        }
        return <span key={index}>{part}</span>
      })
    }
  }

  return (
    <Box p={6}>
      <Box maxW="6xl" mx="auto" fontSize="xs">
        <Stack
          direction={isMobile ? 'column' : 'row'}
          textAlign={isMobile ? 'center' : 'center'}
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <Text lineHeight="2.5">{renderHighlightedText()}</Text>
          <Link
            href="https://github.com/Sudan-Digital-Archive/sudan-digital-archive-frontend"
            rounded="sm"
            color="fg.muted"
            fontWeight="bold"
            target="_blank"
            rel="noopener noreferrer"
            _hover={{ color: 'cyan.300' }}
          >
            <HStack gap={2} alignItems="center">
              <GitHub size={16} />
              <Text>Github</Text>
            </HStack>
          </Link>
        </Stack>
      </Box>
    </Box>
  )
}

export default Footer
