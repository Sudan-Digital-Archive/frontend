import { Subject } from './Subject.tsx'
import { describe, it, expect } from 'vitest'
import {
  addi18n,
  renderWithProviders,
} from '../../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

addi18n()
describe('Subject', () => {
  const testSubjects = ['Test Subject', 'Another Subject']

  it('should render properly in English', () => {
    renderWithProviders(<Subject subjects={testSubjects} />, {
      language: 'en',
    })
    expect(screen.getByText('Subjects:')).toBeTruthy()
    testSubjects.forEach((subject) => {
      expect(screen.getByText(subject)).toBeTruthy()
    })
  })

  it('should render properly in Arabic', () => {
    renderWithProviders(<Subject subjects={testSubjects} />, {
      language: 'ar',
    })
    expect(screen.getByText('المواضيع:')).toBeTruthy()
    testSubjects.forEach((subject) => {
      expect(screen.getByText(subject)).toBeTruthy()
    })
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('should not render when no subjects provided', () => {
    const { container } = renderWithProviders(<Subject subjects={null} />, {
      language: 'en',
    })
    expect(container.firstChild).toBeNull()
  })
})
