import {
  DateMetadata,
  Subject,
  Title,
  Description,
  OriginalURL,
} from '../components/metadata/index.tsx'
import { useParams, useSearchParams } from 'react-router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { appConfig } from '../constants.ts'
import type { AccessionOne } from '../apiTypes/apiResponses.ts'
import { useWindowSize } from '../hooks/useWindowSize.ts'
import AccessionButtons from '../components/AccessionButtons.tsx'
import {
  Spinner,
  VStack,
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton,
  DrawerOverlay,
  DrawerContent,
  Text,
  HStack,
  useDisclosure,
  Button,
  Heading,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
} from '@chakra-ui/react'
import { useParsedDate } from '../hooks/useParsedDate.ts'
import { useUser } from '../hooks/useUser.ts'
import Layout from '../components/Layout.tsx'

interface AccessionInfoProps {
  timestamp: string
  id: string | undefined
  lang: string
  onOpen: () => void
  isMobile: boolean
}

function AccessionInfo({
  id,
  lang,
  onOpen,
  timestamp,
  isMobile,
}: Readonly<AccessionInfoProps>) {
  const { t } = useTranslation()
  const { parseDate } = useParsedDate()
  return (
    <>
      <Box color="white" p={2} borderRadius="md">
        <Heading size="sm">{t('sda_record')}</Heading>
        <Text fontSize="xs">
          {t('view_accession_captured')} {parseDate(timestamp)}
        </Text>
      </Box>
      {isMobile ? (
        <Divider orientation="horizontal" borderColor="white" />
      ) : (
        <Divider
          orientation="vertical"
          borderColor="white"
          height="80px"
          p={2}
        />
      )}
      <AccessionButtons onOpen={onOpen} id={id} lang={lang} />
    </>
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t, i18n } = useTranslation()
  const width = useWindowSize()
  const isMobile = width <= 768
  const [searchParams] = useSearchParams()
  const lang = searchParams.get('lang') || 'en'
  const isPrivate = searchParams.get('isPrivate') === 'true'
  const { isLoggedIn } = useUser()
  const metadataHeaderDisclosure = useDisclosure({ defaultIsOpen: true })
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
          <Box width={{ base: '90%', md: '50%' }} margin="auto">
            <Alert status={error ? 'error' : 'warning'}>
              <AlertIcon />
              <AlertTitle>
                {error ? t('error_occurred') : t('login_required')}
              </AlertTitle>
              <AlertDescription>
                {error ? error.message : t('login_required_description')}
              </AlertDescription>
            </Alert>
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
            <Collapse in={metadataHeaderDisclosure.isOpen} animateOpacity>
              {isMobile ? (
                <VStack
                  m={2}
                  spacing={2}
                  alignItems="center"
                  display="flex"
                  flexDirection="column"
                >
                  <AccessionInfo
                    timestamp={accession.accession.crawl_timestamp}
                    id={id}
                    lang={lang}
                    onOpen={onOpen}
                    isMobile={true}
                  />
                </VStack>
              ) : (
                <HStack m={2} spacing={2} alignItems="center" display="flex">
                  <AccessionInfo
                    timestamp={accession.accession.crawl_timestamp}
                    id={id}
                    lang={lang}
                    onOpen={onOpen}
                    isMobile={false}
                  />
                </HStack>
              )}

              <Drawer
                placement="right"
                onClose={onClose}
                isOpen={isOpen}
                size="lg"
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader borderBottomWidth="1px">
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
                  </DrawerHeader>
                  <DrawerBody>
                    <Subject
                      subjects={
                        i18n.language === 'en'
                          ? accession.accession.subjects_en
                          : accession.accession.subjects_ar
                      }
                    />
                    {((i18n.language === 'en' &&
                      accession.accession.description_en) ||
                      (i18n.language === 'ar' &&
                        accession.accession.description_ar)) && (
                      <Description
                        description={
                          i18n.language === 'en'
                            ? accession.accession.description_en
                            : accession.accession.description_ar
                        }
                        fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                      />
                    )}
                    <Box>
                      <DateMetadata
                        date={accession.accession.dublin_metadata_date}
                        fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                      />
                    </Box>
                    <OriginalURL
                      url={accession.accession.seed_url}
                      fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                    />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Collapse>
            <Button
              onClick={metadataHeaderDisclosure.onToggle}
              variant="outline"
            >
              {metadataHeaderDisclosure.isOpen &&
                t('view_accession_hide_metadata')}
              {!metadataHeaderDisclosure.isOpen &&
                t('view_accession_show_metadata')}
            </Button>

            <Box flex="1" w="100vw" bg="white">
              <Box h="4px" bg="teal.500" />
              <replay-web-page
                embed="replayonly"
                replayBase="/replay/"
                source={replayerState.source}
                url={replayerState.url}
              ></replay-web-page>
            </Box>
          </>
        )}
      </VStack>
    </Layout>
  )
}
