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
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout.tsx'
import { AccessionsCards } from '../components/AccessionsCards.tsx'
import { ArchiveFilters } from '../components/ArchiveFilters.tsx'
import { useUser } from '../hooks/useUser.ts'
import { useAccessions } from '../hooks/useAccessions.ts'
import { appConfig } from '../constants.ts'
import type { Collection } from '../apiTypes/apiResponses.ts'

export default function CollectionView() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()

  const [collection, setCollection] = useState<Collection | null>(null)
  const [isLoadingCollection, setIsLoadingCollection] = useState(true)

  // Fetch collection by ID from the API
  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return

      try {
        const lang = i18n.language === 'en' ? 'english' : 'arabic'
        const response = await fetch(
          `${appConfig.apiURL}collections/${id}?lang=${lang}`,
          {
            credentials: 'include',
            headers: {
              Accept: 'application/json',
            },
          },
        )
        if (response.ok) {
          const data: Collection = await response.json()
          setCollection(data)
        } else {
          setCollection(null)
        }
      } catch (error) {
        console.error('Error fetching collection:', error)
        setCollection(null)
      } finally {
        setIsLoadingCollection(false)
      }
    }

    fetchCollection()
  }, [id, i18n.language])

  // Base filters from collection config
  // Rule: An accession exists in a given collection iff it has ALL the subject ids
  // present in that collection. This is an inclusive filter where the accession
  // must match ALL collection subject_ids.
  const baseFilters = useMemo(() => {
    if (!collection) return {}
    return {
      lang: i18n.language === 'en' ? 'english' : 'arabic',
      metadata_subjects: collection.subject_ids,
      metadata_subjects_inclusive_filter: true,
    }
  }, [collection, i18n.language])

  const {
    queryFilters,
    updateFilters,
    accessions,
    isLoading,
    pagination,
    handleRefresh,
  } = useAccessions({
    isLoggedIn,
    baseFilters,
    enabled: !!collection && collection.subject_ids.length > 0,
  })

  if (isLoadingCollection) {
    return (
      <Layout>
        <Box p={10} textAlign="center">
          <Spinner />
        </Box>
      </Layout>
    )
  }

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

          <ArchiveFilters
            queryFilters={queryFilters}
            updateFilters={updateFilters}
            showSubjectFilters={false}
            isLoggedIn={isLoggedIn}
          />

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
              {pagination.currentPage !== 0 && (
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
