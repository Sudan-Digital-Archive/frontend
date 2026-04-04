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
