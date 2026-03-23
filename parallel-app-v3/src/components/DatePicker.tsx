import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ArchiveDatePickerProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  showPlaceholder?: boolean
}
export function ArchiveDatePicker({
  onChange,
  selected,
  showPlaceholder = false,
}: ArchiveDatePickerProps) {
  const { i18n, t } = useTranslation()
  const [dateValue, setDateValue] = useState('')

  useEffect(() => {
    if (selected) {
      const year = selected.getFullYear()
      const month = String(selected.getMonth() + 1).padStart(2, '0')
      const day = String(selected.getDate()).padStart(2, '0')
      setDateValue(
        i18n.language === 'ar'
          ? `${year}/${month}/${day}`
          : `${month}/${day}/${year}`,
      )
    } else {
      setDateValue('')
    }
  }, [selected, i18n.language])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDateValue(value)

    try {
      if (value) {
        let date: Date
        if (i18n.language === 'ar') {
          const parts = value.split('/')
          if (parts.length === 3) {
            date = new Date(
              parseInt(parts[0]),
              parseInt(parts[1]) - 1,
              parseInt(parts[2]),
            )
          } else {
            return
          }
        } else {
          const parts = value.split('/')
          if (parts.length === 3) {
            date = new Date(
              parseInt(parts[2]),
              parseInt(parts[0]) - 1,
              parseInt(parts[1]),
            )
          } else {
            return
          }
        }
        if (!isNaN(date.getTime())) {
          onChange(date)
        }
      } else {
        onChange(null)
      }
    } catch {
      onChange(null)
    }
  }

  return (
    <input
      type="text"
      value={dateValue}
      onChange={handleChange}
      placeholder={
        showPlaceholder ? t('create_accession_date_placeholder') : ''
      }
      style={{
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid',
        marginRight: '8px',
        marginLeft: '8px',
        width: '120px',
      }}
    />
  )
}
