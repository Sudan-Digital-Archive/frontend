import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, HStack, IconButton } from '@chakra-ui/react'
import { CreatableSelect } from 'chakra-react-select'
import type { OptionProps } from 'chakra-react-select'
import { Delete } from 'react-feather'
import { appConfig } from '../../constants'
import { useUser } from '../../hooks/useUser'
import { useToast } from '../../context/ToastContext'
import { useColorMode } from '../ui/color-mode'

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
  const { showToast } = useToast()
  const { colorMode } = useColorMode()
  const [items, setItems] = useState<Item[]>([])
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

  useEffect(() => {
    if (lockedValues && lockedValues.length > 0 && items.length > 0) {
      const lockedOptions = items
        .filter((item) => lockedValues.includes(item[idKey] as number))
        .map((item) => ({
          value: item[idKey] as number,
          label: item[labelKey] as string,
        }))

      setSelectedOptions((prev) => {
        const existingValues = new Set(prev.map((o) => o.value))
        const newLockedOptions = lockedOptions.filter(
          (o) => !existingValues.has(o.value),
        )
        return [...prev, ...newLockedOptions]
      })
    }
  }, [lockedValues, items, idKey, labelKey])

  const apiLang = i18n.language === 'en' ? 'english' : 'arabic'

  const options: AutocompleteOption[] = items.map((item) => ({
    value: item[idKey] as number,
    label: item[labelKey] as string,
  }))

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const collectionIdParam =
        collectionId !== undefined ? `&in_collection_id=${collectionId}` : ''
      const response = await fetch(
        `${appConfig.apiURL}${endpoint}?page=0&per_page=50&lang=${apiLang}${collectionIdParam}`,
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
      setItems(data.items || [])
    } catch (error) {
      console.error(`Error fetching ${pluralLabel}:`, error)
      showToast(t(`${pluralLabel}_autocomplete_error_fetching`), 'error')
    } finally {
      setIsLoading(false)
    }
  }, [apiLang, t, collectionId, showToast, endpoint, pluralLabel])

  const createNewItem = async (itemName: string) => {
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
      const newItem = await response.json()
      setItems((prev) => [...prev, newItem])

      showToast(
        t(`${pluralLabel}_autocomplete_create_success`, {
          [createPayloadKey]: newItem[labelKey] as string,
        }),
        'success',
      )

      return newItem
    } catch (error) {
      console.error(`Error creating ${pluralLabel.slice(0, -1)}:`, error)
      showToast(t(`${pluralLabel}_autocomplete_error_creating`), 'error')
      return null
    } finally {
      setIsCreatingNew(false)
    }
  }

  const deleteItem = async (itemId: number) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`${appConfig.apiURL}${endpoint}/${itemId}`, {
        credentials: 'include',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          lang: apiLang,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setItems((prev) => prev.filter((item) => item[idKey] !== itemId))
      setSelectedOptions((prev) =>
        prev.filter((option) => option.value !== itemId),
      )

      if (onChange) {
        onChange(selectedOptions.filter((o) => o.value !== itemId))
      }

      showToast(t(`${pluralLabel}_autocomplete_delete_success`), 'success')
    } catch (error) {
      console.error(`Error deleting ${pluralLabel.slice(0, -1)}:`, error)
      showToast(t(`${pluralLabel}_autocomplete_error_deleting`), 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [fetchItems, apiLang])

  useEffect(() => {
    if (value !== undefined && items.length > 0) {
      const optionsWithLabels = value.map((v) => {
        const item = items.find((i) => i[idKey] === v.value)
        return {
          value: v.value,
          label: item ? (item[labelKey] as string) : v.label,
        }
      })
      setSelectedOptions(optionsWithLabels)
    }
  }, [value, items, idKey, labelKey])

  const handleChange = (newValue: readonly AutocompleteOption[] | null) => {
    const safeValue = newValue || []
    if (lockedValues && lockedValues.length > 0) {
      const lockedSet = new Set(lockedValues)
      const hasRemovedLocked = selectedOptions.some(
        (option) =>
          lockedSet.has(option.value) &&
          !safeValue.some((nv) => nv.value === option.value),
      )

      if (hasRemovedLocked) {
        const lockedOptions = selectedOptions.filter((option) =>
          lockedSet.has(option.value),
        )
        const combinedValue = [
          ...safeValue.filter((nv) => !lockedSet.has(nv.value)),
          ...lockedOptions,
        ]
        setSelectedOptions(combinedValue)

        if (onChange) {
          onChange(combinedValue)
        }
        return
      }
    }

    setSelectedOptions(safeValue as AutocompleteOption[])

    if (onChange) {
      onChange(safeValue)
    }
  }

  const handleCreateOption = async (inputValue: string) => {
    const newItem = await createNewItem(inputValue)

    if (newItem) {
      const newOption = {
        value: newItem[idKey] as number,
        label: newItem[labelKey] as string,
      }
      setSelectedOptions((prev) => [...prev, newOption])

      if (onChange) {
        onChange([...selectedOptions, newOption])
      }
    }
  }

  const CustomOption = (props: OptionProps<AutocompleteOption>) => {
    return (
      <HStack
        {...props.innerProps}
        px={4}
        py={2}
        bg={props.isFocused ? 'bg.emphasized' : 'transparent'}
        justify="space-between"
        width="100%"
        cursor="pointer"
      >
        <Box>{props.data.label}</Box>
        {isLoggedIn && (
          <IconButton
            aria-label="Delete"
            size="sm"
            colorPalette="red"
            variant="ghost"
            _active={{ bg: 'red.700', color: 'white' }}
            loading={isDeleting}
            onClick={(e) => {
              e.stopPropagation()
              deleteItem(props.data.value)
            }}
          >
            <Delete size={14} />
          </IconButton>
        )}
      </HStack>
    )
  }

  return (
    <Box width="100%" position="relative">
      {isLoggedIn ? (
        <CreatableSelect
          isMulti
          name={pluralLabel}
          options={options}
          placeholder={t(`${pluralLabel}_autocomplete_search`)}
          noOptionsMessage={() => t(`${pluralLabel}_autocomplete_no_found`)}
          formatCreateLabel={(inputValue) =>
            `${t(`${pluralLabel}_autocomplete_create`)} "${inputValue}"`
          }
          menuPlacement={menuPlacement}
          isLoading={isLoading}
          isDisabled={isLoading || isCreatingNew || isDeleting}
          value={selectedOptions}
          onChange={handleChange}
          onCreateOption={handleCreateOption}
          chakraStyles={{
            control: (provided) => ({
              ...provided,
              border: `1px solid ${colorMode === 'dark' ? '#4b5563' : '#9ca3af'}`,
              borderRadius: '6px',
              backgroundColor: colorMode === 'dark' ? '#252525' : '#ffffff',
            }),
            loadingIndicator: (provided) => ({
              ...provided,
              mr: 2,
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              bg: 'transparent',
              px: 2,
              cursor: 'pointer',
            }),
            clearIndicator: (provided) => ({
              ...provided,
              bg: 'transparent',
              px: 2,
              cursor: 'pointer',
            }),
            valueContainer: (provided) => ({
              ...provided,
              p: '8px',
              flexWrap: 'wrap',
              gap: '4px',
            }),
          }}
          components={{
            Option: CustomOption,
          }}
          closeMenuOnSelect={false}
          size="md"
          hideSelectedOptions={false}
          controlShouldRenderValue={true}
        />
      ) : (
        <CreatableSelect
          isMulti
          name={pluralLabel}
          options={options}
          placeholder={t(`${pluralLabel}_autocomplete_search`)}
          noOptionsMessage={() => t(`${pluralLabel}_autocomplete_no_found`)}
          menuPlacement={menuPlacement}
          isLoading={isLoading}
          isDisabled={isLoading || isCreatingNew || isDeleting}
          value={selectedOptions}
          onChange={handleChange}
          chakraStyles={{
            control: (provided) => ({
              ...provided,
              border: `1px solid ${colorMode === 'dark' ? '#4b5563' : '#9ca3af'}`,
              borderRadius: '6px',
              backgroundColor: colorMode === 'dark' ? '#252525' : '#ffffff',
            }),
            loadingIndicator: (provided) => ({
              ...provided,
              mr: 2,
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              bg: 'transparent',
              px: 2,
              cursor: 'pointer',
            }),
            clearIndicator: (provided) => ({
              ...provided,
              bg: 'transparent',
              px: 2,
              cursor: 'pointer',
            }),
            valueContainer: (provided) => ({
              ...provided,
              p: '8px',
              flexWrap: 'wrap',
              gap: '4px',
            }),
          }}
          components={{
            Option: CustomOption,
          }}
          closeMenuOnSelect={false}
          size="md"
          hideSelectedOptions={false}
          controlShouldRenderValue={true}
        />
      )}
    </Box>
  )
}
