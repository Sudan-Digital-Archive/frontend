import { Box, Spinner, VStack, Text, HStack } from '@chakra-ui/react'
import { useParams, useSearchParams } from 'react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Layout from '../components/Layout'
import { CollectionHeader } from '../components/CollectionHeader'
import { AccessionsCards } from '../components/AccessionsCards'
import { ArchiveFilters } from '../components/ArchiveFilters'
import { Pagination } from '../components/Pagination'
import { defaultPerPage } from '../constants'
import { useUser } from '../hooks/useUser'
import { useAccessions } from '../hooks/useAccessions'
import { appConfig } from '../constants'
import type { Collection } from '../apiTypes/apiResponses'

export default function CollectionView() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()
  const [searchParams] = useSearchParams()

  const lang = searchParams.get('lang') || i18n.language
  const isPrivate = searchParams.get('isPrivate') === 'true'

  const [collection, setCollection] = useState<Collection | null>(null)
  const [isLoadingCollection, setIsLoadingCollection] = useState(true)
  const [accessionsEnabled, setAccessionsEnabled] = useState(false)

  const {
    queryFilters,
    updateFilters,
    accessions,
    isLoading,
    pagination,
    handleRefresh,
  } = useAccessions({
    isLoggedIn,
    baseFilters: {
      lang: lang === 'en' ? 'english' : 'arabic',
      is_private: false,
      in_collection_id: id ? parseInt(id, 10) : undefined,
    },
    enabled: accessionsEnabled,
  })

  useEffect(() => {
    i18n.changeLanguage(lang)
    switch (lang) {
      case 'en':
        document.documentElement.lang = 'en'
        document.documentElement.dir = 'ltr'
        break
      case 'ar':
        document.documentElement.lang = 'ar'
        document.documentElement.dir = 'rtl'
        break
    }
  }, [lang, i18n])

  useEffect(() => {
    if (isPrivate && isLoggedIn) {
      updateFilters({ is_private: true })
    }
  }, [isPrivate, isLoggedIn, updateFilters])

  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return

      try {
        const collectionLang = lang === 'en' ? 'english' : 'arabic'
        const endpoint =
          isLoggedIn && isPrivate
            ? `${appConfig.apiURL}collections/private/${id}?lang=${collectionLang}`
            : `${appConfig.apiURL}collections/${id}?lang=${collectionLang}`
        const response = await fetch(endpoint, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        })
        if (response.ok) {
          const data: Collection = await response.json()
          setCollection(data)
          updateFilters({
            metadata_subjects: data.subject_ids,
            metadata_subjects_inclusive_filter: false,
          })
        } else {
          setCollection(null)
        }
      } catch (error) {
        console.error('Error fetching collection:', error)
        setCollection(null)
      } finally {
        setIsLoadingCollection(false)
        setAccessionsEnabled(true)
      }
    }

    fetchCollection()
  }, [id, isLoggedIn, isPrivate, lang, updateFilters])

  if (isLoadingCollection) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <Spinner />
        </Box>
      </Layout>
    )
  }

  if (!collection) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <Text>{t('record_not_found')}</Text>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout
      changeLanguageOverride={() => {
        const newLanguage = i18n.language === 'en' ? 'ar' : 'en'
        i18n.changeLanguage(newLanguage)
        switch (newLanguage) {
          case 'en':
            document.documentElement.lang = 'en'
            document.documentElement.dir = 'ltr'
            break
          case 'ar':
            document.documentElement.lang = 'ar'
            document.documentElement.dir = 'rtl'
            break
        }
      }}
    >
      <VStack alignItems="center" justifyContent="center">
        <Box w="100%" p={10}>
          <CollectionHeader collection={collection} />

          <Box mt={8}>
            <ArchiveFilters
              queryFilters={queryFilters}
              updateFilters={updateFilters}
              isLoggedIn={isLoggedIn}
              lockedSubjectIds={collection.subject_ids}
              collectionId={collection.id}
            />
          </Box>
        </Box>

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
            <Pagination
              count={
                pagination.totalPages *
                (queryFilters.per_page || defaultPerPage)
              }
              pageSize={queryFilters.per_page || defaultPerPage}
              page={pagination.currentPage + 1}
              onPageChange={(newPage) => updateFilters({ page: newPage - 1 })}
              onPageSizeChange={(newPerPage) => {
                updateFilters({ per_page: newPerPage, page: 0 })
              }}
            />
          </HStack>
        )}
      </VStack>
    </Layout>
  )
}
