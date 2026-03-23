'use client'

import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'

export default function TechnicalStack() {
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
        <Box>
          <VStack gap={2} align="left">
            <Heading
              textAlign="center"
              py={2}
              bgGradient="linear(to-r, cyan.300, pink.600)"
              bgClip="text"
            >
              {t('tech_stack_title')}
            </Heading>

            <Heading as="h6" fontSize={fontSize}>
              {t('tech_stack_why_build')}
              <a
                href="https://archive.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#67e8f9', textDecoration: 'underline' }}
              >
                archive.org
              </a>
              {t('tech_stack_why_build_2')}
            </Heading>
            <ol>
              <li>
                <Text fontSize={fontSize}>
                  {t('tech_stack_point_1_part_1')}
                  <a
                    href="https://archive.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#67e8f9', textDecoration: 'underline' }}
                  >
                    archive.org
                  </a>
                  {t('tech_stack_point_1_part_2')}
                </Text>
              </li>
              <li>
                <Text fontSize={fontSize}>
                  {t('tech_stack_point_2_part_1')}
                  <a
                    href="https://bayanat.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#67e8f9', textDecoration: 'underline' }}
                  >
                    bayanat.org
                  </a>
                  {t('tech_stack_point_2_part_2')}
                </Text>
              </li>
              <li>
                <Text fontSize={fontSize}>
                  {t('tech_stack_point_3_part_1')}
                  <a
                    href="https://browsertrix.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#67e8f9', textDecoration: 'underline' }}
                  >
                    browsertrix
                  </a>
                  {t('tech_stack_point_3_part_2')}
                </Text>
              </li>
            </ol>
            <Text fontSize={fontSize}>
              {t('tech_stack_final_part_1')}
              <a
                href="https://github.com/orgs/Sudan-Digital-Archive/repositories"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#67e8f9', textDecoration: 'underline' }}
              >
                {t('tech_stack_final_link')}
              </a>
              {t('tech_stack_final_part_2')}
            </Text>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
