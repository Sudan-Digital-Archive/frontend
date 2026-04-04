import { MetadataDisplay } from './MetadataDisplay.tsx'
import { describe, it, expect, vi } from 'vitest'
import {
  addi18n,
  renderWithProviders,
} from '../../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

addi18n()

vi.mock('./DateMetadata', () => ({
  DateMetadata: ({ date }: { date: string }) => (
    <span data-testid="date-metadata">{date}</span>
  ),
}))

vi.mock('./Subject', () => ({
  Subject: ({ subjects }: { subjects: string[] | null }) => (
    <span data-testid="subject">{subjects?.join(',')}</span>
  ),
}))

vi.mock('./Creator', () => ({
  Creator: ({ creator }: { creator: string | null }) => (
    <span data-testid="creator">{creator}</span>
  ),
}))

vi.mock('./Location', () => ({
  Location: ({ location }: { location: string | null }) => (
    <span data-testid="location">{location}</span>
  ),
}))

vi.mock('./Contributors', () => ({
  Contributors: ({
    contributors,
    contributorRoles,
  }: {
    contributors: string[] | null
    contributorRoles: (string | null)[] | null
  }) => (
    <span data-testid="contributors">
      {contributors?.join(',')} | {contributorRoles?.join(',')}
    </span>
  ),
}))

vi.mock('./Relations', () => ({
  Relations: ({
    relations,
    language,
    isPrivate,
  }: {
    relations: unknown[] | null
    language: string
    isPrivate?: boolean
  }) => (
    <span data-testid="relations">
      {relations?.length} | {language} | {String(isPrivate)}
    </span>
  ),
}))

vi.mock('./Description', () => ({
  Description: ({
    description,
  }: {
    description: string
    fontSize?: string
    lineClamp?: number
  }) => <span data-testid="description">{description}</span>,
}))

vi.mock('./OriginalURL', () => ({
  OriginalURL: ({ url }: { url: string }) => (
    <span data-testid="original-url">{url}</span>
  ),
}))

describe('MetadataDisplay', () => {
  const mockProps = {
    subjects: ['Subject1', 'Subject2'],
    creator: 'Test Creator',
    location: 'Test Location',
    contributors: ['Contributor1', 'Contributor2'],
    contributorRoles: ['Role1', 'Role2'],
    relations: [],
    description: 'Test description',
    date: '2024-01-15',
    originalUrl: 'https://example.com',
    language: 'english',
  }

  it('should pass correct props to child components', () => {
    renderWithProviders(<MetadataDisplay {...mockProps} />)

    expect(screen.getByTestId('date-metadata').textContent).toBe('2024-01-15')
    expect(screen.getByTestId('subject').textContent).toBe('Subject1,Subject2')
    expect(screen.getByTestId('creator').textContent).toBe('Test Creator')
    expect(screen.getByTestId('location').textContent).toBe('Test Location')
    expect(screen.getByTestId('contributors').textContent).toBe(
      'Contributor1,Contributor2 | Role1,Role2',
    )
    expect(screen.getByTestId('original-url').textContent).toBe(
      'https://example.com',
    )
  })

  it('should pass isPrivate to Relations when provided', () => {
    const propsWithRelations = {
      ...mockProps,
      relations: [
        { id: 1, related_accession_id: 42, relation_type: 'has_part' as const },
      ],
    }
    renderWithProviders(
      <MetadataDisplay {...propsWithRelations} isPrivate={true} />,
    )

    const relationsText = screen.getByTestId('relations').textContent
    expect(relationsText).toContain('true')
  })

  it('should not render Description when description is empty', () => {
    const propsNoDesc = { ...mockProps, description: '' }
    renderWithProviders(<MetadataDisplay {...propsNoDesc} />)

    expect(screen.queryByTestId('description')).toBeNull()
  })

  it('should not render Description when description is only whitespace', () => {
    const propsWhitespace = { ...mockProps, description: '   ' }
    renderWithProviders(<MetadataDisplay {...propsWhitespace} />)

    expect(screen.queryByTestId('description')).toBeNull()
  })
})
