export type MetadataFormat = 'wacz' | 'mp4' | string

export interface AccessionMetadataBase {
  metadata_language: 'english' | 'arabic'
  metadata_title: string
  metadata_description: string | null
  metadata_subjects: number[]
  metadata_time: string
  is_private: boolean
  metadata_creator_id: number | null
  metadata_location_id: number | null
  metadata_contributor_ids: number[]
  metadata_contributor_role_ids: (number | null)[]
}

export interface AccessionCrawlRequest extends AccessionMetadataBase {
  url: string
  metadata_format: MetadataFormat
  browser_profile: 'facebook' | null
}

export interface AccessionRawUploadRequest extends AccessionMetadataBase {
  metadata_format: MetadataFormat
  original_url: string
  s3_filename: string
}

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
