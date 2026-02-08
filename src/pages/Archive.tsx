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
  HStack,
  VStack,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, FilePlus } from 'react-feather'
import { CreateUpdateAccession } from 'src/components/forms/CreateUpdateAccession.tsx'
import Layout from 'src/components/Layout.tsx'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessionsCards } from 'src/components/AccessionsCards.tsx'
import { ArchiveFilters } from 'src/components/ArchiveFilters.tsx'
import { useUser } from 'src/hooks/useUser.ts'
import { useAccessions } from 'src/hooks/useAccessions.ts'

export default function Archive() {
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()

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

  const { isOpen, onOpen, onClose } = useDisclosure()

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
          <ArchiveFilters
            queryFilters={queryFilters}
            updateFilters={updateFilters}
            showSubjectFilters={true}
            isLoggedIn={isLoggedIn}
          />
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
