'use client'

import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t, i18n } = useTranslation()

  return (
    <Layout>
      <Box
        as="section"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        maxW="2xl"
        mx="auto"
        pt={10}
        pb={5}
        px={4}
      >
        <VStack gap={8}>
          <Box>
            <Text
              className="gradientText"
              fontSize="6xl"
              fontWeight="extrabold"
            >
              {t('landing_heading')}
            </Text>
          </Box>
          <Box>
            <Heading
              as="h2"
              size={i18n.language === 'en' ? 'lg' : '2xl'}
              lineHeight="tall"
              fontWeight="medium"
              color="fg.muted"
            >
              {t('landing_sentence_one_part_one')}
              <Text as="span" color="accent.secondary">
                {t('landing_sentence_one_part_two_highlight')}
              </Text>
              {t('landing_sentence_one_part_three')}
              {t('landing_sentence_two_part_one')}
              <Text as="span" color="accent.secondary">
                {t('landing_sentence_two_part_two_highlight')}
              </Text>
              {t('landing_sentence_two_part_three')}
              <Text as="span" color="accent.secondary">
                {t('landing_sentence_two_part_four_highlight')}
              </Text>
              {t('landing_sentence_two_part_five')}
              <Text as="span" color="accent.primary">
                {t('landing_sentence_two_part_six_highlight')}
              </Text>
              {t('landing_sentence_two_part_seven')}
              <Text as="span" color="accent.primary">
                {t('landing_sentence_two_part_eight_highlight')}
              </Text>
              {t('landing_sentence_two_part_nine')}
            </Heading>
          </Box>
        </VStack>
      </Box>
    </Layout>
  )
}
