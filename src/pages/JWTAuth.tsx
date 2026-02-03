import { useEffect, useState } from 'react'
import {
  Center,
  Spinner,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react'
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router'
import { appConfig } from '../constants.ts'
import Layout from '../components/Layout.tsx'
import { useUser } from '../hooks/useUser'
import { useTranslation } from 'react-i18next'

export default function JWTAuth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setIsLoggedIn } = useUser()
  const { t } = useTranslation()

  useEffect(() => {
    const sessionId = searchParams.get('sessionId')
    const userId = searchParams.get('userId')
    if (sessionId && userId) {
      const authorizeUser = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const response = await fetch(`${appConfig.apiURL}auth/authorize`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ session_id: sessionId, user_id: userId }),
          })

          if (response.status === 200) {
            setIsLoggedIn(true)
            navigate('/archive')
          } else {
            const errorText = await response.text()
            setError(errorText || t('jwt_auth_invalid_link'))
          }
        } catch (error) {
          console.error('Authorization error:', error)
          setError(t('jwt_auth_login_error'))
        } finally {
          setIsLoading(false)
        }
      }

      authorizeUser()
    } else {
      setError(t('jwt_auth_missing_info'))
      setIsLoading(false)
    }
  }, [navigate, searchParams, setIsLoggedIn, t])

  return (
    <Layout>
      <VStack
        alignItems="center"
        justifyContent="center"
        height="100vh"
        spacing={6}
      >
        {isLoading ? (
          <Center>
            <VStack>
              <Spinner size="xl" />
              <Text mt={4}>{t('jwt_auth_logging_in')}</Text>
            </VStack>
          </Center>
        ) : error ? (
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            width="80%"
            maxW="500px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {t('jwt_auth_auth_failed')}
            </AlertTitle>
            <AlertDescription maxWidth="sm">{error}</AlertDescription>
            <Button as={RouterLink} to="/login" colorScheme="cyan" mt={4}>
              {t('jwt_auth_back_to_login')}
            </Button>
          </Alert>
        ) : null}
      </VStack>
    </Layout>
  )
}
