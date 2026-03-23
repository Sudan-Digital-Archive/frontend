'use client'

import { Box, VStack } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { Login as LoginForm } from '../components/forms/Login'

export default function Login() {
  return (
    <Layout>
      <VStack alignItems="center" justifyContent="center">
        <Box w="100%" p={10}>
          <LoginForm />
        </Box>
      </VStack>
    </Layout>
  )
}
