import { GenericAutocomplete } from './GenericAutocomplete'
import type { AutocompleteOption } from './GenericAutocomplete'

interface ContributorsAutocompleteProps {
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

export const ContributorsAutocomplete = (
  props: ContributorsAutocompleteProps,
) => {
  return (
    <GenericAutocomplete
      {...props}
      endpoint="contributors"
      idKey="id"
      labelKey="contributor"
      pluralLabel="contributors"
      createPayloadKey="contributor"
    />
  )
}
