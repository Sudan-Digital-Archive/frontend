import { Badge, Box, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useParsedDate } from '../../hooks/useParsedDate'

interface DublinMetadataIdentifierProps {
  url: string
  crawlTimestamp: string
  fontSize?: string
}

const URL_TRUNCATE_LENGTH = 60

export function DublinMetadataIdentifier({
  url,
  crawlTimestamp,
  fontSize = 'md',
}: DublinMetadataIdentifierProps) {
  const { t } = useTranslation()
  const { parseDate } = useParsedDate()
  const [isExpanded, setIsExpanded] = useState(false)

  const formattedTimestamp = parseDate(crawlTimestamp)
  const needsTruncation = url.length > URL_TRUNCATE_LENGTH

  const displayUrl =
    isExpanded || !needsTruncation
      ? url
      : url.slice(0, URL_TRUNCATE_LENGTH) + '...'

  return (
    <Text fontSize={fontSize}>
      <Badge colorPalette="cyan">{t('metadata_identifier_label')}</Badge>{' '}
      <Box as="span" display="inline-block" wordBreak="break-all">
        {displayUrl}
        {formattedTimestamp && (
          <Text as="span" fontSize="sm" color="fg.muted">
            {' (' +
              t('dublin_metadata_captured') +
              ' ' +
              formattedTimestamp +
              ')'}
          </Text>
        )}
        {needsTruncation && (
          <Text
            as="span"
            ml={2}
            fontSize="sm"
            color="cyan.600"
            cursor="pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            [{isExpanded ? t('show_less') : t('show_more')}]
          </Text>
        )}
      </Box>
    </Text>
  )
}
