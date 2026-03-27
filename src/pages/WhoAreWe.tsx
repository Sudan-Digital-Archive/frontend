import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

export default function WhoAreWe() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
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
              {t('who_are_we_title')}
            </Heading>
            <Heading fontSize={fontSize} fontWeight="semibold">
              {t('who_are_we_heading')}
            </Heading>
            <Text fontSize={fontSize}>{t('who_are_we_para_1')}</Text>
            <Text fontSize={fontSize}>{t('who_are_we_para_2')}</Text>
            <ol
              style={{
                paddingLeft: '1.5rem',
                marginTop: '1rem',
                marginBottom: '1rem',
              }}
            >
              <li style={{ marginBottom: '1rem' }}>
                <Text fontSize={fontSize} fontWeight="bold">
                  {t('who_are_we_point_one')}
                </Text>
                <Text fontSize={fontSize} as="span">
                  {t('who_are_we_point_one_description')}
                </Text>
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <Text fontSize={fontSize} fontWeight="bold">
                  {t('who_are_we_point_two')}
                </Text>
                <Text fontSize={fontSize} as="span">
                  {t('who_are_we_point_two_description_one')}
                </Text>
                <Text
                  color="cyan.300"
                  cursor="pointer"
                  textDecoration="underline"
                  onClick={() => navigate('/code-of-conduct')}
                  display="inline"
                >
                  {t('who_are_we_point_two_coc_link')}
                </Text>
                <Text fontSize={fontSize} as="span">
                  {t('who_are_we_point_two_description_two')}
                </Text>
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <Text fontSize={fontSize} fontWeight="bold">
                  {t('who_are_we_point_three')}
                </Text>
                <Text fontSize={fontSize} as="span">
                  {t('who_are_we_point_three_description')}
                </Text>
              </li>
            </ol>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
