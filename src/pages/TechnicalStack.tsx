'use client'

import { Box, VStack, Heading, Text, List } from '@chakra-ui/react'
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
        <Box width="100%">
          <VStack gap={4} align="stretch">
            <Heading
              textAlign="center"
              py={4}
              className="gradientTextStatic"
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="bold"
            >
              {t('tech_stack_title')}
            </Heading>

            <Heading as="h6" fontSize={fontSize} fontWeight="semibold">
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
            <List.Root as="ol" listStyle="decimal">
              <List.Item fontSize={fontSize}>
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
              </List.Item>
              <List.Item fontSize={fontSize}>
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
              </List.Item>
              <List.Item fontSize={fontSize}>
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
              </List.Item>
            </List.Root>
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
