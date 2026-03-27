'use client'

import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'

export default function WhyAnotherArchive() {
  const { t, i18n } = useTranslation()
  const fontSize = i18n.language === 'en' ? 'lg' : '2xl'

  return (
    <Layout>
      <Box
        as="section"
        display="flex"
        alignItems="center"
        maxW="2xl"
        mx="auto"
        px={4}
      >
        <Box width="100%">
          <VStack gap={4} align="stretch">
            <Heading
              textAlign="center"
              py={4}
              className="gradientTextStatic"
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="bold"
            >
              {t('why_another_archive_title')}
            </Heading>

            <Heading as="h6" fontSize={fontSize} fontWeight="semibold">
              {t('why_another_archive_heading')}
            </Heading>
            <Text fontSize={fontSize}>{t('why_another_archive_para_one')}</Text>
            <Text fontSize={fontSize}>{t('why_another_archive_para_two')}</Text>
            <Text fontSize={fontSize}>
              {t('why_another_archive_para_three')}
            </Text>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
