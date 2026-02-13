import { Box, Tag, Input, Flex, Switch } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArchiveDatePicker } from './DatePicker.tsx'
import { SubjectsAutocomplete } from './subjectsAutocomplete/SubjectsAutocomplete.tsx'
import type { AccessionsQueryFilters } from '../apiTypes/apiRequests.ts'

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
  const [dateFrom, setDateFrom] = useState<null | Date>(null)
  const [dateTo, setDateTo] = useState<null | Date>(null)
  const [queryTerm, setQueryTerm] = useState(queryFilters.query_term || '')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [urlFilterTerm, setUrlFilterTerm] = useState(
    queryFilters.url_filter || '',
  )
  const [debouncedUrlFilter, setDebouncedUrlFilter] = useState('')

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
        size="lg"
        mb={5}
      />
      <Input
        value={queryTerm}
        onChange={(event) => {
          setQueryTerm(event.target.value)
        }}
        placeholder={t('archive_text_search_query_placeholder')}
        size="lg"
        mb={5}
      />
      <Flex>
        <Tag size="lg" colorScheme="cyan" w="110px">
          {t('archive_date_from_filter')}
        </Tag>
        <ArchiveDatePicker
          selected={dateFrom}
          onChange={(date) => handleDateChange(date, 'date_from')}
        />
        <Tag size="lg" colorScheme="cyan" w="110px">
          {t('archive_date_to_filter')}
        </Tag>
        <ArchiveDatePicker
          selected={dateTo}
          onChange={(date) => handleDateChange(date, 'date_to')}
        />
        {isLoggedIn && (
          <>
            <Tag size="lg" colorScheme="cyan">
              {t('archive_filter_private_records')}
            </Tag>
            <Switch
              my={2}
              mx={2}
              size="lg"
              onChange={(e) => {
                updateFilters({ is_private: e.target.checked })
              }}
            />
          </>
        )}
      </Flex>
      <Flex py={5} direction={{ base: 'column', md: 'row' }}>
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
            // Merge locked subjects with user selections
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
              <Tag size="lg" colorScheme="blue" ml={{ base: 0, md: 4 }}>
                {queryFilters.metadata_subjects_inclusive_filter
                  ? t('exclusive')
                  : t('inclusive')}
              </Tag>
              <Switch
                my={2}
                mx={2}
                size="lg"
                isChecked={queryFilters.metadata_subjects_inclusive_filter}
                onChange={(e) => {
                  updateFilters({
                    metadata_subjects_inclusive_filter: e.target.checked,
                  })
                }}
              />
            </Flex>
          )}
      </Flex>
    </Box>
  )
}
