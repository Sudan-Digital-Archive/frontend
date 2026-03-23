'use client'

import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/Layout'
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
  const fontSize = i18n.language === 'en' ? 'lg' : '2xl'

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
          <VStack gap={2} align="left">
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
              <ol>
                <li>
                  <Text fontSize={fontSize}>
                    <a
                      href="#our-values"
                      style={{ color: '#67e8f9', textDecoration: 'underline' }}
                    >
                      {t('code_of_conduct_our_values_content_heading')}
                    </a>
                  </Text>
                </li>
                <li>
                  <Text fontSize={fontSize}>
                    <a
                      href="#standards-and-inappropriate-behavior"
                      style={{ color: '#67e8f9', textDecoration: 'underline' }}
                    >
                      {t(
                        'code_of_conduct_standards_inappropriate_behavior_heading',
                      )}
                    </a>
                  </Text>
                </li>
                <li>
                  <Text fontSize={fontSize}>
                    <a
                      href="#boundaries"
                      style={{ color: '#67e8f9', textDecoration: 'underline' }}
                    >
                      {t('code_of_conduct_boundaries_heading')}
                    </a>
                  </Text>
                </li>
                <li>
                  <Text fontSize={fontSize}>
                    <a
                      href="#accountability-processes"
                      style={{ color: '#67e8f9', textDecoration: 'underline' }}
                    >
                      {t('code_of_conduct_accountability_processes_heading')}
                    </a>
                  </Text>
                </li>
              </ol>
            </Box>
            <Heading size="md" id="our-values">
              {t('code_of_conduct_our_values_content_heading')}
            </Heading>
            <ul>
              {CoCTranslations.values.map(
                (
                  item: { title: string; description: string },
                  index: number,
                ) => {
                  return (
                    <li key={`our-values-${index}`}>
                      <Text fontSize={fontSize}>
                        <Text as="u" fontSize={fontSize}>
                          {item.title}
                        </Text>
                        . {item.description}
                      </Text>
                    </li>
                  )
                },
              )}
            </ul>
            <Heading size="sm" mb={2}>
              <a
                href="#toc"
                style={{ color: '#67e8f9', textDecoration: 'underline' }}
              >
                {t('code_of_conduct_back_to_top')}
              </a>
            </Heading>
            <Heading size="md" id="standards-and-inappropriate-behavior">
              {t('code_of_conduct_standards_inappropriate_behavior_heading')}
            </Heading>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_one')}
            </Text>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_two')}
            </Text>
            <ul>
              {CoCTranslations.unacceptable_behavior_examples.map(
                (item: string, index: number) => {
                  return (
                    <li key={`unacceptable-behaviors-example-${index}`}>
                      <Text fontSize={fontSize}>{item}</Text>
                    </li>
                  )
                },
              )}
            </ul>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_three')}
            </Text>
            <Heading size="sm" mb={2}>
              <a
                href="#toc"
                style={{ color: '#67e8f9', textDecoration: 'underline' }}
              >
                {t('code_of_conduct_back_to_top')}
              </a>
            </Heading>
            <Heading id="boundaries" size="md">
              {t('code_of_conduct_boundaries_heading')}
            </Heading>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_four')}
            </Text>
            <ol>
              {CoCTranslations.boundaries_steps.map(
                (item: string, index: number) => {
                  return (
                    <li key={`boundaries-steps-${index}`}>
                      <Text fontSize={fontSize}>{item}</Text>
                    </li>
                  )
                },
              )}
            </ol>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_five')}
            </Text>
            <Heading size="sm" mb={2}>
              <a
                href="#toc"
                style={{ color: '#67e8f9', textDecoration: 'underline' }}
              >
                {t('code_of_conduct_back_to_top')}
              </a>
            </Heading>
            <Heading id="accountability-processes" size="md">
              {t('code_of_conduct_accountability_processes_heading')}
            </Heading>
            <Text fontSize={fontSize}>
              {t('code_of_conduct_standards_inappropriate_behavior_para_six')}
            </Text>
            <ol>
              {CoCTranslations.accountability_processes.map(
                (
                  item: { step: string; description: string },
                  index: number,
                ) => {
                  return (
                    <li key={`accountability-${index}`}>
                      <Text fontSize={fontSize}>
                        <Text as="u" fontSize={fontSize}>
                          {item.step}
                        </Text>
                        . {item.description}
                      </Text>
                    </li>
                  )
                },
              )}
            </ol>
            <Heading size="sm" mb={2}>
              <a
                href="#toc"
                style={{ color: '#67e8f9', textDecoration: 'underline' }}
              >
                {t('code_of_conduct_back_to_top')}
              </a>
            </Heading>
          </VStack>
        </Box>
      </Box>
    </Layout>
  )
}
