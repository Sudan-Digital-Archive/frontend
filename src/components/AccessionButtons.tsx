import { Button, HStack } from '@chakra-ui/react'
import { Copy, ExternalLink } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { toaster } from '../components/ui/toaster'

interface AccessionButtonsProps {
  onOpen: () => void
}

const AccessionButtons = ({ onOpen }: AccessionButtonsProps) => {
  const { t } = useTranslation()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    toaster.create({
      description: t('link_copied'),
      type: 'success',
    })
  }, [t])

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
