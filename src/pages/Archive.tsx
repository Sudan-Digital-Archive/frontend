import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  Tag,
  Input,
  Flex,
  HStack,
  VStack,
  Switch,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, FilePlus } from 'react-feather'
import { CreateUpdateAccession } from 'src/components/forms/CreateUpdateAccession.tsx'
import Layout from 'src/components/Layout.tsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArchiveDatePicker } from 'src/components/DatePicker.tsx'
import { AccessionsCards } from 'src/components/AccessionsCards.tsx'
import { SubjectsAutocomplete } from 'src/components/subjectsAutocomplete/SubjectsAutocomplete.tsx'
import { useUser } from 'src/hooks/useUser.ts'
import { useAccessions } from 'src/hooks/useAccessions.ts'

export default function Archive() {
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()

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
      lang: i18n.language === 'en' ? 'english' : 'arabic',
      query_term: '',
      metadata_subjects: [],
      metadata_subjects_inclusive_filter: true,
      is_private: false,
      url_filter: '',
    },
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [dateFrom, setDateFrom] = useState<null | Date>(null)
  const [dateTo, setDateTo] = useState<null | Date>(null)
  const [queryTerm, setQueryTerm] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [urlFilterTerm, setUrlFilterTerm] = useState('')
  const [debouncedUrlFilter, setDebouncedUrlFilter] = useState('')

  function handleDateChange(
    date: Date | null,
    dateField: 'date_from' | 'date_to',
  ) {
    if (!date) {
      updateFilters({ [dateField]: '' })
      return
    }

    switch (dateField) {
      case 'date_from':
        setDateFrom(date)
        break
      case 'date_to':
        setDateTo(date)
        break
      default:
        throw `Unsupported dateField arg ${dateField}`
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
          default:
            throw `Language ${newLanguage} is not supported`
        }
        updateFilters({ lang: newLanguage === 'en' ? 'english' : 'arabic' })
      }}
    >
      <VStack alignItems="center" justifyContent="center">
        {isLoggedIn ? (
          <Button
            colorScheme="pink"
            rightIcon={<FilePlus />}
            variant="solid"
            onClick={onOpen}
          >
            {t('archive_add_record')}
          </Button>
        ) : null}
        <Box w="100%" p={10}>
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
              onChange={(subjects) => {
                updateFilters({
                  metadata_subjects: subjects.map((subject) => subject.value),
                })
              }}
            />
            {Array.isArray(queryFilters.metadata_subjects) &&
              queryFilters.metadata_subjects.length > 0 && (
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

        <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">
              {t('archive_create_modal_header')}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isLoggedIn ? <CreateUpdateAccession /> : null}
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
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
            {pagination.currentPage != 0 &&
              pagination.currentPage != pagination.totalPages && (
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
      </VStack>
    </Layout>
  )
}
