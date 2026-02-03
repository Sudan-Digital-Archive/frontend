import { Box, VStack, Heading, Text, Image } from '@chakra-ui/react'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'
import atbara from './hussein_merghani.jpg'
import kandaka from './merghani_salih_kandaka.jpg'

export default function Mission() {
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
              py={2}
              bgGradient="linear(to-r, cyan.300, pink.600)"
              bgClip="text"
            >
              {t('mission_title')}
            </Heading>
            <Image
              boxSize="lg"
              objectFit="cover"
              src={kandaka}
              alt={t('mission_image_one_alt')}
              fallback={<Box boxSize="lg" />}
            />
            <Text as="i">{t('mission_image_one_caption')}</Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('mission_para_one')}
            </Text>
            <Text as="b" fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('mission_para_two')}
            </Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('mission_para_three')}
            </Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('mission_para_four')}
            </Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('mission_para_five')}
            </Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('mission_para_six')}
            </Text>
            <Image
              boxSize="lg"
              objectFit="cover"
              src={atbara}
              alt={t('mission_image_two_alt')}
              fallback={<Box boxSize="lg" />}
            />
            <Text as="i">{t('mission_image_two_caption')}</Text>

            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('mission_para_seven')}
            </Text>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
