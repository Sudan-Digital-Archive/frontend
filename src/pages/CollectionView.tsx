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
import { useParams, useSearchParams } from 'react-router'
import { useEffect, useState } from 'react'
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
  const [searchParams, setSearchParams] = useSearchParams()

  const lang = searchParams.get('lang') || 'en'
  const isPrivate = searchParams.get('isPrivate') === 'true'

  // Ensure isPrivate is always explicitly in the URL
  useEffect(() => {
    if (searchParams.get('isPrivate') === null) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('isPrivate', 'false')
      setSearchParams(newParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

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
      is_private: isPrivate,
    },
    enabled: accessionsEnabled,
  })

  // Sync i18n with URL lang param
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
      default:
        throw `Language ${lang} is not supported`
    }
  }, [lang, i18n])

  // Fetch collection by ID from the API
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
  }, [id, lang, isPrivate, isLoggedIn, updateFilters])

  if (isPrivate && !isLoggedIn) {
    return (
      <Layout>
        <Box p={10} textAlign="center">
          <Text>{t('login_required')}</Text>
        </Box>
      </Layout>
    )
  }

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
    <Layout
      changeLanguageOverride={() => {
        const newLanguage = i18n.language === 'en' ? 'ar' : 'en'
        const newParams = new URLSearchParams(searchParams)
        newParams.set('lang', newLanguage)
        setSearchParams(newParams, { replace: true })
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
          default:
            throw `Language ${newLanguage} is not supported`
        }
        updateFilters({
          lang: newLanguage === 'en' ? 'english' : 'arabic',
        })
      }}
    >
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
            lockedSubjectIds={collection.subject_ids}
            isLoggedIn={isLoggedIn}
            collectionId={collection.id}
          />

          {isLoading || !accessions ? (
            <Box py={10} display="flex" justifyContent="center">
              <Spinner />
            </Box>
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
