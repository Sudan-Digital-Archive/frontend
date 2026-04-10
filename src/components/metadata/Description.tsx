import { Box, Button, Text, Badge } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
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
  const [isExpanded, setIsExpanded] = useState(false)
  const hasDescription = description && description.length > 0
  const hasLineClamp = lineClamp !== undefined && lineClamp > 0

  const shouldTruncate = hasLineClamp && !isExpanded
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
          {hasLineClamp && (
            <Button
              variant="ghost"
              size="sm"
              colorPalette="cyan"
              onClick={() => setIsExpanded(!isExpanded)}
              p={0}
              mt={1}
              fontWeight="normal"
            >
              {isExpanded ? t('show_less') : t('show_more')}
            </Button>
          )}
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}
