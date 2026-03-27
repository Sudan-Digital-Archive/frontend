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
  Checkbox,
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

  const lang = searchParams.get('lang') || i18n.language
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
              <Checkbox.Root
                checked={isPrivate}
                onCheckedChange={(e) =>
                  updateFilters({ is_private: e.checked === true })
                }
                mx={2}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label />
              </Checkbox.Root>
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
            <SimpleGrid minChildWidth="320px" gap={10} my={5} px={5}>
              {collections.items.map((collection) => (
                <ArchiveCard key={`collection-card-${collection.id}`}>
                  <Flex
                    direction="column"
                    p={4}
                    flex={1}
                    justifyContent="space-between"
                    minH="200px"
                  >
                    <Box>
                      <Heading size="md" mb={2} lineClamp={2}>
                        {collection.title}
                      </Heading>
                      <Text lineClamp={3}>{collection.description}</Text>
                    </Box>
                    <NavLink
                      to={`/collections/${collection.id}?isPrivate=${collection.is_private}`}
                    >
                      <Button variant="ghost" colorPalette="cyan" mt={4}>
                        {t('collection_view_button')}
                      </Button>
                    </NavLink>
                  </Flex>
                </ArchiveCard>
              ))}
            </SimpleGrid>
          )}
          {collections && collections.items.length > 0 && !isLoading && (
            <HStack mt={3} justifyContent="center" gap={2}>
              {pagination.currentPage !== 0 && (
                <Button
                  size="xs"
                  colorPalette="pink"
                  variant="ghost"
                  onClick={handlePreviousPage}
                >
                  {i18n.language === 'ar' ? (
                    <ArrowRight size={14} />
                  ) : (
                    <ArrowLeft size={14} />
                  )}
                  {t('collections_pagination_previous')}
                </Button>
              )}
              {pagination.currentPage + 1 < pagination.totalPages && (
                <Button
                  size="xs"
                  colorPalette="pink"
                  variant="ghost"
                  onClick={handleNextPage}
                >
                  {t('collections_pagination_next')}
                  {i18n.language === 'ar' ? (
                    <ArrowLeft size={14} />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </Button>
              )}
            </HStack>
          )}
        </Box>
      </VStack>
    </Layout>
  )
}
