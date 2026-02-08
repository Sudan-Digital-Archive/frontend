export type AccessionsQueryFilters = {
  date_from?: Date
  date_to?: Date
  lang?: string
  page?: number
  per_page?: number
  query_term?: string
  metadata_subjects?: number[]
  metadata_subjects_inclusive_filter?: boolean
  is_private?: boolean
  url_filter?: string
}

export type CollectionsQueryFilters = {
  lang?: string
  page?: number
  per_page?: number
}
