'use client'

import {
  Box,
  Button,
  VStack,
  Text,
  HStack,
  Spinner,
  SimpleGrid,
  Heading,
  Flex,
  Input,
} from '@chakra-ui/react'
import { ArchiveCard } from '../components/ArchiveCard'
import {
  DateMetadata,
  Title,
  Description,
  OriginalURL,
  Subject,
} from '../components/metadata'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import { useAccessions } from '../hooks/useAccessions'
import { useUser } from '../hooks/useUser'
import { NavLink } from 'react-router'

export default function Archive() {
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()
  const [queryTerm, setQueryTerm] = useState('')

  const baseFilters = useMemo(
    () => ({
      lang: i18n.language === 'en' ? 'english' : 'arabic',
      query_term: '',
      metadata_subjects: [],
      metadata_subjects_inclusive_filter: true,
      is_private: false,
      url_filter: '',
    }),
    [i18n.language],
  )

  const { updateFilters, accessions, isLoading, pagination } = useAccessions({
    isLoggedIn,
    baseFilters,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ query_term: queryTerm })
    }, 300)
    return () => clearTimeout(timer)
  }, [queryTerm, updateFilters])

  return (
    <Layout
      changeLanguageOverride={() => {
        const newLanguage = i18n.language === 'en' ? 'ar' : 'en'
        i18n.changeLanguage(newLanguage)
        document.documentElement.lang = newLanguage
        document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr'
        updateFilters({ lang: newLanguage === 'en' ? 'english' : 'arabic' })
      }}
    >
      <VStack alignItems="center" justifyContent="center">
        <Box w="100%" p={10}>
          <Heading
            textAlign="center"
            py={2}
            bgGradient="linear(to-r, cyan.300, pink.600)"
            bgClip="text"
            mb={10}
          >
            {t('archive_header')}
          </Heading>

          <Input
            value={queryTerm}
            onChange={(e) => setQueryTerm(e.target.value)}
            placeholder={t('archive_text_search_query_placeholder')}
            size="lg"
            mb={5}
          />
        </Box>

        {isLoading || !accessions ? (
          <Spinner />
        ) : accessions.items.length === 0 ? (
          <Text>{t('archive_no_records_found')}</Text>
        ) : (
          <SimpleGrid gap={10} columns={{ sm: 1, md: 2, lg: 3 }} my={5} mx={5}>
            {accessions.items.map((accession, index) => {
              const title =
                i18n.language === 'en' ? accession.title_en : accession.title_ar
              const description =
                i18n.language === 'en'
                  ? accession.description_en
                  : accession.description_ar
              const subjects =
                i18n.language === 'en'
                  ? accession.subjects_en
                  : accession.subjects_ar

              return (
                <ArchiveCard key={`accession-card-${index}`}>
                  <Box p={4}>
                    <Title
                      title={title || t('metadata_missing_title')}
                      fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                      truncate
                    />
                    {description && (
                      <Description
                        description={description}
                        fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                        truncate
                      />
                    )}
                    <DateMetadata
                      date={accession.dublin_metadata_date}
                      fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                    />
                    <Subject subjects={subjects} />
                    <OriginalURL
                      url={accession.seed_url}
                      fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                    />
                    <Flex mt={4} justifyContent="space-between">
                      <NavLink to={`/archive/${accession.id}`}>
                        <Button colorPalette="purple">
                          {t('archive_view_record_button')}
                        </Button>
                      </NavLink>
                    </Flex>
                  </Box>
                </ArchiveCard>
              )
            })}
          </SimpleGrid>
        )}

        {accessions && accessions.items.length > 0 && !isLoading && (
          <HStack mt={3}>
            {pagination.currentPage !== 0 && (
              <Button
                size="xs"
                colorPalette="purple"
                variant="ghost"
                onClick={() =>
                  updateFilters({ page: pagination.currentPage - 1 })
                }
              >
                Previous
              </Button>
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
                colorPalette="purple"
                variant="ghost"
                onClick={() =>
                  updateFilters({ page: pagination.currentPage + 1 })
                }
              >
                Next
              </Button>
            )}
          </HStack>
        )}
      </VStack>
    </Layout>
  )
}
