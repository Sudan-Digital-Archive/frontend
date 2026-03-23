'use client'

import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  VStack,
  Text,
  HStack,
  Spinner,
  Flex,
  Badge,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { ArchiveCard } from '../components/ArchiveCard'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import { useCollections } from '../hooks/useCollections'
import { useUser } from '../hooks/useUser'
import { useSearchParams, NavLink } from 'react-router'

export default function Collections() {
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()
  const [searchParams] = useSearchParams()

  const lang = searchParams.get('lang') || 'en'
  const isPrivate = searchParams.get('isPrivate') === 'true'

  const baseFilters = useMemo(
    () => ({
      lang: lang === 'en' ? 'english' : 'arabic',
      is_private: isPrivate,
    }),
    [lang, isPrivate],
  )

  const { collections, isLoading, pagination, updateFilters } = useCollections({
    isLoggedIn,
    baseFilters,
  })

  useEffect(() => {
    i18n.changeLanguage(lang)
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, i18n])

  const handlePreviousPage = () => {
    updateFilters({ page: pagination.currentPage - 1 })
  }

  const handleNextPage = () => {
    updateFilters({ page: pagination.currentPage + 1 })
  }

  return (
    <Layout
      changeLanguageOverride={() => {
        const newLanguage = i18n.language === 'en' ? 'ar' : 'en'
        i18n.changeLanguage(newLanguage)
        document.documentElement.lang = newLanguage
        document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr'
        updateFilters({
          lang: newLanguage === 'en' ? 'english' : 'arabic',
        })
      }}
    >
      <VStack alignItems="center" justifyContent="center">
        <Box w="100%" maxW="6xl" p={10} mx="auto">
          <Heading
            textAlign="center"
            py={4}
            className="gradientTextStatic"
            fontSize={{ base: '3xl', md: '5xl' }}
            fontWeight="bold"
            mb={10}
          >
            {t('collections_title')}
          </Heading>
          {isLoggedIn && (
            <Flex mb={5} alignItems="center" justifyContent="center">
              <Badge colorPalette="cyan">
                {t('archive_filter_private_records')}
              </Badge>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) =>
                  updateFilters({ is_private: e.target.checked })
                }
                style={{ margin: '8px' }}
              />
            </Flex>
          )}
          {isLoading || !collections ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={10}
            >
              <Spinner />
            </Box>
          ) : collections.items.length === 0 ? (
            <Text textAlign="center" fontSize="xl">
              {t('collections_empty')}
            </Text>
          ) : (
            <SimpleGrid
              gap={10}
              columns={{ sm: 1, md: 2, lg: 3 }}
              my={5}
              mx={5}
            >
              {collections.items.map((collection) => (
                <ArchiveCard key={`collection-card-${collection.id}`}>
                  <Box p={4}>
                    <Heading size="md" mb={2}>
                      {collection.title}
                    </Heading>
                    <Text mb={4} lineClamp={3}>
                      {collection.description}
                    </Text>
                    <NavLink
                      to={`/collections/${collection.id}?isPrivate=${collection.is_private}`}
                    >
                      <Button colorPalette="purple">
                        {t('collection_view_button')}
                      </Button>
                    </NavLink>
                  </Box>
                </ArchiveCard>
              ))}
            </SimpleGrid>
          )}
          {collections && collections.items.length > 0 && !isLoading && (
            <HStack mt={3} justifyContent="center">
              {pagination.currentPage !== 0 && (
                <Button
                  size="xs"
                  colorPalette="purple"
                  variant="ghost"
                  onClick={handlePreviousPage}
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
                  onClick={handleNextPage}
                >
                  Next
                  <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                </Button>
              )}
            </HStack>
          )}
        </Box>
      </VStack>
    </Layout>
  )
}
