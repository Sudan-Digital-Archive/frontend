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
  Switch,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { ArchiveCard } from '../components/ArchiveCard'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo } from 'react'
import { useCollections } from '../hooks/useCollections'
import { useUser } from '../hooks/useUser'
import { useSearchParams, NavLink } from 'react-router'
import { SubjectsAutocomplete } from '../components/Autocomplete/SubjectsAutocomplete'
import { CreatorsAutocomplete } from '../components/Autocomplete/CreatorsAutocomplete'
import { LocationsAutocomplete } from '../components/Autocomplete/LocationsAutocomplete'
import { ContributorsAutocomplete } from '../components/Autocomplete/ContributorsAutocomplete'
import { ContributorRolesAutocomplete } from '../components/Autocomplete/ContributorRolesAutocomplete'
import type { AutocompleteOption } from '../components/Autocomplete/GenericAutocomplete'

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

  const { collections, isLoading, pagination, updateFilters, queryFilters } =
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

          <Box py={5} width="100%">
            <SubjectsAutocomplete
              menuPlacement="top"
              value={
                queryFilters.metadata_subjects?.map((id) => ({
                  value: id,
                  label: String(id),
                })) || []
              }
              onChange={(subjects) => {
                updateFilters({
                  metadata_subjects: subjects.map((s) => s.value),
                })
              }}
            />
            {Array.isArray(queryFilters.metadata_subjects) &&
              queryFilters.metadata_subjects.length > 0 && (
                <Flex alignItems="center" mt={2}>
                  <Badge colorPalette="cyan" fontSize="sm" py={1} px={2} mr={2}>
                    {queryFilters.metadata_subjects_inclusive_filter
                      ? t('exclusive')
                      : t('inclusive')}
                  </Badge>
                  <Switch.Root
                    checked={
                      queryFilters.metadata_subjects_inclusive_filter || false
                    }
                    onCheckedChange={(e) => {
                      updateFilters({
                        metadata_subjects_inclusive_filter: e.checked === true,
                      })
                    }}
                    size="lg"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                </Flex>
              )}
          </Box>

          <Box py={5} width="100%">
            <CreatorsAutocomplete
              menuPlacement="top"
              value={
                queryFilters.metadata_creators?.map((id) => ({
                  value: id,
                  label: String(id),
                })) || []
              }
              onChange={(creators: readonly AutocompleteOption[]) => {
                updateFilters({
                  metadata_creators: creators.map((c) => c.value),
                })
              }}
            />
          </Box>

          <Box py={5} width="100%">
            <LocationsAutocomplete
              menuPlacement="top"
              value={
                queryFilters.metadata_locations?.map((id) => ({
                  value: id,
                  label: String(id),
                })) || []
              }
              onChange={(locations: readonly AutocompleteOption[]) => {
                updateFilters({
                  metadata_locations: locations.map((l) => l.value),
                })
              }}
            />
          </Box>

          <Box py={5} width="100%">
            <ContributorsAutocomplete
              menuPlacement="top"
              value={
                queryFilters.metadata_contributors?.map((id) => ({
                  value: id,
                  label: String(id),
                })) || []
              }
              onChange={(contributors: readonly AutocompleteOption[]) => {
                updateFilters({
                  metadata_contributors: contributors.map((c) => c.value),
                })
              }}
            />
            {Array.isArray(queryFilters.metadata_contributors) &&
              queryFilters.metadata_contributors.length > 0 && (
                <Flex alignItems="center" mt={2}>
                  <Badge colorPalette="cyan" fontSize="sm" py={1} px={2} mr={2}>
                    {queryFilters.metadata_contributors_inclusive_filter
                      ? t('exclusive')
                      : t('inclusive')}
                  </Badge>
                  <Switch.Root
                    checked={
                      queryFilters.metadata_contributors_inclusive_filter ||
                      false
                    }
                    onCheckedChange={(e) => {
                      updateFilters({
                        metadata_contributors_inclusive_filter:
                          e.checked === true,
                      })
                    }}
                    size="lg"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                </Flex>
              )}
          </Box>

          <Box py={5} width="100%">
            <ContributorRolesAutocomplete
              menuPlacement="top"
              value={
                queryFilters.metadata_contributor_roles?.map((id) => ({
                  value: id,
                  label: String(id),
                })) || []
              }
              onChange={(roles: readonly AutocompleteOption[]) => {
                updateFilters({
                  metadata_contributor_roles: roles.map((r) => r.value),
                })
              }}
            />
            {Array.isArray(queryFilters.metadata_contributor_roles) &&
              queryFilters.metadata_contributor_roles.length > 0 && (
                <Flex alignItems="center" mt={2}>
                  <Badge colorPalette="cyan" fontSize="sm" py={1} px={2} mr={2}>
                    {queryFilters.metadata_contributor_roles_inclusive_filter
                      ? t('exclusive')
                      : t('inclusive')}
                  </Badge>
                  <Switch.Root
                    checked={
                      queryFilters.metadata_contributor_roles_inclusive_filter ||
                      false
                    }
                    onCheckedChange={(e) => {
                      updateFilters({
                        metadata_contributor_roles_inclusive_filter:
                          e.checked === true,
                      })
                    }}
                    size="lg"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Root>
                </Flex>
              )}
          </Box>

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
            <HStack mt={3} justifyContent="center" gap={2}>
              {pagination.currentPage !== 0 && (
                <Button
                  size="xs"
                  colorPalette="pink"
                  variant="ghost"
                  _active={{ bg: 'pink.700', color: 'white' }}
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
                  _active={{ bg: 'pink.700', color: 'white' }}
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
