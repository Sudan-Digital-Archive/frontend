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
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { ArchiveCard } from '../components/ArchiveCard'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import { useCollections } from '../hooks/useCollections.ts'
import { useEffect } from 'react'

export default function Collections() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'english' : 'arabic'

  const { collections, isLoading, pagination, updateFilters } =
    useCollections(lang)

  // Update language filter when i18n language changes
  useEffect(() => {
    updateFilters({
      lang: i18n.language === 'en' ? 'english' : 'arabic',
      page: 0,
    })
  }, [i18n.language, updateFilters])

  return (
    <Layout>
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
          {isLoading || !collections ? (
            <Spinner />
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
                    <Text>{collection.description}</Text>
                  </CardBody>
                  <CardFooter>
                    <NavLink to={`/collections/${collection.id}`}>
                      <Button colorScheme="purple" variant="solid">
                        {t('collection_view_button')}
                      </Button>
                    </NavLink>
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
