import {
  Button,
  Box,
  Input,
  Textarea,
  Text,
  Flex,
  Heading,
  VStack,
  HStack,
  Checkbox,
  RadioGroup,
} from '@chakra-ui/react'
import { ArchiveDatePicker } from '../DatePicker'
import { useTranslation } from 'react-i18next'
import { appConfig } from '../../constants'
import { useState, useEffect, useCallback } from 'react'
import { SubjectsAutocomplete } from '../subjectsAutocomplete/SubjectsAutocomplete'
import type { SubjectOption } from '../subjectsAutocomplete/types'
import type { AccessionWithMetadata } from '../../apiTypes/apiResponses'
import { useToast } from '../../context/ToastContext'

interface CreateUpdateAccessionProps {
  accessionToUpdate?: AccessionWithMetadata
  onSuccess?: () => void
}

export function CreateUpdateAccession({
  accessionToUpdate,
  onSuccess,
}: CreateUpdateAccessionProps) {
  const { t, i18n } = useTranslation()
  const { showToast } = useToast()
  const isEditMode = !!accessionToUpdate

  const [url, setUrl] = useState(accessionToUpdate?.seed_url || '')
  const [title, setTitle] = useState(
    (i18n.language === 'en'
      ? accessionToUpdate?.title_en
      : accessionToUpdate?.title_ar) || '',
  )
  const [subjects, setSubjects] = useState<readonly SubjectOption[]>([])
  const [description, setDescription] = useState(
    (i18n.language === 'en'
      ? accessionToUpdate?.description_en
      : accessionToUpdate?.description_ar) || '',
  )
  const [date, setDate] = useState<Date | null>(
    accessionToUpdate?.dublin_metadata_date
      ? new Date(accessionToUpdate.dublin_metadata_date)
      : null,
  )
  const [browserProfile, setBrowserProfile] = useState<string>(
    t('create_accession_crawl_type_default'),
  )
  const [isPrivate, setIsPrivate] = useState(
    accessionToUpdate?.is_private || false,
  )

  useEffect(() => {
    if (accessionToUpdate) {
      const subjectIds =
        i18n.language === 'en'
          ? accessionToUpdate.subjects_en_ids
          : accessionToUpdate.subjects_ar_ids
      const subjectLabels =
        i18n.language === 'en'
          ? accessionToUpdate.subjects_en
          : accessionToUpdate.subjects_ar

      if (
        subjectIds &&
        subjectLabels &&
        subjectIds.length === subjectLabels.length
      ) {
        const initialSubjects: SubjectOption[] = subjectIds.map(
          (id, index) => ({
            value: id,
            label: subjectLabels[index] || '',
          }),
        )
        setSubjects(initialSubjects)
      }
    }
  }, [accessionToUpdate, i18n.language])

  const [urlError, setUrlError] = useState('')
  const [titleError, setTitleError] = useState('')
  const [dateError, setDateError] = useState('')
  const [subjectsError, setSubjectsError] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateURL = useCallback(
    (value: string) => {
      try {
        new URL(value)
        return { valid: true, error: '' }
      } catch {
        return { valid: false, error: t('create_accession_invalid_url') }
      }
    },
    [t],
  )
  const validateDate = useCallback(
    (value: Date | null) => {
      if (!value) {
        return { valid: false, error: t('create_accession_date_required') }
      }
      try {
        new Date(value)
        return { valid: true, error: '' }
      } catch {
        return { valid: false, error: t('create_accession_invalid_date') }
      }
    },
    [t],
  )
  const validateTitle = useCallback(
    (value: string) => {
      if (!value) {
        return { valid: false, error: t('create_accession_title_required') }
      }
      return { valid: true, error: '' }
    },
    [t],
  )

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUrl(value)
  }

  const handleUrlBlur = () => {
    const urlCheck = validateURL(url)
    if (!urlCheck.valid) {
      setUrlError(urlCheck.error)
    } else {
      setUrlError('')
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
  }

  const handleTitleBlur = () => {
    const titleCheck = validateTitle(title)
    if (!titleCheck.valid) {
      setTitleError(titleCheck.error)
    } else {
      setTitleError('')
    }
  }

  const handleSubjectsChange = (values: readonly SubjectOption[]) => {
    setSubjects(values)
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value)
  }

  const handleDateChange = (val: Date | null) => {
    const dateCheck = validateDate(val)
    if (!dateCheck.valid) {
      setDateError(dateCheck.error)
    } else {
      setDate(val)
      setDateError('')
    }
  }

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLanguage)
    switch (newLanguage) {
      case 'en':
        document.documentElement.lang = 'en'
        document.documentElement.dir = 'ltr'
        break
      case 'ar':
        document.documentElement.lang = 'ar'
        document.documentElement.dir = 'rtl'
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const urlCheck = validateURL(url)
    if (!urlCheck.valid) {
      setUrlError(urlCheck.error)
    }
    const titleCheck = validateTitle(title)
    if (!titleCheck.valid) {
      setTitleError(titleCheck.error)
    }
    const dateCheck = validateDate(date)
    if (!dateCheck.valid) {
      setDateError(dateCheck.error)
    }
    if (subjects.length === 0) {
      setSubjectsError(t('create_accession_subjects_error'))
    }
    if (
      !urlCheck.valid ||
      !titleCheck.valid ||
      !dateCheck.valid ||
      subjects.length === 0
    ) {
      return
    }

    setIsSubmitting(true)

    try {
      const subjectIds = subjects.map((subject) => subject.value)
      const payload = {
        metadata_language: i18n.language === 'en' ? 'english' : 'arabic',
        url: url,
        metadata_format: 'wacz',
        metadata_title: title,
        metadata_subjects: subjectIds,
        metadata_description: description || null,
        metadata_time: `${
          new Date(date as Date).toISOString().split('T')[0]
        }T00:00:00`,
        browser_profile: isEditMode
          ? null
          : browserProfile === t('create_accession_crawl_type_facebook')
            ? 'facebook'
            : null,
        is_private: isPrivate,
      }

      const method = isEditMode ? 'PUT' : 'POST'
      const urlPath = isEditMode
        ? `${appConfig.apiURL}accessions/${accessionToUpdate?.id}`
        : `${appConfig.apiURL}accessions/crawl`
      const response = await fetch(urlPath, {
        method,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.status === 201 || response.status === 200) {
        showToast(
          isEditMode
            ? t('update_accession_success_description')
            : t('create_accession_success_description'),
          'success',
        )

        if (isEditMode && onSuccess) {
          onSuccess()
        } else {
          setUrl('')
          setTitle('')
          setSubjects([])
          setDescription('')
          setDate(null)
          setBrowserProfile(t('create_accession_crawl_type_default'))
          setIsPrivate(false)
        }
      } else {
        const errorText = await response.text()
        console.error(errorText)
        showToast(
          `${
            isEditMode
              ? t('update_accession_error_description')
              : t('create_accession_error_toast_description')
          } ${errorText}`,
          'error',
        )
      }
    } catch (error) {
      console.error(error)
      showToast(
        isEditMode
          ? t('update_accession_error_description')
          : t('create_accession_error_toast_description'),
        'error',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {isEditMode && (
        <Flex alignItems="center" mb={2}>
          <Button
            size="sm"
            variant="ghost"
            _active={{ bg: 'gray.600' }}
            onClick={handleLanguageChange}
            mb={2}
          >
            {t('change_language_label', {
              targetLanguage:
                i18n.language === 'en' ? t('arabic') : t('english'),
            })}
          </Button>
        </Flex>
      )}
      <VStack gap={4} align="stretch">
        <Box>
          <Heading size="sm" mb={1}>
            {t('create_accession_url_field_label')}
          </Heading>
          <Input
            value={url}
            onChange={handleUrlChange}
            onBlur={handleUrlBlur}
            placeholder={t('create_accession_url_field_placeholder')}
            disabled={isEditMode}
            bg="input.bg"
            borderColor="gray"
            _placeholder={{ color: 'fg.muted' }}
          />
          {urlError && (
            <Text color="red.500" fontSize="sm">
              {urlError}
            </Text>
          )}
        </Box>

        <Box>
          <Heading size="sm" mb={1}>
            {t('create_accession_title_field_label')}
          </Heading>
          <Input
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            bg="input.bg"
            borderColor="gray"
          />
          {titleError && (
            <Text color="red.500" fontSize="sm">
              {titleError}
            </Text>
          )}
        </Box>

        <Box>
          <Heading size="sm" mb={1}>
            {t('create_accession_subjects_field_label')}
          </Heading>
          <SubjectsAutocomplete
            onChange={handleSubjectsChange}
            value={subjects}
            defaultValues={
              accessionToUpdate
                ? {
                    values:
                      (i18n.language === 'en'
                        ? accessionToUpdate.subjects_en_ids
                        : accessionToUpdate.subjects_ar_ids) || [],
                    labels:
                      (i18n.language === 'en'
                        ? accessionToUpdate.subjects_en
                        : accessionToUpdate.subjects_ar) || [],
                  }
                : undefined
            }
          />
          {subjectsError && (
            <Text color="red.500" fontSize="sm">
              {subjectsError}
            </Text>
          )}
        </Box>

        <Box>
          <Heading size="sm" mb={1}>
            {t('create_accession_description_field_label')}
          </Heading>
          <Textarea
            value={description}
            onChange={handleDescriptionChange}
            bg="input.bg"
            borderColor="gray"
          />
        </Box>

        <Box>
          <Heading size="sm" mb={1}>
            {t('create_accession_date_field_label')}
          </Heading>
          <ArchiveDatePicker
            selected={date}
            onChange={handleDateChange}
            showPlaceholder={true}
          />
          {dateError && (
            <Text color="red.500" fontSize="sm" mb={2}>
              {dateError}
            </Text>
          )}
        </Box>

        {!isEditMode && (
          <Box>
            <Heading size="sm" mb={1}>
              {t('create_accession_crawl_type_label')}
            </Heading>
            <RadioGroup.Root
              value={browserProfile}
              onValueChange={(e) => setBrowserProfile(e.value ?? '')}
            >
              <HStack gap={4}>
                <RadioGroup.Item
                  value={t('create_accession_crawl_type_default')}
                >
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText>
                    {t('create_accession_crawl_type_default')}
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
                <RadioGroup.Item
                  value={t('create_accession_crawl_type_facebook')}
                >
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText>
                    {t('create_accession_crawl_type_facebook')}
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
              </HStack>
            </RadioGroup.Root>
          </Box>
        )}

        <Flex alignItems="center" mt={2}>
          <Heading size="sm" mr={2}>
            {t('create_accession_private_label')}
          </Heading>
          <Checkbox.Root
            checked={isPrivate}
            onCheckedChange={(e) => setIsPrivate(e.checked === true)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label />
          </Checkbox.Root>
        </Flex>

        <Button
          mt={4}
          variant="ghost"
          colorPalette="cyan"
          _active={{ bg: 'cyan.700', color: 'white' }}
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isEditMode
            ? t('edit_accession_submit_button')
            : t('create_accession_submit_field_label')}
        </Button>
      </VStack>
    </form>
  )
}
