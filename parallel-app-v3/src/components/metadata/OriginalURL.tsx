import { Link, Badge, Text, Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export function OriginalURL({
  url,
  fontSize = 'md',
}: {
  url: string
  fontSize?: string
}) {
  const { t } = useTranslation()
  return (
    <Text fontSize={fontSize}>
      <Box as="span" title={url} cursor="pointer">
        <Link href={url} target="_blank" rel="noopener noreferrer">
          <Badge colorPalette="cyan">{t('metadata_original_url_label')}</Badge>
        </Link>
      </Box>
    </Text>
  )
}
