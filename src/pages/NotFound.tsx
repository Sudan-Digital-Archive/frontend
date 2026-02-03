import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <Layout>
      <Box
        as="section"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="70vh"
        textAlign="center"
        px={4}
      >
        <VStack spacing={8} maxW="2xl">
          <Box>
            <Text
              className="gradientText"
              bgClip="text"
              fontSize="9xl"
              fontWeight="extrabold"
              bgGradient="linear(to-r, cyan.300, pink.600)"
            >
              404
            </Text>
          </Box>
          <Box>
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, cyan.300, pink.600)"
              bgClip="text"
            >
              {t('not_found_title')}
            </Heading>
            <Text fontSize="xl" color="gray.400" mb={8}>
              {t('not_found_message')}
            </Text>
          </Box>
        </VStack>
      </Box>
    </Layout>
  )
}
