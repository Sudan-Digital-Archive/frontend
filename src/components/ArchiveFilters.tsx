import { Box, Input, Flex, Badge, Switch, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArchiveDatePicker } from './DatePicker'
import { SubjectsAutocomplete } from './Autocomplete/SubjectsAutocomplete'
import { CreatorsAutocomplete } from './Autocomplete/CreatorsAutocomplete'
import { LocationsAutocomplete } from './Autocomplete/LocationsAutocomplete'
import { ContributorsAutocomplete } from './Autocomplete/ContributorsAutocomplete'
import { ContributorRolesAutocomplete } from './Autocomplete/ContributorRolesAutocomplete'
import type { AccessionsQueryFilters } from '../apiTypes/apiRequests'
import { useColorMode } from './ui/color-mode'
import { ChevronDown, ChevronUp } from 'react-feather'

interface ArchiveFiltersProps {
  queryFilters: AccessionsQueryFilters
  updateFilters: (filters: Partial<AccessionsQueryFilters>) => void
  isLoggedIn: boolean
  lockedSubjectIds?: number[]
  collectionId?: number
}

export function ArchiveFilters({
  queryFilters,
  updateFilters,
  isLoggedIn,
  lockedSubjectIds,
  collectionId,
}: ArchiveFiltersProps) {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const [dateFrom, setDateFrom] = useState<null | Date>(null)
  const [dateTo, setDateTo] = useState<null | Date>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [queryTerm, setQueryTerm] = useState(queryFilters.query_term || '')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [urlFilterTerm, setUrlFilterTerm] = useState(
    queryFilters.url_filter || '',
  )
  const [debouncedUrlFilter, setDebouncedUrlFilter] = useState('')

  const borderColor = colorMode === 'dark' ? 'gray.600' : 'gray.400'
  const inputBg = colorMode === 'dark' ? '#252525' : '#ffffff'
  const inputColor = colorMode === 'dark' ? '#ffffff' : '#1a1a1a'
  const placeholderColor = colorMode === 'dark' ? '#a0a0a0' : '#666666'

  function handleDateChange(
    date: Date | null,
    dateField: 'date_from' | 'date_to',
  ) {
    if (!date) {
      updateFilters({ [dateField]: '' })
      if (dateField === 'date_from') {
        setDateFrom(null)
      } else {
        setDateTo(null)
      }
      return
    }

    if (dateField === 'date_from') {
      setDateFrom(date)
    } else {
      setDateTo(date)
    }

    const newQueryDate = `${date.toISOString().split('T')[0]}T00:00:00`
    updateFilters({ [dateField]: newQueryDate })
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(queryTerm)
    }, 300)
    return () => clearTimeout(handler)
  }, [queryTerm])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUrlFilter(urlFilterTerm)
    }, 300)
    return () => clearTimeout(handler)
  }, [urlFilterTerm])

  useEffect(() => {
    updateFilters({ query_term: debouncedQuery })
  }, [debouncedQuery, updateFilters])

  useEffect(() => {
    updateFilters({ url_filter: debouncedUrlFilter })
  }, [debouncedUrlFilter, updateFilters])

  return (
    <Box w="100%">
      <Box pb={4}>
        <Input
          value={urlFilterTerm}
          onChange={(event) => {
            setUrlFilterTerm(event.target.value)
          }}
          placeholder={t('archive_url_filter_placeholder')}
          size="md"
          mb={5}
          variant="outline"
          borderColor={borderColor}
          bg={inputBg}
          color={inputColor}
          _placeholder={{ color: placeholderColor }}
        />
        <Input
          value={queryTerm}
          onChange={(event) => {
            setQueryTerm(event.target.value)
          }}
          placeholder={t('archive_text_search_query_placeholder')}
          size="md"
          mb={5}
          variant="outline"
          borderColor={borderColor}
          bg={inputBg}
          color={inputColor}
          _placeholder={{ color: placeholderColor }}
        />

        <Flex gap={4} alignItems="flex-start" mb={5} flexWrap="wrap">
          <Flex gap={2} alignItems="center" wrap="nowrap">
            <Badge colorPalette="cyan" fontSize="sm" py={1} px={3}>
              {t('archive_date_from_filter')}
            </Badge>
            <ArchiveDatePicker
              selected={dateFrom}
              onChange={(date) => handleDateChange(date, 'date_from')}
            />
          </Flex>
          <Flex gap={2} alignItems="center" wrap="nowrap">
            <Badge colorPalette="cyan" fontSize="sm" py={1} px={3}>
              {t('archive_date_to_filter')}
            </Badge>
            <ArchiveDatePicker
              selected={dateTo}
              onChange={(date) => handleDateChange(date, 'date_to')}
            />
          </Flex>
          <Flex gap={3} alignItems="center" flex={1} minW="300px">
            <Box flex={1}>
              <SubjectsAutocomplete
                menuPlacement="bottom"
                lockedValues={lockedSubjectIds}
                collectionId={collectionId}
                value={queryFilters.metadata_subjects?.map((id) => ({
                  value: id,
                  label: String(id),
                }))}
                onChange={(subjects) => {
                  const newSubjectIds = subjects.map((subject) => subject.value)
                  const mergedIds =
                    lockedSubjectIds && lockedSubjectIds.length > 0
                      ? [
                          ...lockedSubjectIds,
                          ...newSubjectIds.filter(
                            (id) => !lockedSubjectIds.includes(id),
                          ),
                        ]
                      : newSubjectIds
                  updateFilters({
                    metadata_subjects: mergedIds,
                  })
                }}
              />
            </Box>
            {Array.isArray(queryFilters.metadata_subjects) &&
              queryFilters.metadata_subjects.length > 0 &&
              (!lockedSubjectIds || lockedSubjectIds.length === 0) && (
                <Flex alignItems="center">
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
          </Flex>
        </Flex>

        {isLoggedIn && (
          <Flex alignItems="center">
            <Badge colorPalette="cyan" fontSize="sm" py={1} px={2}>
              {t('archive_filter_private_records')}
            </Badge>
            <Switch.Root
              checked={queryFilters.is_private || false}
              onCheckedChange={(e) => {
                updateFilters({ is_private: e.checked === true })
              }}
              size="lg"
              mx={2}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
          </Flex>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          mt={4}
          colorPalette="cyan"
        >
          {showAdvanced ? (
            <>
              <ChevronUp size={16} style={{ marginRight: '4px' }} />
              {t('archive_hide_advanced_filters') || 'Hide Advanced Filters'}
            </>
          ) : (
            <>
              <ChevronDown size={16} style={{ marginRight: '4px' }} />
              {t('archive_show_advanced_filters') || 'Show Advanced Filters'}
            </>
          )}
        </Button>
      </Box>

      {showAdvanced && (
        <Box pt={4} borderTopWidth="1px" borderColor={borderColor}>
          <Flex direction="column" gap={6}>
            <Box width="100%">
              <CreatorsAutocomplete
                menuPlacement="bottom"
                collectionId={collectionId}
                value={queryFilters.metadata_creators?.map((id) => ({
                  value: id,
                  label: String(id),
                }))}
                onChange={(creators) => {
                  updateFilters({
                    metadata_creators: creators.map((c) => c.value),
                  })
                }}
              />
            </Box>

            <Box width="100%">
              <LocationsAutocomplete
                menuPlacement="bottom"
                collectionId={collectionId}
                value={queryFilters.metadata_locations?.map((id) => ({
                  value: id,
                  label: String(id),
                }))}
                onChange={(locations) => {
                  updateFilters({
                    metadata_locations: locations.map((l) => l.value),
                  })
                }}
              />
            </Box>

            <Flex gap={4} alignItems="flex-start">
              <Box flex={1} width="100%">
                <ContributorsAutocomplete
                  menuPlacement="bottom"
                  collectionId={collectionId}
                  value={queryFilters.metadata_contributors?.map((id) => ({
                    value: id,
                    label: String(id),
                  }))}
                  onChange={(contributors) => {
                    updateFilters({
                      metadata_contributors: contributors.map((c) => c.value),
                    })
                  }}
                />
              </Box>
              {Array.isArray(queryFilters.metadata_contributors) &&
                queryFilters.metadata_contributors.length > 0 && (
                  <Flex alignItems="center" mt={3}>
                    <Badge
                      colorPalette="cyan"
                      fontSize="sm"
                      py={1}
                      px={2}
                      mr={2}
                    >
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
            </Flex>

            <Flex gap={4} alignItems="flex-start">
              <Box flex={1} width="100%">
                <ContributorRolesAutocomplete
                  menuPlacement="bottom"
                  collectionId={collectionId}
                  value={queryFilters.metadata_contributor_roles?.map((id) => ({
                    value: id,
                    label: String(id),
                  }))}
                  onChange={(roles) => {
                    updateFilters({
                      metadata_contributor_roles: roles.map((r) => r.value),
                    })
                  }}
                />
              </Box>
              {Array.isArray(queryFilters.metadata_contributor_roles) &&
                queryFilters.metadata_contributor_roles.length > 0 && (
                  <Flex alignItems="center" mt={3}>
                    <Badge
                      colorPalette="cyan"
                      fontSize="sm"
                      py={1}
                      px={2}
                      mr={2}
                    >
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
            </Flex>
          </Flex>
        </Box>
      )}
    </Box>
  )
}
