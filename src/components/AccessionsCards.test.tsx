import { AccessionsCards } from './AccessionsCards'
import { describe, it, expect } from 'vitest'
import { addi18n, renderWithProviders } from '../../testUtils/testHelpers.tsx'
import { screen } from '@testing-library/react'

const mockAccessions = [
  {
    id: '1',
    seed_url: 'http://example.com/accession1',
    dublin_metadata_date: '2024-01-01',
    title_en: 'Accession 1',
    description_en: 'Description 1',
    subjects_en: ['subject1', 'subject2'],
    subjects_en_ids: [1, 2],
    title_ar: null,
    description_ar: null,
    subjects_ar: null,
    subjects_ar_ids: null,
    location_en: null,
    location_en_id: null,
    creator_en: null,
    creator_en_id: null,
    contributors_en: null,
    contributor_en_ids: null,
    contributor_roles_en: null,
    contributor_role_en_ids: null,
    relations_en: null,
    location_ar: null,
    location_ar_id: null,
    creator_ar: null,
    creator_ar_id: null,
    contributors_ar: null,
    contributor_ar_ids: null,
    contributor_roles_ar: null,
    contributor_role_ar_ids: null,
    relations_ar: null,
    has_english_metadata: true,
    has_arabic_metadata: false,
    crawl_status: 'completed',
    crawl_timestamp: '2024-01-01T00:00:00.000Z',
    crawl_id: 'crawl1',
    org_id: 'org1',
    job_run_id: 'job1',
  },
  {
    id: '2',
    seed_url: 'http://example.com/accession2',
    dublin_metadata_date: '2024-01-02',
    title_en: 'Accession 2',
    description_en: 'Description 2',
    subjects_en: ['subject3', 'subject4'],
    subjects_en_ids: [3, 4],
    title_ar: 'Arabic title',
    description_ar: null,
    subjects_ar: null,
    subjects_ar_ids: null,
    location_en: null,
    location_en_id: null,
    creator_en: null,
    creator_en_id: null,
    contributors_en: null,
    contributor_en_ids: null,
    contributor_roles_en: null,
    contributor_role_en_ids: null,
    relations_en: null,
    location_ar: null,
    location_ar_id: null,
    creator_ar: null,
    creator_ar_id: null,
    contributors_ar: null,
    contributor_ar_ids: null,
    contributor_roles_ar: null,
    contributor_role_ar_ids: null,
    relations_ar: null,
    has_english_metadata: true,
    has_arabic_metadata: false,
    crawl_status: 'completed',
    crawl_timestamp: '2024-01-02T00:00:00.000Z',
    crawl_id: 'crawl2',
    org_id: 'org2',
    job_run_id: 'job2',
  },
]

addi18n()
describe('AccessionsCards', () => {
  it('should render properly in English', () => {
    renderWithProviders(
      <AccessionsCards accessions={mockAccessions} onRefresh={() => {}} />,
      {
        language: 'en',
      },
    )
    expect(screen.getAllByText('Accession 1').length).toBeGreaterThan(0)
    expect(screen.getByText(/subject1/)).toBeTruthy()
    expect(screen.getByText('Description 1')).toBeTruthy()
    expect(screen.getAllByText('View record')).toBeTruthy()
  })

  it('should render properly in Arabic', () => {
    renderWithProviders(
      <AccessionsCards accessions={mockAccessions} onRefresh={() => {}} />,
      {
        language: 'ar',
      },
    )
    expect(screen.getAllByText('عرض السجل')).toBeTruthy()
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
  })
})
