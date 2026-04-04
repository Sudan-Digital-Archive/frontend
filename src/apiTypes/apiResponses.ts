export type DublinMetadataRelationType =
  | 'has_part'
  | 'is_part_of'
  | 'has_version'
  | 'is_version_of'
  | 'references'
  | 'is_referenced_by'
  | 'conforms_to'
  | 'requires'

export type Relation = {
  id: number
  related_accession_id: number
  relation_type: DublinMetadataRelationType
}

export type AccessionWithMetadata = {
  id: string
  crawl_status: string
  crawl_timestamp: string
  crawl_id: string
  org_id: string
  job_run_id: string
  seed_url: string
  dublin_metadata_date: string
  dublin_metadata_format?: string
  title_en: string | null
  description_en: string | null
  subjects_en: string[] | null
  subjects_en_ids: number[] | null
  location_en: string | null
  location_en_id: number | null
  creator_en: string | null
  creator_en_id: number | null
  contributors_en: string[] | null
  contributor_en_ids: number[] | null
  contributor_roles_en: (string | null)[] | null
  contributor_role_en_ids: number[] | null
  relations_en: Relation[] | null
  title_ar: string | null
  description_ar: string | null
  subjects_ar: string[] | null
  subjects_ar_ids: number[] | null
  location_ar: string | null
  location_ar_id: number | null
  creator_ar: string | null
  creator_ar_id: number | null
  contributors_ar: string[] | null
  contributor_ar_ids: number[] | null
  contributor_roles_ar: (string | null)[] | null
  contributor_role_ar_ids: number[] | null
  relations_ar: Relation[] | null
  has_english_metadata: boolean
  has_arabic_metadata: boolean
  is_private?: boolean
}

export type ListAccessions = {
  items: AccessionWithMetadata[]
  num_pages: number
  page: number
  per_page: number
}
export type AccessionOne = {
  accession: AccessionWithMetadata
  wacz_url: string
}

export type Subject = {
  id: number
  subject: string
}

export type SubjectsResponse = {
  items: Subject[]
  num_pages: number
  page: number
  per_page: number
}

export type Creator = {
  id: number
  creator: string
}

export type CreatorsResponse = {
  items: Creator[]
  num_pages: number
  page: number
  per_page: number
}

export type Location = {
  id: number
  location: string
}

export type LocationsResponse = {
  items: Location[]
  num_pages: number
  page: number
  per_page: number
}

export type Contributor = {
  id: number
  contributor: string
}

export type ContributorsResponse = {
  items: Contributor[]
  num_pages: number
  page: number
  per_page: number
}

export type ContributorRole = {
  id: number
  role: string
}

export type ContributorRolesResponse = {
  items: ContributorRole[]
  num_pages: number
  page: number
  per_page: number
}

export type Collection = {
  id: number
  title: string
  description: string
  is_private: boolean
  subject_ids: number[]
}

export type ListCollections = {
  items: Collection[]
  num_pages: number
  page: number
  per_page: number
}
