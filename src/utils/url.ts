import type {
  AccessionsQueryFilters,
  CollectionsQueryFilters,
} from '../apiTypes/apiRequests'

export function buildFilters(
  queryFilters: AccessionsQueryFilters | CollectionsQueryFilters,
) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(queryFilters)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item.toString()))
    } else {
      params.append(key, value.toString())
    }
  }
  return params
}

export function buildArchiveUrl(
  accessionId: string | number,
  language: string,
  isPrivate?: boolean,
): string {
  const params = new URLSearchParams()
  if (isPrivate) {
    params.set('isPrivate', 'true')
  }
  params.set('lang', language)
  return `/archive/${accessionId}?${params.toString()}`
}
