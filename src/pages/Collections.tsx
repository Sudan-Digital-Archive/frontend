import {
  Box,
  Heading,
  SimpleGrid,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  VStack,
  Text,
  HStack,
  Spinner,
  Switch,
  Flex,
  Tag,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { ArchiveCard } from '../components/ArchiveCard'
import { Description } from '../components/metadata/Description'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'
import { LangNavLink } from '../components/LangNavLink.tsx'
import { useEffect, useMemo } from 'react'
import { useCollections } from '../hooks/useCollections.ts'
import { useUser } from '../hooks/useUser.ts'
import { useSearchParams } from 'react-router'

export default function Collections() {
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()
  const [searchParams] = useSearchParams()

  const lang = searchParams.get('lang') || 'en'
  const isPrivate = searchParams.get('isPrivate') === 'true'

  const baseFilters = useMemo(
    () => ({
      lang: lang === 'en' ? 'english' : 'arabic',
      is_private: isPrivate,
    }),
    [lang, isPrivate],
  )

  const { collections, isLoading, pagination, updateFilters } = useCollections({
    isLoggedIn,
    baseFilters,
  })

  useEffect(() => {
    i18n.changeLanguage(lang)
    switch (lang) {
      case 'en':
        document.documentElement.lang = 'en'
        document.documentElement.dir = 'ltr'
        break
      case 'ar':
        document.documentElement.lang = 'ar'
        document.documentElement.dir = 'rtl'
        break
      default:
        throw `Language ${lang} is not supported`
    }
  }, [lang, i18n])

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
        updateFilters({
          lang: newLanguage === 'en' ? 'english' : 'arabic',
        })
      }}
    >
      <VStack alignItems="center" justifyContent="center">
        <Box w="100%" maxW="6xl" p={10} mx="auto">
          <Heading
            textAlign="center"
            py={2}
            bgGradient="linear(to-r, cyan.300, pink.600)"
            bgClip="text"
            mb={10}
          >
            {t('collections_title')}
          </Heading>
          {isLoggedIn && (
            <Flex mb={5} alignItems="center" justifyContent="center">
              <Tag size="lg" colorScheme="cyan">
                {t('archive_filter_private_records')}
              </Tag>
              <Switch
                my={2}
                mx={2}
                size="lg"
                isChecked={isPrivate}
                onChange={(e) => {
                  updateFilters({ is_private: e.target.checked })
                }}
              />
            </Flex>
          )}
          {isLoading || !collections ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={10}
            >
              <Spinner />
            </Box>
          ) : collections.items.length === 0 ? (
            <Text textAlign="center" fontSize="xl">
              {t('collections_empty')}
            </Text>
          ) : (
            <SimpleGrid
              spacing={10}
              columns={{ sm: 1, md: 2, lg: 3 }}
              my={5}
              mx={5}
            >
              {collections.items.map((collection) => (
                <ArchiveCard key={`collection-card-${collection.id}`}>
                  <CardHeader>
                    <Heading size="md">{collection.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Description
                      description={collection.description}
                      truncate
                    />
                  </CardBody>
                  <CardFooter>
                    <LangNavLink
                      to={`/collections/${collection.id}?isPrivate=${!collection.is_public}`}
                    >
                      <Button colorScheme="purple" variant="solid">
                        {t('collection_view_button')}
                      </Button>
                    </LangNavLink>
                  </CardFooter>
                </ArchiveCard>
              ))}
            </SimpleGrid>
          )}
          {collections && collections.items.length > 0 && !isLoading && (
            <HStack mt={3} justifyContent="center">
              {pagination.currentPage !== 0 && (
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
        </Box>
      </VStack>
    </Layout>
  )
}
