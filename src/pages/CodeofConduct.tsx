import {
  Box,
  VStack,
  Heading,
  Text,
  OrderedList,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import EnCoCTranslations from '../translations/code_of_conduct_en.json'
import ArCoCTranslations from '../translations/code_of_conduct_ar.json'

export default function CodeOfConduct() {
  const { i18n, t } = useTranslation()
  const { hash, key } = useLocation()
  const [CoCTranslations, setCoCTranslations] = useState(
    i18n.language === 'en' ? EnCoCTranslations : ArCoCTranslations,
  )
  useEffect(() => {
    setCoCTranslations(
      i18n.language === 'en' ? EnCoCTranslations : ArCoCTranslations,
    )
  }, [i18n.language])
  useEffect(() => {
    if (hash) {
      const targetElement = document.getElementById(hash.substring(1))
      targetElement?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [key, hash])
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
              {t('code_of_conduct_title')}
            </Heading>
            <Box pb={5}>
              <Heading size="md" py={2} id="toc">
                {t('code_of_conduct_toc')}
              </Heading>
              <OrderedList>
                <ListItem>
                  <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                    <Link href="#our-values">
                      {t('code_of_conduct_our_values_content_heading')}
                    </Link>
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                    <Link href="#standards-and-inappropriate-behavior">
                      {t(
                        'code_of_conduct_standards_inappropriate_behavior_heading',
                      )}
                    </Link>
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                    <Link href="#boundaries">
                      {t('code_of_conduct_boundaries_heading')}
                    </Link>
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                    <Link href="#accountability-processes">
                      {t('code_of_conduct_accountability_processes_heading')}
                    </Link>
                  </Text>
                </ListItem>
              </OrderedList>
            </Box>
            <Heading size="md" id="our-values">
              {t('code_of_conduct_our_values_content_heading')}
            </Heading>
            <UnorderedList>
              {CoCTranslations.values.map((item, index) => {
                return (
                  <ListItem
                    fontSize={i18n.language === 'en' ? 'lg' : '2xl'}
                    key={`our-values-${index}`}
                  >
                    <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                      <Box
                        fontSize={i18n.language === 'en' ? 'lg' : '2xl'}
                        as="u"
                      >
                        {item.title}
                      </Box>
                      . {item.description}
                    </Text>
                  </ListItem>
                )
              })}
            </UnorderedList>
            <Heading size="sm" mb={2}>
              <Link href="#toc">{t('code_of_conduct_back_to_top')}</Link>
            </Heading>
            <Heading size="md" id="standards-and-inappropriate-behavior">
              {t('code_of_conduct_standards_inappropriate_behavior_heading')}
            </Heading>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_one')}
            </Text>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_two')}
            </Text>
            <UnorderedList>
              {CoCTranslations.unacceptable_behavior_examples.map(
                (item, index) => {
                  return (
                    <ListItem
                      fontSize={i18n.language === 'en' ? 'lg' : '2xl'}
                      key={`unacceptable-behaviors-example-${index}`}
                    >
                      <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                        {item}
                      </Text>
                    </ListItem>
                  )
                },
              )}
            </UnorderedList>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_three')}
            </Text>
            <Heading size="sm" mb={2}>
              <Link href="#toc">{t('code_of_conduct_back_to_top')}</Link>
            </Heading>
            <Heading id="boundaries" size="md">
              {t('code_of_conduct_boundaries_heading')}
            </Heading>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_four')}
            </Text>
            <OrderedList>
              {CoCTranslations.boundaries_steps.map((item, index) => {
                return (
                  <ListItem
                    fontSize={i18n.language === 'en' ? 'lg' : '2xl'}
                    key={`boundaries-steps-${index}`}
                  >
                    <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                      {item}
                    </Text>
                  </ListItem>
                )
              })}
            </OrderedList>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_five')}
            </Text>
            <Heading size="sm" mb={2}>
              <Link href="#toc">{t('code_of_conduct_back_to_top')}</Link>
            </Heading>
            <Heading id="accountability-processes" size="md">
              {t('code_of_conduct_accountability_processes_heading')}
            </Heading>
            <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_six')}
            </Text>
            <OrderedList>
              {CoCTranslations.accountability_processes.map((item, index) => {
                return (
                  <ListItem
                    fontSize={i18n.language === 'en' ? 'lg' : '2xl'}
                    key={`our-values-${index}`}
                  >
                    <Text fontSize={i18n.language === 'en' ? 'lg' : '2xl'}>
                      <Box
                        fontSize={i18n.language === 'en' ? 'lg' : '2xl'}
                        as="u"
                      >
                        {item.step}
                      </Box>
                      . {item.description}
                    </Text>
                  </ListItem>
                )
              })}
            </OrderedList>
            <Heading size="sm" mb={2}>
              <Link href="#toc">{t('code_of_conduct_back_to_top')}</Link>
            </Heading>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
