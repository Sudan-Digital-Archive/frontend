export type AccessionWithMetadata = {
  id: string
  crawl_status: string
  crawl_timestamp: string
  crawl_id: string
  org_id: string
  job_run_id: string
  seed_url: string
  dublin_metadata_date: string
  title_en: string | null
  description_en: string | null
  subjects_en: string[] | null
  subjects_en_ids: number[] | null
  title_ar: string | null
  description_ar: string | null
  subjects_ar: string[] | null
  subjects_ar_ids: number[] | null
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

export type Collection = {
  id: number
  title: string
  description: string
  is_public: boolean
  subject_ids: number[]
}

export type ListCollections = {
  items: Collection[]
  num_pages: number
  page: number
  per_page: number
}
