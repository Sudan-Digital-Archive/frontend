import { useState, useCallback } from 'react'

interface UseDisclosureReturn {
  open: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
  onOpenChange: (open: boolean) => void
}

export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
  const [open, setOpen] = useState(defaultOpen)

  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])
  const onToggle = useCallback(() => setOpen((prev) => !prev), [])
  const onOpenChange = useCallback((open: boolean) => setOpen(open), [])

  return { open, onOpen, onClose, onToggle, onOpenChange }
}
