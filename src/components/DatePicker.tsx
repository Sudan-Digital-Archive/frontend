import { DatePicker as ChakraDatePicker, Portal } from '@chakra-ui/react'
import { Calendar } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { fromDate } from '@internationalized/date'

interface ArchiveDatePickerProps {
  date: Date | null
  onDateChange: (date: Date | null) => void
}

export function ArchiveDatePicker({
  date,
  onDateChange,
}: ArchiveDatePickerProps) {
  const { i18n } = useTranslation()

  const handleValueChange = (details: { value: unknown[] }) => {
    const selectedDate = details.value[0] as { toDate: () => Date } | undefined
    onDateChange(selectedDate ? selectedDate.toDate() : null)
  }

  return (
    <ChakraDatePicker.Root
      size="md"
      locale={i18n.language === 'ar' ? 'ar-SA' : 'en-US'}
      value={date ? [fromDate(date, 'UTC')] : []}
      onValueChange={handleValueChange}
    >
      <ChakraDatePicker.Control>
        <ChakraDatePicker.Input />
        <ChakraDatePicker.IndicatorGroup>
          <ChakraDatePicker.Trigger>
            <Calendar />
          </ChakraDatePicker.Trigger>
        </ChakraDatePicker.IndicatorGroup>
      </ChakraDatePicker.Control>
      <Portal>
        <ChakraDatePicker.Positioner>
          <ChakraDatePicker.Content>
            <ChakraDatePicker.View view="day">
              <ChakraDatePicker.Header />
              <ChakraDatePicker.DayTable />
            </ChakraDatePicker.View>
            <ChakraDatePicker.View view="month">
              <ChakraDatePicker.Header />
              <ChakraDatePicker.MonthTable />
            </ChakraDatePicker.View>
            <ChakraDatePicker.View view="year">
              <ChakraDatePicker.Header />
              <ChakraDatePicker.YearTable />
            </ChakraDatePicker.View>
          </ChakraDatePicker.Content>
        </ChakraDatePicker.Positioner>
      </Portal>
    </ChakraDatePicker.Root>
  )
}
