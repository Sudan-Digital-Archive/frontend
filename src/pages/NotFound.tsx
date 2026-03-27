'use client'

import { VStack, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import Layout from '../components/Layout'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <Layout>
      <VStack gap={6} textAlign="center" py={16}>
        <Heading size="2xl">404</Heading>
        <Text>{t('not_found_message')}</Text>
        <NavLink to="/">
          <Text color="cyan.400">{t('not_found_go_home')}</Text>
        </NavLink>
      </VStack>
    </Layout>
  )
}
