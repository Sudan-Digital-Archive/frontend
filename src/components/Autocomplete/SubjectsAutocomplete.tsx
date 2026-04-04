import { GenericAutocomplete } from './GenericAutocomplete'
import type { AutocompleteOption } from './GenericAutocomplete'

interface SubjectsAutocompleteProps {
  menuPlacement?: 'top' | 'bottom'
  onChange?: (values: readonly AutocompleteOption[]) => void
  defaultValues?: {
    values: number[]
    labels: string[]
  }
  value?: readonly AutocompleteOption[]
  lockedValues?: number[]
  collectionId?: number
}

export const SubjectsAutocomplete = (props: SubjectsAutocompleteProps) => {
  return (
    <GenericAutocomplete
      {...props}
      endpoint="metadata-subjects"
      idKey="id"
      labelKey="subject"
      pluralLabel="subjects"
      createPayloadKey="metadata_subject"
    />
  )
}
