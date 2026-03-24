'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, HStack, IconButton } from '@chakra-ui/react'
import { CreatableSelect } from 'chakra-react-select'
import type { OptionProps } from 'chakra-react-select'
import { Delete } from 'react-feather'
import { appConfig } from '../../constants'
import type { Subject, SubjectsResponse } from '../../apiTypes/apiResponses'
import type { SubjectOption } from './types'
import { useUser } from '../../hooks/useUser'
import { useToast } from '../../context/ToastContext'
import { useColorMode } from '../ui/color-mode'

interface SubjectsAutocompleteProps {
  menuPlacement?: 'top' | 'bottom'
  onChange?: (values: readonly SubjectOption[]) => void
  defaultValues?: {
    values: number[]
    labels: string[]
  }
  value?: readonly SubjectOption[]
  lockedValues?: number[]
  collectionId?: number
}

export const SubjectsAutocomplete = ({
  onChange,
  menuPlacement = 'bottom',
  defaultValues,
  value,
  lockedValues,
  collectionId,
}: SubjectsAutocompleteProps) => {
  const { t, i18n } = useTranslation()
  const { isLoggedIn } = useUser()
  const { showToast } = useToast()
  const { colorMode } = useColorMode()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingNewSubject, setIsCreatingNewSubject] = useState(false)
  const [isDeletingSubject, setIsDeletingSubject] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<SubjectOption[]>(
    defaultValues
      ? defaultValues.values.map((value, index) => ({
          value,
          label: defaultValues.labels[index],
        }))
      : [],
  )

  useEffect(() => {
    if (lockedValues && lockedValues.length > 0 && subjects.length > 0) {
      const lockedOptions = subjects
        .filter((subject) => lockedValues.includes(subject.id))
        .map((subject) => ({
          value: subject.id,
          label: subject.subject,
        }))

      setSelectedOptions((prev) => {
        const existingValues = new Set(prev.map((o) => o.value))
        const newLockedOptions = lockedOptions.filter(
          (o) => !existingValues.has(o.value),
        )
        return [...prev, ...newLockedOptions]
      })
    }
  }, [lockedValues, subjects])

  const apiLang = i18n.language === 'en' ? 'english' : 'arabic'

  const subjectOptions: SubjectOption[] = subjects.map((subject) => ({
    value: subject.id,
    label: subject.subject,
  }))

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const collectionIdParam =
        collectionId !== undefined ? `&in_collection_id=${collectionId}` : ''
      const response = await fetch(
        `${appConfig.apiURL}metadata-subjects?page=0&per_page=50&lang=${apiLang}${collectionIdParam}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data: SubjectsResponse = await response.json()
      setSubjects(data.items || [])
    } catch (error) {
      console.error('Error fetching subjects:', error)
      showToast(t('subjects_autocomplete_error_fetching_subjects'), 'error')
    } finally {
      setIsLoading(false)
    }
  }, [apiLang, t, collectionId])

  const createNewSubject = async (subjectName: string) => {
    setIsCreatingNewSubject(true)
    try {
      const response = await fetch(`${appConfig.apiURL}metadata-subjects`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          metadata_subject: subjectName,
          lang: apiLang,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const newSubject = await response.json()
      setSubjects((prev) => [...prev, newSubject])

      showToast(
        t('subjects_autocomplete_create_success', {
          subject: newSubject.subject,
        }),
        'success',
      )

      return newSubject
    } catch (error) {
      console.error('Error creating subject:', error)
      showToast(t('subjects_autocomplete_error_creating_subject'), 'error')
      return null
    } finally {
      setIsCreatingNewSubject(false)
    }
  }

  const deleteSubject = async (subjectId: number) => {
    setIsDeletingSubject(true)
    try {
      const response = await fetch(
        `${appConfig.apiURL}metadata-subjects/${subjectId}`,
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

      setSubjects((prev) => prev.filter((s) => s.id !== subjectId))
      setSelectedOptions((prev) => prev.filter((o) => o.value !== subjectId))

      if (onChange) {
        onChange(selectedOptions.filter((o) => o.value !== subjectId))
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
      showToast(t('subjects_autocomplete_error_fetching_subjects'), 'error')
    } finally {
      setIsDeletingSubject(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects, apiLang])

  useEffect(() => {
    if (value !== undefined && subjects.length > 0) {
      const optionsWithLabels = value.map((v) => {
        const subject = subjects.find((s) => s.id === v.value)
        return {
          value: v.value,
          label: subject ? subject.subject : v.label,
        }
      })
      setSelectedOptions(optionsWithLabels)
    }
  }, [value, subjects])

  const handleChange = (newValue: readonly SubjectOption[] | null) => {
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

    setSelectedOptions(safeValue as SubjectOption[])

    if (onChange) {
      onChange(safeValue)
    }
  }

  const handleCreateOption = async (inputValue: string) => {
    const newSubject = await createNewSubject(inputValue)

    if (newSubject) {
      const newOption = {
        value: newSubject.id,
        label: newSubject.subject,
      }
      setSelectedOptions((prev) => [...prev, newOption])

      if (onChange) {
        onChange([...selectedOptions, newOption])
      }
    }
  }

  const CustomOption = (props: OptionProps<SubjectOption>) => {
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
            loading={isDeletingSubject}
            onClick={(e) => {
              e.stopPropagation()
              deleteSubject(props.data.value)
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
          name="subjects"
          options={subjectOptions}
          placeholder={t('subjects_autocomplete_search_subjects')}
          noOptionsMessage={() => t('subjects_autocomplete_no_subjects_found')}
          formatCreateLabel={(inputValue) =>
            `${t('subjects_autocomplete_create')} "${inputValue}"`
          }
          menuPlacement={menuPlacement}
          isLoading={isLoading}
          isDisabled={isLoading || isCreatingNewSubject || isDeletingSubject}
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
          name="subjects"
          options={subjectOptions}
          placeholder={t('subjects_autocomplete_search_subjects')}
          noOptionsMessage={() => t('subjects_autocomplete_no_subjects_found')}
          menuPlacement={menuPlacement}
          isLoading={isLoading}
          isDisabled={isLoading || isCreatingNewSubject || isDeletingSubject}
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
