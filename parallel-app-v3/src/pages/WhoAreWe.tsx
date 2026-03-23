'use client'

import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
export default function WhoAreWe() {
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
            <Heading as="h5" fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('who_are_we_heading')}
            </Heading>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('who_are_we_para_1')}
            </Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('who_are_we_para_2')}
            </Text>
            <ol>
              <li>
                <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'} as="b">
                  {t('who_are_we_point_one')}
                </Text>
                {t('who_are_we_point_one_description')}
              </li>
              <li>
                <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'} as="b">
                  {t('who_are_we_point_two')}
                </Text>
                {t('who_are_we_point_two_description_one')}
                <NavLink
                  to="/code-of-conduct"
                  style={{ color: '#22d3ee', textDecoration: 'underline' }}
                >
                  {t('who_are_we_point_two_coc_link')}
                </NavLink>
                {t('who_are_we_point_two_description_two')}
              </li>
              <li>
                <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'} as="b">
                  {t('who_are_we_point_three')}
                </Text>
                {t('who_are_we_point_three_description')}
              </li>
            </ol>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
