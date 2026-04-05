import { Badge, Box, Em, Link, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { ExternalLink } from 'react-feather'
import type {
  Relation,
  DublinMetadataRelationType,
} from '../../apiTypes/apiResponses'
import { buildArchiveUrl } from '../../utils/url'
import { appConfig } from '../../constants'

interface RelationsProps {
  relations: Relation[] | null
  language: string
  isPrivate?: boolean
}

function formatRelationType(type: DublinMetadataRelationType): string {
  return type.replace(/_/g, ' ')
}

export function Relations({ relations, language, isPrivate }: RelationsProps) {
  const { t, i18n } = useTranslation()
  const fontSize = i18n.language === 'en' ? 'md' : 'lg'
  const hasRelations = relations && relations.length > 0

  const [relatedTitles, setRelatedTitles] = useState<Record<number, string>>({})

  useEffect(() => {
    if (!hasRelations) return

    const fetchRelatedTitles = async () => {
      const titles: Record<number, string> = {}
      for (const relation of relations) {
        try {
          const endpoint = isPrivate
            ? `${appConfig.apiURL}accessions/private/${relation.related_accession_id}`
            : `${appConfig.apiURL}accessions/${relation.related_accession_id}`
          const response = await fetch(endpoint, {
            credentials: 'include',
            headers: { Accept: 'application/json' },
          })
          if (response.ok) {
            const data = await response.json()
            const title =
              language === 'en'
                ? data.accession.title_en
                : data.accession.title_ar
            titles[relation.related_accession_id] =
              title || `Accession ${relation.related_accession_id}`
          }
        } catch {
          titles[relation.related_accession_id] =
            `Accession ${relation.related_accession_id}`
        }
      }
      setRelatedTitles(titles)
    }

    fetchRelatedTitles()
  }, [hasRelations, relations, isPrivate, language])

  return (
    <Box my={hasRelations ? 1 : 0}>
      {hasRelations && (
        <Text fontSize={fontSize}>
          <Badge colorPalette="cyan">{t('metadata_relations_label')}</Badge>{' '}
          {relations.map((relation) => {
            const title =
              relatedTitles[relation.related_accession_id] ||
              `Accession ${relation.related_accession_id}`
            return (
              <Text
                as="span"
                key={`relation-${relation.id}`}
                display="inline-block"
                mr={2}
              >
                <Badge colorPalette="teal" fontSize="xs" mr={1}>
                  <Em>{formatRelationType(relation.relation_type)}</Em>
                </Badge>
                <Link
                  href={buildArchiveUrl(
                    relation.related_accession_id,
                    language,
                    isPrivate,
                  )}
                  target="_blank"
                  textDecoration="none"
                  _hover={{ textDecoration: 'underline', color: 'pink.400' }}
                >
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    px={2}
                    py={0.5}
                    fontSize="sm"
                    bg="pink.600"
                    color="white"
                    borderRadius="full"
                    m={0.5}
                  >
                    {title}
                    <ExternalLink
                      size={10}
                      style={{
                        display: 'inline',
                        marginLeft: '4px',
                      }}
                    />
                  </Box>
                </Link>
              </Text>
            )
          })}
        </Text>
      )}
    </Box>
  )
}
