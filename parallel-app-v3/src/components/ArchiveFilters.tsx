'use client'

import { Box, Input, Flex, Badge, Switch } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArchiveDatePicker } from './DatePicker'
import { SubjectsAutocomplete } from './subjectsAutocomplete/SubjectsAutocomplete'
import type { AccessionsQueryFilters } from '../apiTypes/apiRequests'
import { useColorMode } from './ui/color-mode'

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
      <Flex flexWrap="wrap" gap={2} alignItems="center">
        <Badge
          colorPalette="cyan"
          fontSize="sm"
          py={1}
          px={3}
          w="110px"
          textAlign="center"
        >
          {t('archive_date_from_filter')}
        </Badge>
        <ArchiveDatePicker
          selected={dateFrom}
          onChange={(date) => handleDateChange(date, 'date_from')}
        />
        <Badge
          colorPalette="cyan"
          fontSize="sm"
          py={1}
          px={3}
          w="110px"
          textAlign="center"
        >
          {t('archive_date_to_filter')}
        </Badge>
        <ArchiveDatePicker
          selected={dateTo}
          onChange={(date) => handleDateChange(date, 'date_to')}
        />
        {isLoggedIn && (
          <>
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
              <Switch.Control />
            </Switch.Root>
          </>
        )}
      </Flex>
      <Flex py={5} direction={{ base: 'column', md: 'row' }} gap={4}>
        <SubjectsAutocomplete
          menuPlacement="top"
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
        {Array.isArray(queryFilters.metadata_subjects) &&
          queryFilters.metadata_subjects.length > 0 &&
          (!lockedSubjectIds || lockedSubjectIds.length === 0) && (
            <Flex alignItems="center" mt={{ base: 4, md: 0 }}>
              <Badge colorPalette="pink" fontSize="sm" py={1} px={2} mr={2}>
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
                <Switch.Control />
              </Switch.Root>
            </Flex>
          )}
      </Flex>
    </Box>
  )
}
