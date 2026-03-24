'use client'

import { Button, HStack } from '@chakra-ui/react'
import { Copy, ExternalLink } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { useToast } from '../context/ToastContext'

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
  const { showToast } = useToast()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    showToast(t('link_copied'), 'success')
  }, [showToast, t])

  return (
    <HStack gap={2}>
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
