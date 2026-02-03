import {
  Box,
  VStack,
  Heading,
  Text,
  OrderedList,
  ListItem,
  Link,
} from '@chakra-ui/react'
import { NavLink } from 'react-router'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'

export default function TechnicalStack() {
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
              {t('tech_stack_title')}
            </Heading>

            <Heading as="h6" fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('tech_stack_why_build')}
              <Link
                as={NavLink}
                color="cyan"
                to="https://archive.org"
                isExternal
                variant="underline"
              >
                archive.org
              </Link>
              {t('tech_stack_why_build_2')}
            </Heading>
            <OrderedList>
              <ListItem>
                <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                  {t('tech_stack_point_1_part_1')}
                  <Link
                    as={NavLink}
                    color="cyan"
                    to="https://archive.org"
                    isExternal
                    variant="underline"
                  >
                    archive.org
                  </Link>
                  {t('tech_stack_point_1_part_2')}
                </Text>
              </ListItem>
              <ListItem>
                <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                  {t('tech_stack_point_2_part_1')}
                  <Link
                    as={NavLink}
                    color="cyan"
                    to="https://bayanat.org"
                    isExternal
                    variant="underline"
                  >
                    bayanat.org
                  </Link>
                  {t('tech_stack_point_2_part_2')}
                </Text>
              </ListItem>
              <ListItem>
                <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                  {t('tech_stack_point_3_part_1')}
                  <Link
                    as={NavLink}
                    color="cyan"
                    to="https://browsertrix.com/"
                    isExternal
                    variant="underline"
                  >
                    browsertrix
                  </Link>
                  {t('tech_stack_point_3_part_2')}
                </Text>
              </ListItem>
            </OrderedList>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('tech_stack_final_part_1')}
              <Link
                as={NavLink}
                color="cyan"
                to="https://github.com/orgs/Sudan-Digital-Archive/repositories"
                isExternal
                variant="underline"
              >
                {t('tech_stack_final_link')}
              </Link>
              {t('tech_stack_final_part_2')}
            </Text>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
