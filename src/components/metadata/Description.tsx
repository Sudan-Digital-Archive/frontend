import { Box, Text, Badge } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { truncateString } from '../../utils/text'

interface DescriptionProps {
  description: string | null
  fontSize?: string
  maxLength?: number
  lineClamp?: number
}

export function Description({
  description,
  fontSize = 'md',
  maxLength = 200,
  lineClamp,
}: DescriptionProps) {
  const { t } = useTranslation()
  const hasDescription = description && description.length > 0
  const hasLineClamp = lineClamp !== undefined && lineClamp > 0

  const shouldTruncate = hasLineClamp
  const displayText = shouldTruncate
    ? truncateString(description || '', maxLength)
    : description

  return (
    <>
      {hasDescription ? (
        <Box>
          <Text
            fontSize={fontSize}
            lineClamp={shouldTruncate ? lineClamp : undefined}
          >
            <Badge colorPalette="cyan">{t('metadata_description_label')}</Badge>{' '}
            {displayText}
          </Text>
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}
