'use client'

import {
  Box,
  Button,
  VStack,
  HStack,
  Spinner,
  Heading,
  Flex,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, Plus } from 'react-feather'
import { CreateUpdateAccession } from '../components/forms/CreateUpdateAccession'
import Layout from '../components/Layout'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessionsCards } from '../components/AccessionsCards'
import { ArchiveFilters } from '../components/ArchiveFilters'
import { useUser } from '../hooks/useUser'
import { useAccessions } from '../hooks/useAccessions'

export default function Archive() {
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
  })

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
        updateFilters({ lang: newLanguage === 'en' ? 'english' : 'arabic' })
      }}
    >
      <VStack alignItems="center" justifyContent="center">
        {isLoggedIn && (
          <Button
            colorPalette="pink"
            onClick={() => setIsModalOpen(true)}
            my={4}
          >
            <Plus size={16} style={{ marginRight: '4px' }} />
            {t('archive_add_record')}
          </Button>
        )}
        <Box w="100%" p={10}>
          <ArchiveFilters
            queryFilters={queryFilters}
            updateFilters={updateFilters}
            isLoggedIn={isLoggedIn}
          />
        </Box>

        {isModalOpen && (
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.700"
            zIndex={1000}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
          >
            <Box
              bg="gray.800"
              p={6}
              borderRadius="md"
              maxW="600px"
              w="100%"
              maxH="90vh"
              overflowY="auto"
            >
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Heading size="md">{t('archive_create_modal_header')}</Heading>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  ✕
                </Button>
              </Flex>
              {isLoggedIn ? <CreateUpdateAccession /> : null}
            </Box>
          </Box>
        )}

        {isLoading || !accessions ? (
          <Spinner />
        ) : (
          <AccessionsCards
            accessions={accessions.items}
            onRefresh={handleRefresh}
          />
        )}
        {accessions && accessions?.items.length > 0 && !isLoading && (
          <HStack mt={3}>
            {pagination.currentPage !== 0 && (
              <Button
                size="xs"
                colorPalette="purple"
                variant="ghost"
                onClick={() =>
                  updateFilters({
                    page: pagination.currentPage - 1,
                  })
                }
              >
                <ArrowLeft size={14} style={{ marginRight: '4px' }} />
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
                  updateFilters({
                    page: pagination.currentPage + 1,
                  })
                }
              >
                Next
                <ArrowRight size={14} style={{ marginLeft: '4px' }} />
              </Button>
            )}
          </HStack>
        )}
        {!isLoading && accessions && accessions.items.length === 0 && (
          <Box mt={3} as="i">
            {t('archive_no_records_found')}
          </Box>
        )}
      </VStack>
    </Layout>
  )
}
