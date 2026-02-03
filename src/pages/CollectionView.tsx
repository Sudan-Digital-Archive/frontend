import {
  Box,
  Heading,
  Spinner,
  VStack,
  Text,
  HStack,
  Button,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useParams } from 'react-router'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout.tsx'
import { AccessionsCards } from '../components/AccessionsCards.tsx'
import { COLLECTIONS_EN, COLLECTIONS_AR } from '../constants.ts'
import { useUser } from '../hooks/useUser.ts'
import { useAccessions } from '../hooks/useAccessions.ts'

export default function CollectionView() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()

  const collections = i18n.language === 'en' ? COLLECTIONS_EN : COLLECTIONS_AR
  const collection = collections.find((c) => c.id === id)

  // Base filters from collection config (memoized to avoid changing ref every render)
  const baseFilters = useMemo(
    () => (collection ? collection.filters : {}),
    [collection],
  )

  const { updateFilters, accessions, isLoading, pagination, handleRefresh } =
    useAccessions({
      isLoggedIn,
      baseFilters,
    })

  useEffect(() => {
    if (collection) {
      updateFilters({ ...baseFilters })
    }
  }, [collection, baseFilters, updateFilters])

  if (!collection) {
    return (
      <Layout>
        <Box p={10} textAlign="center">
          <Text>{t('record_not_found')}</Text>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <VStack alignItems="center" justifyContent="center">
        <Box w="100%" p={10}>
          <Heading
            textAlign="center"
            py={2}
            bgGradient="linear(to-r, cyan.300, pink.600)"
            bgClip="text"
          >
            {collection.title}
          </Heading>
          <Text textAlign="center" mb={5} fontSize="lg">
            {collection.description}
          </Text>

          {isLoading || !accessions ? (
            <Spinner />
          ) : (
            <AccessionsCards
              accessions={accessions.items}
              onRefresh={handleRefresh}
            />
          )}
          {accessions && accessions?.items.length > 0 && !isLoading && (
            <HStack mt={3} justifyContent="center">
              {pagination.currentPage != 0 &&
                pagination.currentPage != pagination.totalPages && (
                  <Button
                    size="xs"
                    leftIcon={<ArrowLeft />}
                    colorScheme="purple"
                    variant="link"
                    onClick={() =>
                      updateFilters({
                        page: pagination.currentPage - 1,
                      })
                    }
                  />
                )}
              <Box>
                {t('archive_pagination_page')}
                <b>{pagination.currentPage + 1}</b>
                {t('archive_pagination_page_out_of')}
                <b>{pagination.totalPages}</b>
              </Box>
              {pagination.currentPage + 1 < pagination.totalPages && (
                <Button
                  size="xs"
                  leftIcon={<ArrowRight />}
                  colorScheme="purple"
                  variant="link"
                  onClick={() =>
                    updateFilters({
                      page: pagination.currentPage + 1,
                    })
                  }
                />
              )}
            </HStack>
          )}
          {!isLoading && accessions && accessions.items.length === 0 && (
            <Box mt={3} as="i">
              {t('archive_no_records_found')}
            </Box>
          )}
        </Box>
      </VStack>
    </Layout>
  )
}
