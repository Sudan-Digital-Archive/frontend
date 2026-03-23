import { Badge, Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { truncateString } from '../../utils/text'

interface TitleProps {
  title: string
  fontSize?: string
  truncate?: boolean
  maxLength?: number
}

export function Title({
  title,
  fontSize = 'md',
  truncate = false,
  maxLength = 200,
}: TitleProps) {
  const { t } = useTranslation()
  const displayText = truncate ? truncateString(title || '', maxLength) : title

  return (
    <Heading as="h5" size="sm" fontSize={fontSize}>
      <Badge colorPalette="cyan" fontSize="0.9em">
        {t('metadata_title_label')}
      </Badge>{' '}
      {displayText}
    </Heading>
  )
}
