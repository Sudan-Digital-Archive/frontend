import { Text, Badge } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { truncateString } from '../../utils/text'

interface DescriptionProps {
  description: string | null
  fontSize?: string
  truncate?: boolean
  maxLength?: number
}

export function Description({
  description,
  fontSize = 'md',
  truncate = false,
  maxLength = 200,
}: DescriptionProps) {
  const { t } = useTranslation()
  const displayText = truncate
    ? truncateString(description || '', maxLength)
    : description
  const hasDescription = description && description.length > 0

  return (
    <>
      {hasDescription ? (
        <Text fontSize={fontSize}>
          <Badge colorPalette="cyan">{t('metadata_description_label')}</Badge>{' '}
          {displayText}
        </Text>
      ) : (
        <></>
      )}
    </>
  )
}
