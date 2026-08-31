import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Combobox,
  createListCollection,
  HStack,
  IconButton,
  Portal,
  Spinner,
  Tag,
  Wrap,
} from '@chakra-ui/react'
import { Delete, X } from 'react-feather'
import { appConfig } from '../../constants'
import { useUser } from '../../hooks/useUser'
import { toaster } from '../../components/ui/toaster'

const CREATE_VALUE = '__create__'

export interface AutocompleteOption {
  label: string
  value: number
}

interface GenericAutocompleteProps {
  menuPlacement?: 'top' | 'bottom'
  onChange?: (values: readonly AutocompleteOption[]) => void
  defaultValues?: {
    values: number[]
    labels: string[]
  }
  value?: readonly AutocompleteOption[]
  lockedValues?: number[]
  collectionId?: number
  endpoint: string
  idKey: string
  labelKey: string
  pluralLabel: string
  createPayloadKey: string
}

interface ApiResponse<T> {
  items: T[]
  num_pages: number
  page: number
  per_page: number
}

interface Item {
  id: number
  [key: string]: unknown
}

export const GenericAutocomplete = ({
  onChange,
  menuPlacement = 'bottom',
  defaultValues,
  value,
  lockedValues,
  collectionId,
  endpoint,
  idKey,
  labelKey,
  pluralLabel,
  createPayloadKey,
}: GenericAutocompleteProps) => {
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()
  const apiLang = i18n.language === 'en' ? 'english' : 'arabic'

  const [items, setItems] = useState<Item[]>([])
  const [inputValue, setInputValue] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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
    return new Map(
      items.map((item) => [(item[idKey] as number) ?? item.id, item]),
    )
  }, [items, idKey])

  const itemOptions = useMemo(
    () =>
      items.map((item) => ({
        label: item[labelKey] as string,
        value: String(item[idKey]),
      })),
    [items, idKey, labelKey],
  )

  const itemValues = useMemo(
    () => new Set(itemOptions.map((option) => option.value)),
    [itemOptions],
  )

  const selectedOptionsForCollection = useMemo(
    () =>
      selectedOptions
        .filter((option) => !itemValues.has(String(option.value)))
        .map((option) => ({
          label: option.label,
          value: String(option.value),
        })),
    [selectedOptions, itemValues],
  )

  const allOptions = useMemo(
    () => [...selectedOptionsForCollection, ...itemOptions],
    [itemOptions, selectedOptionsForCollection],
  )

  const showCreateOption = useMemo(() => {
    if (!isLoggedIn) return false
    const trimmed = inputValue.trim()
    if (!trimmed) return false
    return !allOptions.some(
      (option) => option.label.toLowerCase() === trimmed.toLowerCase(),
    )
  }, [isLoggedIn, inputValue, allOptions])

  const createOption = useMemo(
    () => ({
      label: `${t(`${pluralLabel}_autocomplete_create`)} "${inputValue.trim()}"`,
      value: CREATE_VALUE,
    }),
    [inputValue, pluralLabel, t],
  )

  const collectionOptions = useMemo(
    () => (showCreateOption ? [...allOptions, createOption] : allOptions),
    [allOptions, createOption, showCreateOption],
  )

  const collection = useMemo(
    () => createListCollection({ items: collectionOptions }),
    [collectionOptions],
  )

  const visibleOptions = useMemo(
    () => (showCreateOption ? [...itemOptions, createOption] : itemOptions),
    [itemOptions, createOption, showCreateOption],
  )

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
          `${appConfig.apiURL}${endpoint}?page=0&per_page=50&lang=${apiLang}${collectionIdParam}${queryParam}`,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data: ApiResponse<Item> = await response.json()
        if (latestQueryRef.current !== query) {
          return
        }
        setItems(data.items || [])
      } catch (error) {
        console.error(`Error fetching ${pluralLabel}:`, error)
        toaster.create({
          description: t(`${pluralLabel}_autocomplete_error_fetching`),
          type: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [apiLang, collectionId, endpoint, pluralLabel, t],
  )

  useEffect(() => {
    void fetchItems(debouncedInput)
  }, [fetchItems, debouncedInput])

  useEffect(() => {
    if (lockedValues && lockedValues.length > 0 && items.length > 0) {
      const lockedOptions = lockedValues.map((lockedValue) => {
        const item = items.find((i) => i[idKey] === lockedValue)
        return {
          value: lockedValue,
          label: item ? (item[labelKey] as string) : t('translation_missing'),
        }
      })

      setSelectedOptions((prev) => {
        const existingValues = new Set(prev.map((o) => o.value))
        const newLockedOptions = lockedOptions.filter(
          (o) => !existingValues.has(o.value),
        )
        if (newLockedOptions.length === 0) return prev
        return [...prev, ...newLockedOptions]
      })
    }
  }, [lockedValues, items, idKey, labelKey, t])

  useEffect(() => {
    if (value !== undefined) {
      setSelectedOptions((prev) =>
        value.map((v) => {
          const existing = prev.find((option) => option.value === v.value)
          const item = itemsById.get(v.value)
          return {
            value: v.value,
            label: item
              ? (item[labelKey] as string)
              : existing?.label || v.label || String(v.value),
          }
        }),
      )
    }
  }, [value, items, itemsById, labelKey])

  const createNewItem = useCallback(
    async (itemName: string) => {
      setIsCreatingNew(true)
      try {
        const response = await fetch(`${appConfig.apiURL}${endpoint}`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            [createPayloadKey]: itemName,
            lang: apiLang,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const newItem = (await response.json()) as Item

        setItems((prev) => [...prev, newItem])

        const newOption = {
          value: newItem[idKey] as number,
          label: newItem[labelKey] as string,
        }

        setSelectedOptions((prev) => {
          if (prev.some((option) => option.value === newOption.value)) {
            return prev
          }
          const next = [...prev, newOption]
          if (onChange) {
            onChange(next)
          }
          return next
        })

        setInputValue('')

        toaster.create({
          description: t(`${pluralLabel}_autocomplete_create_success`, {
            [labelKey]: newItem[labelKey] as string,
          }),
          type: 'success',
        })
      } catch (error) {
        console.error(`Error creating ${pluralLabel.slice(0, -1)}:`, error)
        toaster.create({
          description: t(`${pluralLabel}_autocomplete_error_creating`),
          type: 'error',
        })
      } finally {
        setIsCreatingNew(false)
      }
    },
    [
      apiLang,
      createPayloadKey,
      endpoint,
      idKey,
      labelKey,
      onChange,
      pluralLabel,
      t,
    ],
  )

  const deleteItem = useCallback(
    async (itemId: number) => {
      setIsDeleting(true)
      try {
        const response = await fetch(
          `${appConfig.apiURL}${endpoint}/${itemId}`,
          {
            credentials: 'include',
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              lang: apiLang,
            }),
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        setItems((prev) => prev.filter((item) => item[idKey] !== itemId))
        setSelectedOptions((prev) => {
          const next = prev.filter((option) => option.value !== itemId)
          if (onChange) {
            onChange(next)
          }
          return next
        })

        toaster.create({
          description: t(`${pluralLabel}_autocomplete_delete_success`),
          type: 'success',
        })
      } catch (error) {
        console.error(`Error deleting ${pluralLabel.slice(0, -1)}:`, error)
        toaster.create({
          description: t(`${pluralLabel}_autocomplete_error_deleting`),
          type: 'error',
        })
      } finally {
        setIsDeleting(false)
      }
    },
    [apiLang, endpoint, idKey, onChange, pluralLabel, t],
  )

  const buildSelectedOptions = useCallback(
    (ids: number[]) => {
      const uniqueIds = Array.from(new Set(ids))

      for (const lockedId of lockedValues || []) {
        if (!uniqueIds.includes(lockedId)) {
          uniqueIds.push(lockedId)
        }
      }

      return uniqueIds.map((id) => {
        const existing = selectedOptions.find((o) => o.value === id)
        const item = itemsById.get(id)
        return {
          value: id,
          label: item
            ? (item[labelKey] as string)
            : existing?.label || String(id),
        }
      })
    },
    [itemsById, labelKey, lockedValues, selectedOptions],
  )

  const handleValueChange = useCallback(
    (details: { value: string[] }) => {
      const trimmedInput = inputValue.trim()
      const hasCreateSelection = details.value.includes(CREATE_VALUE)

      const realValueStrings = details.value.filter(
        (valueString) => valueString !== CREATE_VALUE,
      )
      const realIds = realValueStrings
        .map((valueString) => Number(valueString))
        .filter((id) => !Number.isNaN(id))

      const nextOptions = buildSelectedOptions(realIds)
      setSelectedOptions(nextOptions)

      if (onChange) {
        onChange(nextOptions)
      }

      if (hasCreateSelection && trimmedInput) {
        void createNewItem(trimmedInput)
      }
    },
    [buildSelectedOptions, createNewItem, inputValue, onChange],
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
        disabled={isCreatingNew || isDeleting}
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
              const item = itemsById.get(option.value)
              const displayLabel = item
                ? (item[labelKey] as string)
                : option.label
              return (
                <Tag.Root
                  key={option.value}
                  size="sm"
                  colorPalette="cyan"
                  variant="subtle"
                >
                  <Tag.Label>{displayLabel}</Tag.Label>
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
            placeholder={t(`${pluralLabel}_autocomplete_search`)}
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
                {t(`${pluralLabel}_autocomplete_no_found`)}
              </Combobox.Empty>
              {visibleOptions.map((item) => (
                <Combobox.Item
                  key={item.value}
                  item={item}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: 'dropdownHover' }}
                >
                  {item.value === CREATE_VALUE ? (
                    <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  ) : (
                    <HStack justify="space-between" width="100%">
                      <Combobox.ItemText>{item.label}</Combobox.ItemText>
                      {isLoggedIn && (
                        <IconButton
                          aria-label={t('delete')}
                          size="2xs"
                          colorPalette="red"
                          variant="ghost"
                          _active={{ bg: 'red.700', color: 'white' }}
                          loading={isDeleting}
                          onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            deleteItem(Number(item.value))
                          }}
                        >
                          <Delete size={14} />
                        </IconButton>
                      )}
                    </HStack>
                  )}
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </Box>
  )
}
