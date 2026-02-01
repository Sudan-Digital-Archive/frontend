import {
  Box,
  Heading,
  SimpleGrid,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  SlideFade,
  VStack,
  Text,
} from '@chakra-ui/react'
import { ArchiveCard } from '../components/ArchiveCard'
import Menu from '../components/Menu.tsx'
import Footer from '../components/Footer.tsx'
import { useTranslation } from 'react-i18next'
import { COLLECTIONS_EN, COLLECTIONS_AR } from '../constants.ts'
import { NavLink } from 'react-router'

export default function Collections() {
  const { t, i18n } = useTranslation()
  const collections = i18n.language === 'en' ? COLLECTIONS_EN : COLLECTIONS_AR

  return (
    <>
      <Menu />
      <SlideFade in>
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
            {collections.length === 0 ? (
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
                {collections.map((collection, index) => (
                  <ArchiveCard key={`collection-card-${index}`}>
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
          </Box>
          <Footer />
        </VStack>
      </SlideFade>
    </>
  )
}
