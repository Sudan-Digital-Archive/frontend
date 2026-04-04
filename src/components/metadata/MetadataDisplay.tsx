import { Stack } from '@chakra-ui/react'
import {
  DateMetadata,
  Subject,
  Creator,
  Location,
  Contributors,
  Relations,
  Description,
  OriginalURL,
} from './index'
import { useTranslation } from 'react-i18next'
import type { Relation } from '../../apiTypes/apiResponses'

interface MetadataDisplayProps {
  subjects: string[] | null
  creator: string | null
  location: string | null
  contributors: string[] | null
  contributorRoles: (string | null)[] | null
  relations: Relation[] | null
  description: string | null
  date: string
  originalUrl: string
  language: string
  isPrivate?: boolean
}

export function MetadataDisplay({
  subjects,
  creator,
  location,
  contributors,
  contributorRoles,
  relations,
  description,
  date,
  originalUrl,
  language,
  isPrivate,
}: MetadataDisplayProps) {
  const { i18n } = useTranslation()
  const fontSize = i18n.language === 'en' ? 'md' : 'lg'
  const hasDescription = description && description.trim().length > 0

  return (
    <Stack gap={0}>
      <DateMetadata date={date} fontSize={fontSize} />
      <Subject subjects={subjects} />
      <Creator creator={creator} />
      <Location location={location} />
      <Contributors
        contributors={contributors}
        contributorRoles={contributorRoles}
      />
      <Relations
        relations={relations}
        language={language}
        isPrivate={isPrivate}
      />
      {hasDescription && (
        <Description
          description={description}
          fontSize={fontSize}
          lineClamp={3}
        />
      )}
      <OriginalURL url={originalUrl} fontSize={fontSize} />
    </Stack>
  )
}
