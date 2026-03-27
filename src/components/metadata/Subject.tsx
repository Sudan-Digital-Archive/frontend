import { Text, Badge, Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SubjectTag } from '../SubjectTag'

interface SubjectProps {
  subjects: string[] | null
}

export function Subject({ subjects }: SubjectProps) {
  const { t, i18n } = useTranslation()
  const fontSize = i18n.language === 'en' ? 'md' : 'lg'
  const hasSubjects = subjects && subjects.length > 0
  return (
    <Box my={hasSubjects ? 1 : 0} data-testid="subject-container">
      {hasSubjects ? (
        <Text fontSize={fontSize}>
          <Badge colorPalette="cyan">{t('metadata_subjects_label')}:</Badge>{' '}
          {subjects.map((subject, idx) => (
            <SubjectTag key={`subject-${idx}`} label={subject} />
          ))}
        </Text>
      ) : (
        <Box />
      )}
    </Box>
  )
}
