import {
  Box,
  Heading,
  Button,
  useClipboard,
  useToast,
  Text,
  VStack,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'

export default function ContactUs() {
  const { t } = useTranslation()
  const email = 'info@sudandigitalarchive.com'
  const { onCopy } = useClipboard(email)
  const toast = useToast()

  const handleCopy = () => {
    onCopy()
    toast({
      title: t('email_copied'),
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Layout>
      <Box
        as="section"
        display="flex"
        alignItems="center"
        justifyContent="center"
        maxW="2xl"
        mx="auto"
        pt={10}
      >
        <VStack spacing={8}>
          <Heading
            textAlign="center"
            className="gradientText"
            bgClip="text"
            fontSize="4xl"
          >
            {t('get_in_touch')}
          </Heading>
          <Button
            colorScheme="cyan"
            size="md"
            variant="ghost"
            onClick={handleCopy}
            rightIcon={<CopyIcon />}
          >
            <Text as="i" mx={2}>
              {email}
            </Text>
          </Button>
        </VStack>
      </Box>
    </Layout>
  )
}
