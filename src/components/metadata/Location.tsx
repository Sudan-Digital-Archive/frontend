import { Badge, Box, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { SubjectTag } from '../SubjectTag'

interface LocationProps {
  location: string | null
}

export function Location({ location }: LocationProps) {
  const { t, i18n } = useTranslation()
  const fontSize = i18n.language === 'en' ? 'md' : 'lg'
  const hasLocation = location && location.trim().length > 0
  return (
    <Box my={hasLocation ? 1 : 0}>
      {hasLocation ? (
        <Text fontSize={fontSize}>
          <Badge colorPalette="cyan">{t('metadata_location_label')}</Badge>{' '}
          <SubjectTag label={location} />
        </Text>
      ) : (
        <Box />
      )}
    </Box>
  )
}
