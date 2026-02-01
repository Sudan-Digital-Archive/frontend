import { Card, CardProps, useColorModeValue } from '@chakra-ui/react'

export const ArchiveCard = (props: CardProps) => {
  // Ensure the card pops against a dark background. 
  // Assuming the user wants a light card on their dark blue background.
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
        borderColor: 'cyan.400' // Subtle highlight on hover to match the theme colors seen in Collections.tsx
      }}
      overflow="hidden"
      {...props}
    />
  )
}
