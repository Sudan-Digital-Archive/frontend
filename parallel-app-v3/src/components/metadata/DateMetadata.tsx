import { Badge, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useParsedDate } from '../../hooks/useParsedDate'

export function DateMetadata({
  date,
  fontSize = 'md',
}: {
  date: string
  fontSize?: string
}) {
  const { t } = useTranslation()
  const { parseDate } = useParsedDate()

  return (
    <Text fontSize={fontSize}>
      <Badge colorPalette="cyan">{t('metadata_date_label')}</Badge>{' '}
      <Text as="i" fontSize={fontSize}>
        {parseDate(date)}
      </Text>
    </Text>
  )
}
