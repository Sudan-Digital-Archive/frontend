import { Title, MetadataDisplay } from '../components/metadata/index'
import { useParams, useSearchParams } from 'react-router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { appConfig } from '../constants'
import type { AccessionOne } from '../apiTypes/apiResponses'
import {
  Spinner,
  VStack,
  Box,
  Text,
  HStack,
  Button,
  Drawer,
} from '@chakra-ui/react'
import { useParsedDate } from '../hooks/useParsedDate'
import { useUser } from '../hooks/useUser'
import { useToast } from '../context/ToastContext'
import Layout from '../components/Layout'
import { X, Copy, ExternalLink } from 'react-feather'

interface AccessionInfoProps {
  timestamp: string
  onOpen: () => void
}

function AccessionInfo({ onOpen, timestamp }: Readonly<AccessionInfoProps>) {
  const { t } = useTranslation()
  const { parseDate } = useParsedDate()
  const { showToast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast(t('link_copied'), 'success')
  }

  return (
    <HStack
      gap={4}
      align="center"
      flexDir={{ base: 'column', md: 'row' }}
      textAlign={{ base: 'center', md: 'left' }}
      w={{ base: '100%', md: 'auto' }}
    >
      <Box>
        <Text fontWeight="bold" fontSize="sm">
          {t('sda_record')}
        </Text>
        <Text fontSize="xs" color="fg.muted">
          {t('view_accession_captured')} {parseDate(timestamp)}
        </Text>
      </Box>
      <Box
        height={{ base: '1px', md: '30px' }}
        width={{ base: '80%', md: '1px' }}
        bg="border"
        display={{ base: 'none', md: 'block' }}
      />
      <Box
        height="1px"
        width="80%"
        bg="border"
        display={{ base: 'block', md: 'none' }}
      />
      <Button
        size="sm"
        variant="ghost"
        _active={{ bg: 'gray.600' }}
        onClick={handleCopy}
      >
        <Copy size={14} style={{ marginRight: '4px' }} />
        {t('copy_record')}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        _active={{ bg: 'gray.600' }}
        onClick={onOpen}
      >
        <ExternalLink size={14} style={{ marginRight: '4px' }} />
        {t('view_accession_see_metadata')}
      </Button>
    </HStack>
  )
}

export default function ViewAccession() {
  const { id } = useParams()
  const [replayerState, setReplayerState] = useState({ source: '', url: '' })
  const [accession, setAccession] = useState<null | AccessionOne>(null)
  const [error, setError] = useState<{
    status: number
    message: string
  } | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showMetadata, setShowMetadata] = useState(true)
  const { t, i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const lang = searchParams.get('lang') || i18n.language
  const isPrivate = searchParams.get('isPrivate') === 'true'
  const { isLoggedIn } = useUser()

  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [lang, i18n])

  useEffect(() => {
    const fetchAccession = async () => {
      try {
        const endpoint = isPrivate
          ? `${appConfig.apiURL}accessions/private/${id}`
          : `${appConfig.apiURL}accessions/${id}`
        const response = await fetch(endpoint, {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        })
        if (!response.ok) {
          if (response.status === 404) {
            setError({ status: 404, message: t('record_not_found') })
          } else {
            setError({
              status: response.status,
              message: t('error_fetching_record'),
            })
          }
          return
        }
        const data = await response.json()
        setReplayerState({
          source: data.wacz_url,
          url: data.accession.seed_url,
        })
        setAccession(data)
        setError(null)
      } catch (error) {
        console.error(error)
        setError({ status: 500, message: t('error_fetching_record') })
      }
    }

    fetchAccession()
    return () => {
      setReplayerState({ source: '', url: '' })
      setAccession(null)
    }
  }, [id, isPrivate, t])

  if ((isPrivate && !isLoggedIn) || error) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="30vh"
          width="100%"
        >
          <Box
            width={{ base: '90%', md: '50%' }}
            margin="auto"
            p={4}
            borderWidth="1px"
            borderRadius="md"
          >
            <VStack gap={2}>
              <Text fontWeight="bold" color="red.500">
                {error ? t('error_occurred') : t('login_required')}
              </Text>
              <Text>
                {error ? error.message : t('login_required_description')}
              </Text>
            </VStack>
          </Box>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <VStack
        display="flex"
        flexDirection="column"
        h="100vh"
        alignItems="center"
        justifyContent="center"
      >
        {!accession || !replayerState.source || !replayerState.url ? (
          <Spinner />
        ) : (
          <>
            <Box w="100%" py={3} px={{ base: 4, md: 0 }}>
              {showMetadata && (
                <Box w="100%" display="flex" justifyContent="center">
                  <AccessionInfo
                    timestamp={accession.accession.crawl_timestamp}
                    onOpen={() => setIsDrawerOpen(true)}
                  />
                </Box>
              )}
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  _active={{ bg: 'gray.600' }}
                  onClick={() => setShowMetadata(!showMetadata)}
                >
                  {showMetadata
                    ? t('view_accession_hide_metadata')
                    : t('view_accession_show_metadata')}
                </Button>
              </Box>
            </Box>

            <Drawer.Root
              open={isDrawerOpen}
              onOpenChange={(e) => setIsDrawerOpen(e.open)}
              placement={{ base: 'bottom', md: 'end' }}
              size={{ base: 'full', md: 'md' }}
            >
              <Drawer.Backdrop bg="blackAlpha.600" />
              <Drawer.Positioner>
                <Drawer.Content
                  bg="bg.subtle"
                  borderTopRadius={{ base: 'lg', md: 'none' }}
                >
                  <Drawer.Header position="relative" pb={2}>
                    <Drawer.Title>
                      <Title
                        title={
                          i18n.language === 'en'
                            ? accession.accession.title_en ||
                              t('metadata_missing_title')
                            : accession.accession.title_ar ||
                              t('metadata_missing_title')
                        }
                        fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                      />
                    </Drawer.Title>
                    <Drawer.CloseTrigger asChild>
                      <Button
                        variant="ghost"
                        _active={{ bg: 'gray.600' }}
                        size="sm"
                        position="absolute"
                        top={2}
                        right={2}
                      >
                        <X size={18} />
                      </Button>
                    </Drawer.CloseTrigger>
                  </Drawer.Header>
                  <Drawer.Body>
                    <MetadataDisplay
                      subjects={
                        i18n.language === 'en'
                          ? accession.accession.subjects_en
                          : accession.accession.subjects_ar
                      }
                      creator={
                        i18n.language === 'en'
                          ? accession.accession.creator_en
                          : accession.accession.creator_ar
                      }
                      location={
                        i18n.language === 'en'
                          ? accession.accession.location_en
                          : accession.accession.location_ar
                      }
                      contributors={
                        i18n.language === 'en'
                          ? accession.accession.contributors_en
                          : accession.accession.contributors_ar
                      }
                      contributorRoles={
                        i18n.language === 'en'
                          ? accession.accession.contributor_roles_en
                          : accession.accession.contributor_roles_ar
                      }
                      relations={
                        i18n.language === 'en'
                          ? accession.accession.relations_en
                          : accession.accession.relations_ar
                      }
                      description={
                        i18n.language === 'en'
                          ? accession.accession.description_en
                          : accession.accession.description_ar
                      }
                      date={accession.accession.dublin_metadata_date}
                      originalUrl={accession.accession.seed_url}
                      language={i18n.language}
                      isPrivate={isPrivate}
                      truncate={false}
                    />
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer.Positioner>
            </Drawer.Root>

            <Box flex="1" w="100vw" bg="white" color="black">
              <Box height="4px" bg="cyan.500" />
              <replay-web-page
                embed="replayonly"
                replayBase="/replay/"
                source={replayerState.source}
                url={replayerState.url}
              />
            </Box>
          </>
        )}
      </VStack>
    </Layout>
  )
}
