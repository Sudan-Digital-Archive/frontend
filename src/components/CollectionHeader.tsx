import { Box, Heading, Text } from '@chakra-ui/react'
import type { Collection } from '../apiTypes/apiResponses'

interface CollectionHeaderProps {
  collection: Collection
}

export function CollectionHeader({ collection }: CollectionHeaderProps) {
  return (
    <Box textAlign="center">
      <Heading
        size="xl"
        bgGradient="linear(to-r, cyan.300, pink.600)"
        bgClip="text"
        mb={4}
      >
        {collection.title}
      </Heading>
      <Text fontSize="lg" color="fg.muted">
        {collection.description}
      </Text>
    </Box>
  )
}
