import { GenericAutocomplete } from './GenericAutocomplete'
import type { AutocompleteOption } from './GenericAutocomplete'

interface CreatorsAutocompleteProps {
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

export const CreatorsAutocomplete = (props: CreatorsAutocompleteProps) => {
  return (
    <GenericAutocomplete
      {...props}
      endpoint="creators"
      idKey="id"
      labelKey="creator"
      pluralLabel="creators"
      createPayloadKey="creator"
    />
  )
}
