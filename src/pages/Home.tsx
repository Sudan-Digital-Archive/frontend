import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t, i18n } = useTranslation()

  return (
    <Layout>
      <Box
        as="section"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        maxW="2xl"
        mx="auto"
        pt={10}
        pb={5}
        px={4}
      >
        <VStack spacing={8}>
          <Box>
            <Text
              className="gradientText"
              bgClip="text"
              fontSize="6xl"
              fontWeight="extrabold"
            >
              {t('landing_heading')}
            </Text>
          </Box>
          <Box>
            <Heading
              as="h2"
              size={i18n.language === 'en' ? 'lg' : '2xl'}
              lineHeight="tall"
              fontWeight="medium"
              color="gray.500"
            >
              {t('landing_sentence_one_part_one')}
              <Box as="span" color="gray.200">
                {t('landing_sentence_one_part_two_highlight')}
              </Box>
              {t('landing_sentence_one_part_three')}
              {t('landing_sentence_two_part_one')}
              <Box as="span" color="gray.200">
                {t('landing_sentence_two_part_two_highlight')}
              </Box>
              {t('landing_sentence_two_part_three')}
              <Box as="span" color="gray.200">
                {t('landing_sentence_two_part_four_highlight')}
              </Box>
              {t('landing_sentence_two_part_five')}
              <Box as="span" color="gray.300">
                {t('landing_sentence_two_part_six_highlight')}
              </Box>
              {t('landing_sentence_two_part_seven')}
              <Box as="span" color="gray.300">
                {t('landing_sentence_two_part_eight_highlight')}
              </Box>
              {t('landing_sentence_two_part_nine')}
            </Heading>
          </Box>
        </VStack>
      </Box>
    </Layout>
  )
}
