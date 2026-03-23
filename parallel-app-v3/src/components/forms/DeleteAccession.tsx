'use client'

import { useState, useRef } from 'react'
import { Button, Box, Text, VStack, Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { appConfig } from '../../constants'

interface DeleteAccessionProps {
  accessionId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const DeleteAccession: React.FC<DeleteAccessionProps> = ({
  accessionId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showToast, setShowToast] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(
        `${appConfig.apiURL}accessions/${accessionId}`,
        {
          credentials: 'include',
          method: 'DELETE',
        },
      )

      if (response.ok) {
        setShowToast({
          type: 'success',
          message: t('delete_accession_success_toast_description'),
        })
        onSuccess()
        onClose()
      } else {
        setShowToast({
          type: 'error',
          message: t('delete_accession_error_toast_description'),
        })
      }
    } catch (error) {
      console.error('Error deleting accession:', error)
      setShowToast({
        type: 'error',
        message: t('delete_accession_error_toast_description'),
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {showToast && (
        <Box
          position="fixed"
          top={4}
          right={4}
          p={3}
          bg={showToast.type === 'success' ? 'green.500' : 'red.500'}
          color="white"
          borderRadius="md"
          zIndex={9999}
        >
          {showToast.message}
        </Box>
      )}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.700"
        zIndex={1000}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box bg="gray.800" p={6} borderRadius="md" maxW="500px" mx={4}>
          <VStack gap={4} align="stretch">
            <Heading size="md">{t('delete_accession_alert_header')}</Heading>
            <Text>{t('delete_accession_alert_body')}</Text>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button ref={cancelRef} onClick={onClose} variant="outline">
                {t('delete_accession_cancel_button')}
              </Button>
              <Button
                colorPalette="red"
                onClick={handleDelete}
                loading={isDeleting}
              >
                {t('delete_accession_confirm_button')}
              </Button>
            </Box>
          </VStack>
        </Box>
      </Box>
    </>
  )
}
