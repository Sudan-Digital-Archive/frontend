'use client'

import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

export default function WhoAreWe() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
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
        <Box>
          <VStack gap={2} align="left">
            <Heading
              textAlign="center"
              py={2}
              bgGradient="linear(to-r, cyan.300, pink.600)"
              bgClip="text"
            >
              {t('who_are_we_title')}
            </Heading>
            <Heading as="h5" fontSize={fontSize}>
              {t('who_are_we_heading')}
            </Heading>
            <Text fontSize={fontSize}>{t('who_are_we_para_1')}</Text>
            <Text fontSize={fontSize}>{t('who_are_we_para_2')}</Text>
            <ol>
              <li>
                <Text fontSize={fontSize} as="b">
                  {t('who_are_we_point_one')}
                </Text>
                {t('who_are_we_point_one_description')}
              </li>
              <li>
                <Text fontSize={fontSize} as="b">
                  {t('who_are_we_point_two')}
                </Text>
                {t('who_are_we_point_two_description_one')}
                <Text
                  color="cyan"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => navigate('/code-of-conduct')}
                >
                  {t('who_are_we_point_two_coc_link')}
                </Text>
                {t('who_are_we_point_two_description_two')}
              </li>
              <li>
                <Text fontSize={fontSize} as="b">
                  {t('who_are_we_point_three')}
                </Text>
                {t('who_are_we_point_three_description')}
              </li>
            </ol>
            <Text fontSize={fontSize}></Text>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
