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
  Switch,
} from '@chakra-ui/react'
import { ArchiveCard } from '../components/ArchiveCard'
import Layout from '../components/Layout'
import { Pagination } from '../components/Pagination'
import { defaultPerPage } from '../constants'
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

  const { collections, isLoading, pagination, queryFilters, updateFilters } =
    useCollections({
      isLoggedIn,
      baseFilters,
    })

  useEffect(() => {
    i18n.changeLanguage(lang)
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, i18n])

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
              <Switch.Root
                checked={queryFilters.is_private || false}
                onCheckedChange={(e) =>
                  updateFilters({ is_private: e.checked === true })
                }
                colorPalette="cyan"
                size="lg"
                mx={2}
              >
                <Switch.HiddenInput />
                <Switch.Control />
              </Switch.Root>
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
                      to={`/collections/${collection.id}?isPrivate=${collection.is_private}&lang=${lang}`}
                    >
                      <Button
                        variant="ghost"
                        colorPalette="cyan"
                        _active={{ bg: 'cyan.700', color: 'white' }}
                        mt={4}
                      >
                        {t('collection_view_button')}
                      </Button>
                    </NavLink>
                  </Flex>
                </ArchiveCard>
              ))}
            </SimpleGrid>
          )}
          {collections && collections.items.length > 0 && !isLoading && (
            <HStack mt={6} justifyContent="center">
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
        </Box>
      </VStack>
    </Layout>
  )
}
