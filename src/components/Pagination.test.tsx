import { Pagination } from './Pagination'
import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders } from '../../testUtils/testHelpers.tsx'

describe('Pagination', () => {
  it('renders without crashing', () => {
    const onPageChange = vi.fn()
    renderWithProviders(
      <Pagination
        count={50}
        pageSize={10}
        page={1}
        onPageChange={onPageChange}
      />,
    )
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('renders with per-page options when callback provided', () => {
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()
    renderWithProviders(
      <Pagination
        count={50}
        pageSize={10}
        page={1}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />,
    )
    expect(onPageSizeChange).not.toHaveBeenCalled()
  })
})
