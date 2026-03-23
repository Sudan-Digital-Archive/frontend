'use client'

import { Heading, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import { Link } from 'react-router'

export default function CollectionView() {
  const { t } = useTranslation()

  return (
    <Layout>
      <VStack alignItems="center" justifyContent="center" py={16}>
        <Heading size="xl">{t('collections_title')}</Heading>
        <Text>Collection view coming soon...</Text>
        <Link to="/collections">
          <Text color="cyan.400">{t('collection_view_button')}</Text>
        </Link>
      </VStack>
    </Layout>
  )
}
