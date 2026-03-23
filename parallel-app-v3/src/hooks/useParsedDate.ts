import { useTranslation } from 'react-i18next'

export function useParsedDate() {
  const { i18n } = useTranslation()

  function parseDate(date: string): string {
    try {
      let dateToParse = date
      if (
        dateToParse.includes('T') &&
        !dateToParse.endsWith('Z') &&
        !/[+-]\d{2}:?\d{2}$/.test(dateToParse)
      ) {
        dateToParse += 'Z'
      }
      const parsedDate = new Date(dateToParse)
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }

      return parsedDate.toLocaleDateString(
        i18n.language === 'ar' ? 'ar-EG' : 'en-US',
        options,
      )
    } catch (error) {
      console.error(`Could not parse date ${date}. Error: ${error}`)
      return ''
    }
  }

  return { parseDate }
}
