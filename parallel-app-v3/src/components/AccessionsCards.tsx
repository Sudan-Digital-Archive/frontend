'use client'

import { SimpleGrid, Box, Button, Flex } from '@chakra-ui/react'
import { ArchiveCard } from './ArchiveCard'
import {
  DateMetadata,
  Title,
  Description,
  OriginalURL,
  Subject,
} from './metadata'
import { useTranslation } from 'react-i18next'
import type { AccessionWithMetadata } from '../apiTypes/apiResponses'
import { NavLink } from 'react-router'
import { DeleteAccession } from './forms/DeleteAccession'
import { CreateUpdateAccession } from './forms/CreateUpdateAccession'
import { useUser } from '../hooks/useUser'
import { useState } from 'react'

interface AccessionsCardsProps {
  accessions: AccessionWithMetadata[]
  onRefresh: () => void
}

export function AccessionsCards({
  accessions,
  onRefresh,
}: AccessionsCardsProps) {
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()
  const [deleteAccessionId, setDeleteAccessionId] = useState<string | null>(
    null,
  )
  const [editAccession, setEditAccession] =
    useState<AccessionWithMetadata | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleEditClick = (accession: AccessionWithMetadata) => {
    setEditAccession(accession)
    setIsEditOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditOpen(false)
    onRefresh()
  }

  return (
    <>
      <SimpleGrid gap={10} columns={{ sm: 1, md: 2, lg: 3 }} my={5} mx={5}>
        {accessions.map((accession: AccessionWithMetadata, index: number) => {
          const title =
            i18n.language === 'en' ? accession.title_en : accession.title_ar
          const description =
            i18n.language === 'en'
              ? accession.description_en
              : accession.description_ar
          const subjects =
            i18n.language === 'en'
              ? accession.subjects_en
              : accession.subjects_ar

          return (
            <ArchiveCard key={`accession-card-${index}`}>
              <Box p={4}>
                <Title
                  title={title || t('metadata_missing_title')}
                  fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                  truncate
                />
                {description && (
                  <Description
                    description={description}
                    fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                    truncate
                  />
                )}
                <Box mt={2}>
                  <DateMetadata
                    date={accession.dublin_metadata_date}
                    fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                  />
                </Box>
                <Subject subjects={subjects} />
                <OriginalURL
                  url={accession.seed_url}
                  fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                />
                <Flex mt={4} justifyContent="space-between" gap={2}>
                  <NavLink
                    to={`/archive/${accession.id}?isPrivate=${accession.is_private}&lang=${i18n.language}`}
                  >
                    <Button
                      colorPalette="purple"
                      fontSize={i18n.language === 'en' ? '0.8em' : '1em'}
                    >
                      {t('archive_view_record_button')}
                    </Button>
                  </NavLink>
                  {isLoggedIn && (
                    <Flex gap={2}>
                      <Button
                        colorPalette="blue"
                        fontSize={i18n.language === 'en' ? '0.8em' : '1em'}
                        onClick={() => handleEditClick(accession)}
                      >
                        {t('accession_card_edit_button')}
                      </Button>
                      <Button
                        colorPalette="red"
                        fontSize={i18n.language === 'en' ? '0.8em' : '1em'}
                        onClick={() => setDeleteAccessionId(accession.id)}
                      >
                        {t('accession_card_delete_button')}
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </ArchiveCard>
          )
        })}
      </SimpleGrid>

      <DeleteAccession
        accessionId={deleteAccessionId || ''}
        isOpen={deleteAccessionId !== null}
        onClose={() => setDeleteAccessionId(null)}
        onSuccess={() => {
          onRefresh()
          setDeleteAccessionId(null)
        }}
      />

      {isEditOpen && editAccession && (
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
              <Box as="h2" fontSize="xl" fontWeight="bold">
                {t('edit_accession')}
              </Box>
              <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                ✕
              </Button>
            </Flex>
            <CreateUpdateAccession
              accessionToUpdate={editAccession}
              onSuccess={handleEditSuccess}
            />
          </Box>
        </Box>
      )}
    </>
  )
}
