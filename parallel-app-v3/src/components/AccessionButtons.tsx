'use client'

import { Button, HStack, Box } from '@chakra-ui/react'
import { Copy, ExternalLink } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useState, useCallback } from 'react'

interface AccessionButtonsProps {
  onOpen: () => void
  id?: string
  lang?: string
}

const AccessionButtons = ({
  onOpen,
  id: _id,
  lang: _lang,
}: AccessionButtonsProps) => {
  const { t } = useTranslation()
  const [showCopiedToast, setShowCopiedToast] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 2000)
  }, [])

  return (
    <HStack gap={2}>
      {showCopiedToast && (
        <Box
          position="fixed"
          top={4}
          right={4}
          p={3}
          bg="green.500"
          color="white"
          borderRadius="md"
          zIndex={9999}
        >
          {t('link_copied')}
        </Box>
      )}
      <Button size="sm" colorPalette="cyan" onClick={handleCopy}>
        <Copy size={14} style={{ marginRight: '4px' }} />
        {t('copy_record')}
      </Button>
      <Button size="sm" colorPalette="cyan" onClick={onOpen}>
        <ExternalLink size={14} style={{ marginRight: '4px' }} />
        {t('view_accession_see_metadata')}
      </Button>
    </HStack>
  )
}

export default AccessionButtons
