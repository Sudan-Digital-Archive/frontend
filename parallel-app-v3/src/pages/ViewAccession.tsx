'use client'

import {
  DateMetadata,
  Subject,
  Title,
  Description,
  OriginalURL,
} from '../components/metadata/index'
import { useParams, useSearchParams } from 'react-router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { appConfig } from '../constants'
import type { AccessionOne } from '../apiTypes/apiResponses'
import { useWindowSize } from '../hooks/useWindowSize'
import AccessionButtons from '../components/AccessionButtons'
import {
  Spinner,
  VStack,
  Box,
  Text,
  HStack,
  Button,
  Flex,
} from '@chakra-ui/react'
import { useParsedDate } from '../hooks/useParsedDate'
import { useUser } from '../hooks/useUser'
import Layout from '../components/Layout'
import { ExternalLink } from 'react-feather'

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
        <Text fontWeight="bold" fontSize="sm">
          {t('sda_record')}
        </Text>
        <Text fontSize="xs">
          {t('view_accession_captured')} {parseDate(timestamp)}
        </Text>
      </Box>
      {isMobile ? (
        <Box height="1px" bg="white" my={2} />
      ) : (
        <Box width="1px" bg="white" height="80px" mx={2} />
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showMetadata, setShowMetadata] = useState(true)
  const { t, i18n } = useTranslation()
  const width = useWindowSize()
  const isMobile = width <= 768
  const [searchParams] = useSearchParams()
  const lang = searchParams.get('lang') || 'en'
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
            {showMetadata && (
              <Box w="100%" p={2}>
                {isMobile ? (
                  <VStack
                    m={2}
                    gap={2}
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                  >
                    <AccessionInfo
                      timestamp={accession.accession.crawl_timestamp}
                      id={id}
                      lang={lang}
                      onOpen={() => setIsDrawerOpen(true)}
                      isMobile={true}
                    />
                  </VStack>
                ) : (
                  <HStack m={2} gap={2} alignItems="center" display="flex">
                    <AccessionInfo
                      timestamp={accession.accession.crawl_timestamp}
                      id={id}
                      lang={lang}
                      onOpen={() => setIsDrawerOpen(true)}
                      isMobile={false}
                    />
                  </HStack>
                )}
              </Box>
            )}

            {isDrawerOpen && (
              <Box
                position="fixed"
                top={0}
                right={0}
                bottom={0}
                width={{ base: '100%', md: '400px' }}
                bg="gray.800"
                zIndex={1001}
                p={4}
                overflowY="auto"
              >
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
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
                  <Button
                    variant="ghost"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    ✕
                  </Button>
                </Flex>
                <VStack gap={3} align="stretch">
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
                  <DateMetadata
                    date={accession.accession.dublin_metadata_date}
                    fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                  />
                  <HStack>
                    <ExternalLink size={14} />
                    <OriginalURL
                      url={accession.accession.seed_url}
                      fontSize={i18n.language === 'en' ? 'md' : 'lg'}
                    />
                  </HStack>
                </VStack>
              </Box>
            )}

            {isDrawerOpen && (
              <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.700"
                zIndex={1000}
                onClick={() => setIsDrawerOpen(false)}
              />
            )}

            <Button
              onClick={() => setShowMetadata(!showMetadata)}
              variant="outline"
              mb={2}
            >
              {showMetadata
                ? t('view_accession_hide_metadata')
                : t('view_accession_show_metadata')}
            </Button>

            <Box flex="1" w="100vw" bg="white">
              <Box height="4px" bg="teal.500" />
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
