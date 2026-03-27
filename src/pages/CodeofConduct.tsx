import { Box, VStack, Heading, Text, List } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useColorMode } from '../components/ui/color-mode'
import EnCoCTranslations from '../translations/code_of_conduct_en.json'
import ArCoCTranslations from '../translations/code_of_conduct_ar.json'

export default function CodeOfConduct() {
  const { i18n, t } = useTranslation()
  const { colorMode } = useColorMode()
  const { hash, key } = useLocation()
  const [CoCTranslations, setCoCTranslations] = useState(
    i18n.language === 'en' ? EnCoCTranslations : ArCoCTranslations,
  )
  const fontSize = i18n.language === 'en' ? 'lg' : '2xl'

  const linkColor = colorMode === 'dark' ? '#67e8f9' : '#0891b2'

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
        <Box width="100%">
          <VStack gap={4} align="stretch">
            <Heading
              textAlign="center"
              py={4}
              className="gradientTextStatic"
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="bold"
            >
              {t('code_of_conduct_title')}
            </Heading>
            <Box pb={5}>
              <Heading fontSize={fontSize} py={2} id="toc">
                {t('code_of_conduct_toc')}
              </Heading>
              <List.Root as="ol" listStyle="decimal">
                <List.Item fontSize={fontSize}>
                  <a
                    href="#our-values"
                    style={{ color: linkColor, textDecoration: 'underline' }}
                  >
                    {t('code_of_conduct_our_values_content_heading')}
                  </a>
                </List.Item>
                <List.Item fontSize={fontSize}>
                  <a
                    href="#standards-and-inappropriate-behavior"
                    style={{ color: linkColor, textDecoration: 'underline' }}
                  >
                    {t(
                      'code_of_conduct_standards_inappropriate_behavior_heading',
                    )}
                  </a>
                </List.Item>
                <List.Item fontSize={fontSize}>
                  <a
                    href="#boundaries"
                    style={{ color: linkColor, textDecoration: 'underline' }}
                  >
                    {t('code_of_conduct_boundaries_heading')}
                  </a>
                </List.Item>
                <List.Item fontSize={fontSize}>
                  <a
                    href="#accountability-processes"
                    style={{ color: linkColor, textDecoration: 'underline' }}
                  >
                    {t('code_of_conduct_accountability_processes_heading')}
                  </a>
                </List.Item>
              </List.Root>
            </Box>
            <Heading fontSize={fontSize} id="our-values">
              {t('code_of_conduct_our_values_content_heading')}
            </Heading>
            <List.Root as="ul" listStyle="disc">
              {CoCTranslations.values.map(
                (
                  item: { title: string; description: string },
                  index: number,
                ) => {
                  return (
                    <List.Item key={`our-values-${index}`} fontSize={fontSize}>
                      <Text as="u" fontWeight="bold" display="inline">
                        {item.title}
                      </Text>
                      . {item.description}
                    </List.Item>
                  )
                },
              )}
            </List.Root>
            <Text fontSize="sm">
              <a
                href="#toc"
                style={{ color: linkColor, textDecoration: 'underline' }}
              >
                {t('code_of_conduct_back_to_top')}
              </a>
            </Text>
            <Heading
              fontSize={fontSize}
              id="standards-and-inappropriate-behavior"
            >
              {t('code_of_conduct_standards_inappropriate_behavior_heading')}
            </Heading>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_one')}
            </Text>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_two')}
            </Text>
            <List.Root as="ul" listStyle="disc">
              {CoCTranslations.unacceptable_behavior_examples.map(
                (item: string, index: number) => {
                  return (
                    <List.Item
                      key={`unacceptable-behaviors-example-${index}`}
                      fontSize={fontSize}
                    >
                      {item}
                    </List.Item>
                  )
                },
              )}
            </List.Root>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_three')}
            </Text>
            <Text fontSize="sm">
              <a
                href="#toc"
                style={{ color: linkColor, textDecoration: 'underline' }}
              >
                {t('code_of_conduct_back_to_top')}
              </a>
            </Text>
            <Heading id="boundaries" fontSize={fontSize}>
              {t('code_of_conduct_boundaries_heading')}
            </Heading>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_four')}
            </Text>
            <List.Root as="ol" listStyle="decimal">
              {CoCTranslations.boundaries_steps.map(
                (item: string, index: number) => {
                  return (
                    <List.Item
                      key={`boundaries-steps-${index}`}
                      fontSize={fontSize}
                    >
                      {item}
                    </List.Item>
                  )
                },
              )}
            </List.Root>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_five')}
            </Text>
            <Text fontSize="sm">
              <a
                href="#toc"
                style={{ color: linkColor, textDecoration: 'underline' }}
              >
                {t('code_of_conduct_back_to_top')}
              </a>
            </Text>
            <Heading id="accountability-processes" fontSize={fontSize}>
              {t('code_of_conduct_accountability_processes_heading')}
            </Heading>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_six')}
            </Text>
            <List.Root as="ol" listStyle="decimal">
              {CoCTranslations.accountability_processes.map(
                (
                  item: { step: string; description: string },
                  index: number,
                ) => {
                  return (
                    <List.Item
                      key={`accountability-${index}`}
                      fontSize={fontSize}
                    >
                      <Text as="u" fontWeight="bold" display="inline">
                        {item.step}
                      </Text>
                      . {item.description}
                    </List.Item>
                  )
                },
              )}
            </List.Root>
            <Text fontSize="sm">
              <a
                href="#toc"
                style={{ color: linkColor, textDecoration: 'underline' }}
              >
                {t('code_of_conduct_back_to_top')}
              </a>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
