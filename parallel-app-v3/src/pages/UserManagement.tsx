'use client'

import { Heading, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import Layout from '../components/Layout'

export default function UserManagement() {
  const { t } = useTranslation()

  return (
    <Layout>
      <VStack alignItems="center" justifyContent="center" py={16}>
        <Heading size="xl">{t('user_management_title')}</Heading>
        <Text>User management coming soon...</Text>
        <Link to="/">
          <Text color="cyan.400">Back to Home</Text>
        </Link>
      </VStack>
    </Layout>
  )
}
