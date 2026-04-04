import { Box, Link } from '@chakra-ui/react'
import { buildArchiveUrl } from '../../utils/url'

interface ArchiveLinkProps {
  accessionId: string
  title?: string
  language: string
  isPrivate?: boolean
  url?: string
}

export function ArchiveLink({
  accessionId,
  language,
  isPrivate,
}: ArchiveLinkProps) {
  const href = buildArchiveUrl(accessionId, language, isPrivate)

  return (
    <Box as="span">
      <Link href={href} target="_blank" _hover={{ color: 'pink.400' }}>
        <Box
          as="span"
          display="inline-block"
          px={2}
          py={0.5}
          fontSize="sm"
          bg="pink.600"
          color="white"
          borderRadius="full"
          m={0.5}
        >
          View Original
        </Box>
      </Link>
    </Box>
  )
}
