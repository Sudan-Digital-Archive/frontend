import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Combobox,
  createListCollection,
  Box,
  Tag,
  Wrap,
  Spinner,
  Portal,
} from '@chakra-ui/react'
import { X } from 'react-feather'
import { appConfig } from '../../constants'
import type { AutocompleteOption } from './GenericAutocomplete'

interface SubjectsAutocompleteProps {
  menuPlacement?: 'top' | 'bottom'
  onChange?: (values: readonly AutocompleteOption[]) => void
  defaultValues?: {
    values: number[]
    labels: string[]
  }
  value?: readonly AutocompleteOption[]
  lockedValues?: number[]
  collectionId?: number
}

interface SubjectItem {
  id: number
  subject: string
}

interface ApiResponse {
  items: SubjectItem[]
  num_pages: number
  page: number
  per_page: number
}

export const SubjectsAutocomplete = ({
  menuPlacement = 'bottom',
  onChange,
  defaultValues,
  value,
  lockedValues,
  collectionId,
}: SubjectsAutocompleteProps) => {
  const { t, i18n } = useTranslation()
  const apiLang = i18n.language === 'en' ? 'english' : 'arabic'

  const [items, setItems] = useState<SubjectItem[]>([])
  const [inputValue, setInputValue] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<AutocompleteOption[]>(
    defaultValues
      ? defaultValues.values.map((val, index) => ({
          value: val,
          label: defaultValues.labels[index],
        }))
      : [],
  )

  const latestQueryRef = useRef('')

  const itemsById = useMemo(() => {
    return new Map(items.map((item) => [item.id, item]))
  }, [items])

  const collection = useMemo(() => {
    return createListCollection({
      items: items.map((item) => ({
        label: item.subject,
        value: String(item.id),
      })),
    })
  }, [items])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(inputValue)
    }, 300)
    return () => clearTimeout(handler)
  }, [inputValue])

  const fetchItems = useCallback(
    async (query: string) => {
      setIsLoading(true)
      latestQueryRef.current = query
      try {
        const collectionIdParam =
          collectionId !== undefined ? `&in_collection_id=${collectionId}` : ''
        const queryParam = query
          ? `&query_term=${encodeURIComponent(query)}`
          : ''
        const response = await fetch(
          `${appConfig.apiURL}subjects?page=0&per_page=50&lang=${apiLang}${collectionIdParam}${queryParam}`,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()
        if (latestQueryRef.current !== query) {
          return
        }
        setItems(data.items || [])
      } catch (error) {
        console.error('Error fetching subjects:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [apiLang, collectionId],
  )

  useEffect(() => {
    void fetchItems(debouncedInput)
  }, [fetchItems, debouncedInput])

  useEffect(() => {
    if (value !== undefined) {
      const optionsWithLabels = value.map((v) => {
        const item = itemsById.get(v.value)
        return {
          value: v.value,
          label: item ? item.subject : v.label || t('translation_missing'),
        }
      })
      setSelectedOptions(optionsWithLabels)
    }
  }, [value, itemsById, t])

  const handleValueChange = useCallback(
    (details: { value: string[] }) => {
      const lockedSet = new Set(lockedValues || [])
      const selectedIds = details.value
        .map((idString) => Number(idString))
        .filter((id) => !lockedSet.has(id))

      if (lockedValues && lockedValues.length > 0) {
        for (const lockedId of lockedValues) {
          if (!selectedIds.includes(lockedId)) {
            selectedIds.push(lockedId)
          }
        }
      }

      const nextOptions = selectedIds.map((id) => {
        const existing = selectedOptions.find((o) => o.value === id)
        const item = itemsById.get(id)
        return {
          value: id,
          label: item ? item.subject : existing?.label || String(id),
        }
      })

      setSelectedOptions(nextOptions)
      if (onChange) {
        onChange(nextOptions)
      }
    },
    [lockedValues, itemsById, onChange, selectedOptions],
  )

  const handleRemove = useCallback(
    (idToRemove: number) => {
      if (lockedValues && lockedValues.includes(idToRemove)) {
        return
      }
      const nextOptions = selectedOptions.filter((o) => o.value !== idToRemove)
      setSelectedOptions(nextOptions)
      if (onChange) {
        onChange(nextOptions)
      }
    },
    [lockedValues, onChange, selectedOptions],
  )

  const selectedValueStrings = useMemo(
    () => selectedOptions.map((o) => String(o.value)),
    [selectedOptions],
  )

  return (
    <Box width="100%">
      <Combobox.Root
        multiple
        collection={collection}
        value={selectedValueStrings}
        onValueChange={handleValueChange}
        inputValue={inputValue}
        onInputValueChange={(details) => setInputValue(details.inputValue)}
        closeOnSelect={false}
        openOnClick
        positioning={{
          placement: menuPlacement === 'top' ? 'top-start' : 'bottom-start',
        }}
      >
        <Combobox.Control
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          minH="40px"
          px={2}
          py={1}
          borderWidth="1px"
          borderColor="input.border"
          borderRadius="md"
          bg="input.bg"
          color="input.text"
          _focusWithin={{
            borderColor: 'accent.primary',
          }}
        >
          <Wrap gap={2}>
            {selectedOptions.map((option) => {
              const isLocked = lockedValues?.includes(option.value) || false
              return (
                <Tag.Root
                  key={option.value}
                  size="sm"
                  colorPalette="cyan"
                  variant="subtle"
                >
                  <Tag.Label>{option.label}</Tag.Label>
                  {!isLocked && (
                    <Tag.CloseTrigger
                      onClick={(event) => {
                        event.stopPropagation()
                        handleRemove(option.value)
                      }}
                    >
                      <X size={12} />
                    </Tag.CloseTrigger>
                  )}
                </Tag.Root>
              )
            })}
          </Wrap>
          <Combobox.Input
            flex={1}
            minW="120px"
            bg="transparent"
            border="none"
            color="inherit"
            outline="none"
            placeholder={t('subjects_autocomplete_search')}
          />
          {isLoading && (
            <Box px={2}>
              <Spinner size="sm" />
            </Box>
          )}
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content
              bg="dropdownBg"
              borderWidth="1px"
              borderColor="border"
              borderRadius="md"
            >
              <Combobox.Empty px={3} py={2}>
                {t('subjects_autocomplete_no_found')}
              </Combobox.Empty>
              {collection.items.map((item) => (
                <Combobox.Item
                  key={item.value}
                  item={item}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: 'dropdownHover' }}
                >
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </Box>
  )
}
