import { Box } from '@chakra-ui/react'

interface SubjectTagProps {
  label: string
}

export const SubjectTag = ({ label }: SubjectTagProps) => {
  return (
    <Box
      as="span"
      display="inline-block"
      px={2}
      py={0.5}
      fontSize="sm"
      bg="cyan.700"
      color="cyan.100"
      borderRadius="full"
      m={0.5}
    >
      {label}
    </Box>
  )
}
