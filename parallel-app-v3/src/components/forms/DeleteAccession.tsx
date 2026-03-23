'use client'

import { useState, useRef } from 'react'
import { Button, Box, Text, VStack, Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { appConfig } from '../../constants'
import { useToast } from '../../context/ToastContext'

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
  const { showToast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
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
        showToast(t('delete_accession_success_toast_description'), 'success')
        onSuccess()
        onClose()
      } else {
        showToast(t('delete_accession_error_toast_description'), 'error')
      }
    } catch (error) {
      console.error('Error deleting accession:', error)
      showToast(t('delete_accession_error_toast_description'), 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
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
        <Box
          bg="bg.subtle"
          p={6}
          borderRadius="md"
          maxW="500px"
          mx={4}
          border="1px solid"
          borderColor="border"
        >
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
