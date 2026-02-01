import { Card, CardProps, useColorModeValue } from '@chakra-ui/react'

export const ArchiveCard = (props: CardProps) => {
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Card
      bg={bg}
      boxShadow="xl"
      borderRadius="xl"
      border="1px solid"
      borderColor="transparent"
      transition="all 0.3s ease-in-out"
      _hover={{
        boxShadow: '2xl',
        transform: 'translateY(-5px)',
        borderColor: 'cyan.400',
      }}
      overflow="hidden"
      {...props}
    />
  )
}
