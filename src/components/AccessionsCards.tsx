import { Box, Button, Flex, SimpleGrid, Card } from '@chakra-ui/react'
import { Title, MetadataDisplay } from './metadata'
import { useTranslation } from 'react-i18next'
import type { AccessionWithMetadata } from '../apiTypes/apiResponses'
import { DeleteAccession } from './forms/DeleteAccession'
import { CreateUpdateAccession } from './forms/CreateUpdateAccession'
import { useUser } from '../hooks/useUser'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { X } from 'react-feather'

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
  const navigate = useNavigate()
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
      <SimpleGrid minChildWidth="380px" gap={10} my={5} px={5} width="100%">
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
          const creator =
            i18n.language === 'en' ? accession.creator_en : accession.creator_ar
          const location =
            i18n.language === 'en'
              ? accession.location_en
              : accession.location_ar
          const contributors =
            i18n.language === 'en'
              ? accession.contributors_en
              : accession.contributors_ar
          const contributorRoles =
            i18n.language === 'en'
              ? accession.contributor_roles_en
              : accession.contributor_roles_ar
          const relations =
            i18n.language === 'en'
              ? accession.relations_en
              : accession.relations_ar

          return (
            <Card.Root
              key={`accession-card-${index}`}
              bg="card.bg"
              boxShadow="xl"
              borderRadius="xl"
              border="1px solid"
              borderColor="card.border"
              transition="all 0.3s ease-in-out"
              _hover={{
                boxShadow: '2xl',
                transform: 'translateY(-5px)',
              }}
              overflow="hidden"
              height="100%"
              minH="200px"
              display="flex"
              flexDirection="column"
            >
              <Card.Header p={4} pb={2}>
                <Title
                  title={title || t('metadata_missing_title')}
                  fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                  lineClamp={2}
                />
              </Card.Header>
              <Card.Body p={4} pt={2}>
                <MetadataDisplay
                  subjects={subjects}
                  creator={creator}
                  location={location}
                  contributors={contributors}
                  contributorRoles={contributorRoles}
                  relations={relations}
                  description={description}
                  date={accession.dublin_metadata_date}
                  originalUrl={accession.seed_url}
                  language={i18n.language}
                  isPrivate={accession.is_private}
                />
              </Card.Body>
              <Card.Footer p={4} pt={2}>
                <Flex justifyContent="space-between" gap={2}>
                  <Button
                    variant="ghost"
                    colorPalette="cyan"
                    fontSize={i18n.language === 'en' ? '0.8em' : '1em'}
                    _active={{ bg: 'cyan.700', color: 'white' }}
                    onClick={() =>
                      navigate(
                        `/archive/${accession.id}?isPrivate=${accession.is_private}&lang=${i18n.language}`,
                      )
                    }
                  >
                    {t('archive_view_record_button')}
                  </Button>
                  {isLoggedIn && (
                    <Flex gap={2}>
                      <Button
                        variant="ghost"
                        colorPalette="cyan"
                        fontSize={i18n.language === 'en' ? '0.8em' : '1em'}
                        _active={{ bg: 'cyan.700', color: 'white' }}
                        onClick={() => handleEditClick(accession)}
                      >
                        {t('accession_card_edit_button')}
                      </Button>
                      <Button
                        variant="ghost"
                        _active={{ bg: 'gray.600' }}
                        onClick={() => setIsEditOpen(false)}
                      >
                        {t('accession_card_delete_button')}
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </Card.Footer>
            </Card.Root>
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
            bg="bg.subtle"
            p={6}
            borderRadius="md"
            maxW="600px"
            w="100%"
            maxH="90vh"
            overflowY="auto"
            border="1px solid"
            borderColor="border"
          >
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Box as="h2" fontSize="xl" fontWeight="bold">
                {t('edit_accession')}
              </Box>
              <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                <X size={18} />
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
