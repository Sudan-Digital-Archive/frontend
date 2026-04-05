import { Badge, Box, Em, Text } from '@chakra-ui/react'
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
                      <Badge colorPalette="teal" fontSize="xs">
                        {t('contributor_has_role')}
                      </Badge>
                    </Em>
                    <SubjectTag label={role} />
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
