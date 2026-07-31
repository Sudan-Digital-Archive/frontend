import { Text, Badge } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SubjectTag } from '../SubjectTag'

interface SubjectProps {
  subjects: string[] | null
}

export function Subject({ subjects }: SubjectProps) {
  const { t, i18n } = useTranslation()
  const fontSize = i18n.language === 'en' ? 'md' : 'lg'
  const hasSubjects = subjects && subjects.length > 0
  if (!hasSubjects) return null
  return (
    <Text fontSize={fontSize}>
      <Badge colorPalette="cyan">{t('metadata_subjects_label')}:</Badge>{' '}
      {subjects.map((subject, idx) => (
        <SubjectTag key={`subject-${idx}`} label={subject} />
      ))}
    </Text>
  )
}
