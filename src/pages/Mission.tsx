
import { Box, VStack, Heading, Text, Image } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import atbara from './hussein_merghani.jpg'
import kandaka from './merghani_salih_kandaka.jpg'

export default function Mission() {
  const { t, i18n } = useTranslation()
  const fontSize = i18n.language === 'en' ? 'lg' : '2xl'

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
        <Box width="100%">
          <VStack gap={4} align="stretch">
            <Heading
              textAlign="center"
              py={4}
              className="gradientTextStatic"
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="bold"
            >
              {t('mission_title')}
            </Heading>
            <Box display="flex" justifyContent="center" py={4}>
              <Image
                boxSize="lg"
                objectFit="cover"
                src={kandaka}
                alt={t('mission_image_one_alt')}
              />
            </Box>
            <Text as="i" textAlign="center" fontStyle="italic">
              {t('mission_image_one_caption')}
            </Text>
            <Text fontSize={fontSize}>{t('mission_para_one')}</Text>
            <Text fontSize={fontSize} fontWeight="bold">
              {t('mission_para_two')}
            </Text>
            <Text fontSize={fontSize}>{t('mission_para_three')}</Text>
            <Text fontSize={fontSize}>{t('mission_para_four')}</Text>
            <Text fontSize={fontSize}>{t('mission_para_five')}</Text>
            <Text fontSize={fontSize}>{t('mission_para_six')}</Text>
            <Box display="flex" justifyContent="center" py={4}>
              <Image
                boxSize="lg"
                objectFit="cover"
                src={atbara}
                alt={t('mission_image_two_alt')}
              />
            </Box>
            <Text as="i" textAlign="center" fontStyle="italic">
              {t('mission_image_two_caption')}
            </Text>

            <Text fontSize={fontSize}>{t('mission_para_seven')}</Text>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
