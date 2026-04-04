import { GenericAutocomplete } from './GenericAutocomplete'
import type { AutocompleteOption } from './GenericAutocomplete'

interface LocationsAutocompleteProps {
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

export const LocationsAutocomplete = (props: LocationsAutocompleteProps) => {
  return (
    <GenericAutocomplete
      {...props}
      endpoint="locations"
      idKey="id"
      labelKey="location"
      pluralLabel="locations"
      createPayloadKey="location"
    />
  )
}
