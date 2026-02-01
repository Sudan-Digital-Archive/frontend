import {
  SimpleGrid,
  CardHeader,
  CardBody,
  Box,
  CardFooter,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react'
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
import { useUser } from '../hooks/useUser.ts'
import React from 'react'

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
  const [deleteAccessionId, setDeleteAccessionId] = React.useState<
    string | null
  >(null)
  const [editAccession, setEditAccession] =
    React.useState<AccessionWithMetadata | null>(null)
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()

  const isDeleteModalOpen = (accessionId: string) =>
    deleteAccessionId === accessionId
  const onDeleteOpen = (accessionId: string) =>
    setDeleteAccessionId(accessionId)
  const onDeleteClose = () => setDeleteAccessionId(null)

  const handleEditClick = (accession: AccessionWithMetadata) => {
    setEditAccession(accession)
    onEditOpen()
  }

  const handleEditSuccess = () => {
    onEditClose()
    onRefresh()
  }

  return (
    <>
      <SimpleGrid spacing={10} columns={{ sm: 1, md: 2, lg: 3 }} my={5} mx={5}>
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
              <CardHeader>
                <Title
                  title={title || t('metadata_missing_title')}
                  fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                  truncate
                />
              </CardHeader>
              <CardBody>
                {description && (
                  <Description
                    description={description}
                    fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                    truncate
                  />
                )}
                <Box>
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
              </CardBody>
              <CardFooter justifyContent="space-between">
                <NavLink
                  to={`/archive/${accession.id}?isPrivate=${accession.is_private}&lang=${i18n.language}`}
                >
                  <Button
                    colorScheme="purple"
                    fontSize={i18n.language === 'en' ? '0.8em' : '1em'}
                    variant="solid"
                  >
                    {t('archive_view_record_button')}
                  </Button>
                </NavLink>
                {isLoggedIn && (
                  <Box>
                    <Button
                      colorScheme="blue"
                      fontSize={i18n.language === 'en' ? '0.8em' : '1em'}
                      onClick={() => handleEditClick(accession)}
                      mx={2}
                      variant="solid"
                    >
                      {t('accession_card_edit_button')}
                    </Button>
                    <DeleteAccession
                      accessionId={accession.id}
                      isOpen={isDeleteModalOpen(accession.id)}
                      onClose={onDeleteClose}
                      onSuccess={() => {
                        onRefresh()
                        onDeleteClose()
                      }}
                    />
                    {!isDeleteModalOpen(accession.id) && (
                      <Button
                        colorScheme="red"
                        onClick={() => onDeleteOpen(accession.id)}
                        fontSize={i18n.language === 'en' ? '0.8em' : '1em'}
                        variant="solid"
                      >
                        {t('accession_card_delete_button')}
                      </Button>
                    )}
                  </Box>
                )}
              </CardFooter>
            </ArchiveCard>
          )
        })}
      </SimpleGrid>

      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('edit_accession')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {editAccession && (
              <CreateUpdateAccession
                accessionToUpdate={editAccession}
                onSuccess={handleEditSuccess}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
