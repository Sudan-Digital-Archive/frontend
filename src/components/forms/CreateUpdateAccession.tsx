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
  Progress,
  NativeSelect,
} from '@chakra-ui/react'
import { ArchiveDatePicker } from '../DatePicker'
import { useTranslation } from 'react-i18next'
import { appConfig } from '../../constants'
import { useState, useEffect, useCallback } from 'react'
import { SubjectsAutocomplete } from '../subjectsAutocomplete/SubjectsAutocomplete'
import type { SubjectOption } from '../subjectsAutocomplete/types'
import type { AccessionWithMetadata } from '../../apiTypes/apiResponses'
import { useToast } from '../../context/ToastContext'
import { FileUpload } from '@chakra-ui/react'
import { Upload } from 'react-feather'
import {
  CreatorsAutocomplete,
  LocationsAutocomplete,
  ContributorsAutocomplete,
  ContributorRolesAutocomplete,
} from '../Autocomplete'
import type { AutocompleteOption } from '../Autocomplete'

interface CreateUpdateAccessionProps {
  accessionToUpdate?: AccessionWithMetadata
  onSuccess?: () => void
}

type CreateMode = 'url' | 'file'

export function CreateUpdateAccession({
  accessionToUpdate,
  onSuccess,
}: CreateUpdateAccessionProps) {
  const { t, i18n } = useTranslation()
  const { showToast } = useToast()
  const isEditMode = !!accessionToUpdate

  const [mode, setMode] = useState<CreateMode>('url')

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileFormat, setFileFormat] = useState<'wacz' | 'mp4'>('wacz')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const [creator, setCreator] = useState<AutocompleteOption | null>(null)
  const [location, setLocation] = useState<AutocompleteOption | null>(null)
  const [contributors, setContributors] = useState<readonly AutocompleteOption[]>([])
  const [contributorRoles, setContributorRoles] = useState<readonly AutocompleteOption[]>([])

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

      if (accessionToUpdate.creator_en_id) {
        setCreator({
          value: accessionToUpdate.creator_en_id,
          label: accessionToUpdate.creator_en || '',
        })
      }

      if (accessionToUpdate.location_en_id) {
        setLocation({
          value: accessionToUpdate.location_en_id,
          label: accessionToUpdate.location_en || '',
        })
      }

      if (accessionToUpdate.contributor_en_ids && accessionToUpdate.contributor_en_ids.length > 0) {
        const contributorOptions: AutocompleteOption[] = accessionToUpdate.contributor_en_ids.map(
          (id, index) => ({
            value: id,
            label: accessionToUpdate.contributors_en?.[index] || '',
          }),
        )
        setContributors(contributorOptions)
      }

      if (accessionToUpdate.contributor_role_en_ids && accessionToUpdate.contributor_role_en_ids.length > 0) {
        const roleOptions: AutocompleteOption[] = accessionToUpdate.contributor_role_en_ids.map(
          (id, index) => ({
            value: id,
            label: accessionToUpdate.contributor_roles_en?.[index] || '',
          }),
        )
        setContributorRoles(roleOptions)
      }
    }
  }, [accessionToUpdate, i18n.language])

  const [urlError, setUrlError] = useState('')
  const [titleError, setTitleError] = useState('')
  const [dateError, setDateError] = useState('')
  const [subjectsError, setSubjectsError] = useState('')
  const [fileError, setFileError] = useState('')

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

  const handleCreatorChange = (values: readonly AutocompleteOption[]) => {
    setCreator(values.length > 0 ? values[0] : null)
  }

  const handleLocationChange = (values: readonly AutocompleteOption[]) => {
    setLocation(values.length > 0 ? values[0] : null)
  }

  const handleContributorsChange = (values: readonly AutocompleteOption[]) => {
    setContributors(values)
  }

  const handleContributorRolesChange = (values: readonly AutocompleteOption[]) => {
    setContributorRoles(values)
  }

  const handleFileChange = (details: { acceptedFiles: File[] }) => {
    if (details.acceptedFiles.length > 0) {
      const file = details.acceptedFiles[0]
      setSelectedFile(file)
      setFileError('')

      if (file.name.endsWith('.mp4')) {
        setFileFormat('mp4')
      } else {
        setFileFormat('wacz')
      }
    }
  }

  const uploadToS3 = async (file: File, uploadUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('Network error during upload'))

      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
  }

  const buildMetadataPayload = () => {
    const subjectIds = subjects.map((subject) => subject.value)
    const contributorIds = contributors.map((c) => c.value)
    const contributorRoleIds = contributorRoles.map((r) => (r.value > 0 ? r.value : null))

    return {
      metadata_language: i18n.language === 'en' ? 'english' : 'arabic',
      metadata_title: title,
      metadata_description: description || null,
      metadata_subjects: subjectIds,
      metadata_time: `${new Date(date as Date).toISOString().split('T')[0]}T00:00:00`,
      is_private: isPrivate,
      metadata_creator_id: creator?.value ?? null,
      metadata_location_id: location?.value ?? null,
      metadata_contributor_ids: contributorIds,
      metadata_contributor_role_ids: contributorRoleIds,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    if (mode === 'file' && !selectedFile) {
      setFileError(t('create_accession_file_required'))
    }

    if (
      !titleCheck.valid ||
      !dateCheck.valid ||
      subjects.length === 0 ||
      (mode === 'file' && !selectedFile)
    ) {
      return
    }

    if (mode === 'url') {
      const urlCheck = validateURL(url)
      if (!urlCheck.valid) {
        setUrlError(urlCheck.error)
        return
      }
    }

    setIsSubmitting(true)

    try {
      if (mode === 'url') {
        const payload = {
          ...buildMetadataPayload(),
          url: url,
          metadata_format: 'wacz',
          browser_profile: isEditMode
            ? null
            : browserProfile === t('create_accession_crawl_type_facebook')
              ? 'facebook'
              : null,
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
            resetForm()
          }
        } else {
          const errorText = await response.text()
          console.error(errorText)
          showToast(
            isEditMode
              ? t('update_accession_error_description')
              : t('create_accession_error_toast_description'),
            'error',
          )
        }
      } else {
        setIsUploading(true)
        setUploadProgress(0)

        const payload = {
          ...buildMetadataPayload(),
          metadata_format: fileFormat,
          original_url: url || '',
          s3_filename: selectedFile?.name || 'unknown',
        }

        const response = await fetch(`${appConfig.apiURL}accessions/raw`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (response.status !== 201) {
          const errorText = await response.text()
          throw new Error(errorText || `Server returned ${response.status}`)
        }

        const data = await response.json()
        const { upload_url, accession_id } = data

        await uploadToS3(selectedFile!, upload_url)

        showToast(
          t('create_accession_upload_success', {
            url: `/archive/${accession_id}`,
          }),
          'success',
        )

        resetForm()
      }
    } catch (error) {
      console.error(error)
      showToast(
        mode === 'file' && isUploading
          ? t('create_accession_upload_error', { error: String(error) })
          : isEditMode
            ? t('update_accession_error_description')
            : t('create_accession_error_toast_description'),
        'error',
      )
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setUrl('')
    setTitle('')
    setSubjects([])
    setDescription('')
    setDate(null)
    setBrowserProfile(t('create_accession_crawl_type_default'))
    setIsPrivate(false)
    setSelectedFile(null)
    setFileFormat('wacz')
    setCreator(null)
    setLocation(null)
    setContributors([])
    setContributorRoles([])
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

      {!isEditMode && (
        <Box mb={4}>
          <Heading size="sm" mb={2}>
            {t('create_accession_mode_toggle')}
          </Heading>
          <RadioGroup.Root
            value={mode}
            onValueChange={(e) => setMode(e.value as CreateMode)}
          >
            <HStack gap={4}>
              <RadioGroup.Item value="url">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText>
                  {t('create_accession_mode_url')}
                </RadioGroup.ItemText>
              </RadioGroup.Item>
              <RadioGroup.Item value="file">
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText>
                  {t('create_accession_mode_file')}
                </RadioGroup.ItemText>
              </RadioGroup.Item>
            </HStack>
          </RadioGroup.Root>
        </Box>
      )}

      <VStack gap={4} align="stretch">
        {mode === 'url' && (
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
        )}

        {mode === 'file' && (
          <Box>
            <Heading size="sm" mb={1}>
              {t('create_accession_file_field_label')}
            </Heading>
            <FileUpload.Root
              accept={['.wacz', '.mp4']}
              onFileChange={handleFileChange}
              maxFiles={1}
            >
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone
                border="2px dashed"
                borderColor="gray"
                borderRadius="md"
                p={8}
                textAlign="center"
                cursor="pointer"
                width="100%"
                _hover={{ borderColor: 'cyan.500' }}
              >
                <Flex direction="column" align="center" gap={2}>
                  <FileUpload.Trigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload /> {t('create_accession_file_placeholder')}
                    </Button>
                  </FileUpload.Trigger>
                </Flex>
                <FileUpload.DropzoneContent />
              </FileUpload.Dropzone>
              <FileUpload.List />
            </FileUpload.Root>
            {fileError && (
              <Text color="red.500" fontSize="sm">
                {fileError}
              </Text>
            )}
            {selectedFile && (
              <Box mt={2}>
                <Heading size="xs" mb={1}>
                  {t('create_accession_format_field_label')}
                </Heading>
                <NativeSelect.Root maxW="200px">
                  <NativeSelect.Field
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value as 'wacz' | 'mp4')}
                  >
                    <option value="wacz">{t('create_accession_format_wacz')}</option>
                    <option value="mp4">{t('create_accession_format_mp4')}</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>
            )}
          </Box>
        )}

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
            {t('create_accession_creator_field_label')}
          </Heading>
          <CreatorsAutocomplete
            onChange={handleCreatorChange}
            value={creator ? [creator] : []}
            defaultValues={
              creator ? { values: [creator.value], labels: [creator.label] } : undefined
            }
          />
        </Box>

        <Box>
          <Heading size="sm" mb={1}>
            {t('create_accession_location_field_label')}
          </Heading>
          <LocationsAutocomplete
            onChange={handleLocationChange}
            value={location ? [location] : []}
            defaultValues={
              location ? { values: [location.value], labels: [location.label] } : undefined
            }
          />
        </Box>

        <Box>
          <Heading size="sm" mb={1}>
            {t('create_accession_contributors_field_label')}
          </Heading>
          <ContributorsAutocomplete
            onChange={handleContributorsChange}
            value={contributors}
            defaultValues={
              contributors.length > 0
                ? {
                    values: contributors.map((c) => c.value),
                    labels: contributors.map((c) => c.label),
                  }
                : undefined
            }
          />
        </Box>

        <Box>
          <Heading size="sm" mb={1}>
            {t('create_accession_contributor_roles_field_label')}
          </Heading>
          <ContributorRolesAutocomplete
            onChange={handleContributorRolesChange}
            value={contributorRoles}
            defaultValues={
              contributorRoles.length > 0
                ? {
                    values: contributorRoles.map((r) => r.value),
                    labels: contributorRoles.map((r) => r.label),
                  }
                : undefined
            }
          />
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
            date={date}
            onDateChange={handleDateChange}
          />
          {dateError && (
            <Text color="red.500" fontSize="sm" mb={2}>
              {dateError}
            </Text>
          )}
        </Box>

        {!isEditMode && mode === 'url' && (
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

        {isUploading && (
          <Box>
            <Progress.Root value={uploadProgress} maxW="300px">
              <HStack justify="space-between" mb="1">
                <Progress.Label>
                  {t('create_accession_upload_progress', { percent: uploadProgress })}
                </Progress.Label>
                <Progress.ValueText>{uploadProgress}%</Progress.ValueText>
              </HStack>
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Box>
        )}

        <Button
          mt={4}
          variant="ghost"
          colorPalette="cyan"
          _active={{ bg: 'cyan.700', color: 'white' }}
          type="submit"
          disabled={isSubmitting || isUploading}
          loading={isSubmitting || isUploading}
        >
          {isEditMode
            ? t('edit_accession_submit_button')
            : t('create_accession_submit_field_label')}
        </Button>
      </VStack>
    </form>
  )
}