/// <reference types="vite/client" />

declare module '*.css' {
  const content: string
  export default content
}

declare module 'react-datepicker' {
  import * as React from 'react'

  export interface ReactDatePickerProps extends React.ComponentPropsWithRef<'input'> {
    showYearDropdown?: boolean
    dropdownMode?: 'scroll' | 'select'
    locale?: string
    dateFormat?: string
    selected?: Date | null
    onChange?: (date: Date | null) => void
    preventOpenOnFocus?: boolean
    onCalendarOpen?: () => void
    onCalendarClose?: () => void
    open?: boolean
    placeholder?: string
  }

  const DatePicker: React.ForwardRefExoticComponent<ReactDatePickerProps>
  export default DatePicker
}

interface ReplayWebPageProps extends React.HTMLAttributes<HTMLElement> {
  embed?: string
  replayBase?: string
  source?: string
  url?: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'replay-web-page': ReplayWebPageProps
    }
  }
}

export {}
