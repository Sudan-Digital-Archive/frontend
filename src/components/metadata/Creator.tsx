import { Badge, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SubjectTag } from '../SubjectTag'

interface CreatorProps {
  creator: string | null
}

export function Creator({ creator }: CreatorProps) {
  const { t, i18n } = useTranslation()
  const fontSize = i18n.language === 'en' ? 'md' : 'lg'
  const hasCreator = creator && creator.trim().length > 0
  if (!hasCreator) return null
  return (
    <Text fontSize={fontSize}>
      <Badge colorPalette="cyan">{t('metadata_creator_label')}</Badge>{' '}
      <SubjectTag label={creator} />
    </Text>
  )
}
