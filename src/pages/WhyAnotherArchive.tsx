import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'
export default function WhyAnotherArchive() {
  const { t, i18n } = useTranslation()

  return (
    <Layout>
      <Box
        as="section"
        display="flex"
        alignItems="center"
        maxW="2xl"
        mx="auto"
        px={4}
      >
        <Box>
          <VStack spacing={2} align="left">
            <Heading
              textAlign="center"
              py={2}
              bgGradient="linear(to-r, cyan.300, pink.600)"
              bgClip="text"
            >
              {t('why_another_archive_title')}
            </Heading>

            <Heading as="h6" fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('why_another_archive_heading')}
            </Heading>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('why_another_archive_para_one')}
            </Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('why_another_archive_para_two')}
            </Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('why_another_archive_para_three')}
            </Text>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
