import { Box, Heading, Text } from '@chakra-ui/react'

interface CollectionHeaderProps {
  title: string
  description: string
}

export function CollectionHeader({
  title,
  description,
}: CollectionHeaderProps) {
  return (
    <Box>
      <Heading
        textAlign="center"
        py={2}
        bgGradient="linear(to-r, cyan.300, pink.600)"
        bgClip="text"
      >
        {title}
      </Heading>
      <Text textAlign="left" fontSize="lg" fontStyle="italic" mt={3} mb={5}>
        {description}
      </Text>
    </Box>
  )
}
