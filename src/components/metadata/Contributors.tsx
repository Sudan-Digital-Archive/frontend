import { Badge, Box, Text, Em } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SubjectTag } from '../SubjectTag'

interface ContributorsProps {
  contributors: string[] | null
  contributorRoles: (string | null)[] | null
}

export function Contributors({
  contributors,
  contributorRoles,
}: ContributorsProps) {
  const { t, i18n } = useTranslation()
  const fontSize = i18n.language === 'en' ? 'md' : 'lg'
  const hasContributors = contributors && contributors.length > 0

  return (
    <Box my={hasContributors ? 1 : 0}>
      {hasContributors ? (
        <Text fontSize={fontSize}>
          <Badge colorPalette="cyan">{t('metadata_contributors_label')}</Badge>{' '}
          {contributors.map((contributor, idx) => {
            const role = contributorRoles?.[idx]
            return (
              <Text as="span" key={`contributor-${idx}`}>
                <SubjectTag label={contributor} />
                {role && (
                  <>
                    <Em fontSize="xs" ml={2} mr={1}>
                      {t('contributor_has_role')}
                    </Em>
                    <Box
                      as="span"
                      display="inline-block"
                      px={2}
                      py={0.5}
                      fontSize="sm"
                      bg="pink.600"
                      color="white"
                      borderRadius="full"
                      m={0.5}
                    >
                      {role}
                    </Box>
                  </>
                )}
              </Text>
            )
          })}
        </Text>
      ) : (
        <Box />
      )}
    </Box>
  )
}
