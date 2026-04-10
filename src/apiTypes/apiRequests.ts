export type AccessionsQueryFilters = {
  date_from?: Date
  date_to?: Date
  lang?: string
  page?: number
  per_page?: number
  query_term?: string
  metadata_subjects?: number[]
  metadata_subjects_inclusive_filter?: boolean
  metadata_creators?: number[]
  metadata_locations?: number[]
  metadata_contributors?: number[]
  metadata_contributors_inclusive_filter?: boolean
  metadata_contributor_roles?: number[]
  metadata_contributor_roles_inclusive_filter?: boolean
  is_private?: boolean
  url_filter?: string
  in_collection_id?: number
}

export type CollectionsQueryFilters = {
  lang?: string
  page?: number
  per_page?: number
  is_private?: boolean
  metadata_subjects?: number[]
  metadata_subjects_inclusive_filter?: boolean
  metadata_creators?: number[]
  metadata_locations?: number[]
  metadata_contributors?: number[]
  metadata_contributors_inclusive_filter?: boolean
  metadata_contributor_roles?: number[]
  metadata_contributor_roles_inclusive_filter?: boolean
  in_collection_id?: number
}
