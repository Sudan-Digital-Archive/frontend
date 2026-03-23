'use client'

import {
  Button,
  Box,
  Flex,
  Spinner,
  Center,
  Text,
  Field,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { appConfig } from '../../constants'

export function Login() {
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState('')

  const validateEmail = (value: string) => {
    if (!value) {
      return t('login_email_required')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return t('login_invalid_email')
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }

    setIsSubmitting(true)
    setIsSuccess(false)
    setIsError('')

    const response = await fetch(`${appConfig.apiURL}auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    })

    if (response.status === 200) {
      setIsSuccess(true)
      setEmail('')
    } else {
      const responseText = await response.text()
      setIsError(responseText)
      console.error(responseText)
    }
    setIsSubmitting(false)
  }

  return (
    <Flex align="center" justify="center">
      <Box width="100%" maxWidth="500px" padding="4">
        <form onSubmit={handleSubmit} noValidate>
          <Field.Root invalid={!!emailError}>
            <Field.Label>{t('login_email_address')}</Field.Label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailError(validateEmail(email))}
              placeholder={t('login_enter_email')}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid',
              }}
            />
            <Field.ErrorText>{emailError}</Field.ErrorText>
          </Field.Root>

          <Button
            mt={4}
            colorPalette="cyan"
            type="submit"
            width="100%"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size="sm" /> : t('login_request_link')}
          </Button>

          {isSuccess && (
            <Center mt={4} color="green.500">
              <Text mr={2}>✓</Text>
              <Text>{t('login_email_sent')}</Text>
            </Center>
          )}

          {isError && (
            <Center mt={4} color="red.500">
              <Text mr={2}>⚠</Text>
              <Text>{isError}</Text>
            </Center>
          )}
        </form>
      </Box>
    </Flex>
  )
}
