'use client'

import { Box, Heading, Button, Text, VStack } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'

export default function ContactUs() {
  const { t } = useTranslation()
  const email = 'info@sudandigitalarchive.com'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch (err) {
      console.error('Failed to copy!', err)
    }
  }

  return (
    <Layout>
      <Box
        as="section"
        display="flex"
        alignItems="center"
        justifyContent="center"
        maxW="2xl"
        mx="auto"
        pt={10}
      >
        <VStack gap={8}>
          <Heading
            textAlign="center"
            className="gradientText"
            bgClip="text"
            fontSize="4xl"
          >
            {t('get_in_touch')}
          </Heading>
          <Button
            colorPalette="cyan"
            size="md"
            variant="ghost"
            onClick={handleCopy}
          >
            <Text as="i" mx={2}>
              {email}
            </Text>
          </Button>
        </VStack>
      </Box>
    </Layout>
  )
}
