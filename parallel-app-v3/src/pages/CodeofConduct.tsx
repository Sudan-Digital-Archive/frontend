'use client'

import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'

export default function CodeofConduct() {
  const { t, i18n } = useTranslation()

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
        <VStack gap={4} align="left">
          <Heading
            textAlign="center"
            py={2}
            bgGradient="linear(to-r, cyan.300, pink.600)"
            bgClip="text"
          >
            {t('code_of_conduct_title')}
          </Heading>

          <Heading as="h4" fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
            {t('code_of_conduct_our_values_content_heading')}
          </Heading>

          <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
            {t('code_of_conduct_standards_inappropriate_behavior_para_one')}
          </Text>

          <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
            {t('code_of_conduct_standards_inappropriate_behavior_para_two')}
          </Text>

          <Heading as="h5" fontSize={i18n.language === 'en' ? 'md' : 'xl'}>
            {t('code_of_conduct_boundaries_heading')}
          </Heading>

          <Heading as="h5" fontSize={i18n.language === 'en' ? 'md' : 'xl'}>
            {t('code_of_conduct_accountability_processes_heading')}
          </Heading>
        </VStack>
      </Box>
    </Layout>
  )
}
