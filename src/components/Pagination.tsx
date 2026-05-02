import {
  HStack,
  ButtonGroup,
  IconButton,
  Text,
  NativeSelect,
} from '@chakra-ui/react'
import { Pagination as ChakraPagination } from '@chakra-ui/react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { perPageOptions } from '../constants'

interface PaginationProps {
  count: number
  pageSize: number
  page: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  translations?: {
    pageKey?: string
    outOfKey?: string
  }
}

export function Pagination({
  count,
  pageSize,
  page,
  onPageChange,
  onPageSizeChange,
  translations,
}: PaginationProps) {
  const { t, i18n } = useTranslation()
  const totalPages = Math.ceil(count / pageSize)

  const pageLabel = translations?.pageKey || 'archive_pagination_page'
  const outOfLabel = translations?.outOfKey || 'archive_pagination_page_out_of'

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage)
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (onPageSizeChange) {
      onPageSizeChange(Number(event.target.value))
    }
  }

  return (
    <HStack gap={4} justifyContent="center" alignItems="center">
      <ChakraPagination.Root
        count={count}
        pageSize={pageSize}
        page={page}
        onPageChange={(e) => handlePageChange(e.page)}
      >
        <ButtonGroup variant="ghost" size="sm">
          <ChakraPagination.PrevTrigger asChild>
            <IconButton>
              {i18n.language === 'ar' ? (
                <ArrowRight size={14} />
              ) : (
                <ArrowLeft size={14} />
              )}
            </IconButton>
          </ChakraPagination.PrevTrigger>
          <ChakraPagination.Items
            render={(pg) => (
              <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>
                {pg.value}
              </IconButton>
            )}
          />
          <ChakraPagination.NextTrigger asChild>
            <IconButton>
              {i18n.language === 'ar' ? (
                <ArrowLeft size={14} />
              ) : (
                <ArrowRight size={14} />
              )}
            </IconButton>
          </ChakraPagination.NextTrigger>
        </ButtonGroup>
      </ChakraPagination.Root>

      <Text fontSize="sm" color="fg.muted">
        {i18n.language === 'ar'
          ? `${t(pageLabel)}${page}${t(outOfLabel)}${totalPages}`
          : `${t(pageLabel)}${page}${t(outOfLabel)}${totalPages}`}
      </Text>

      {onPageSizeChange && (
        <NativeSelect.Root size="sm" width="auto">
          <NativeSelect.Field value={pageSize} onChange={handlePageSizeChange}>
            {perPageOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
      )}
    </HStack>
  )
}
