import {
  Box,
  VStack,
  Heading,
  Text,
  OrderedList,
  ListItem,
  Link,
} from '@chakra-ui/react'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
export default function WhoAreWe() {
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
              {t('who_are_we_title')}
            </Heading>
            <Heading as="h5" fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('who_are_we_heading')}
            </Heading>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('who_are_we_para_1')}
            </Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('who_are_we_para_2')}
            </Text>
            <OrderedList>
              <ListItem fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'} as="b">
                  {t('who_are_we_point_one')}
                </Text>
                {t('who_are_we_point_one_description')}
              </ListItem>
              <ListItem fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'} as="b">
                  {t('who_are_we_point_two')}
                </Text>
                {t('who_are_we_point_two_description_one')}
                <Link
                  color="cyan"
                  as={NavLink}
                  to="/code-of-conduct"
                  variant="underline"
                >
                  {t('who_are_we_point_two_coc_link')}
                </Link>
                {t('who_are_we_point_two_description_two')}
              </ListItem>
              <ListItem fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'} as="b">
                  {t('who_are_we_point_three')}
                </Text>
                {t('who_are_we_point_three_description')}
              </ListItem>
            </OrderedList>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}></Text>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
