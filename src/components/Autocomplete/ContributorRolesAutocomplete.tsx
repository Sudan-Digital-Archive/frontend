import { GenericAutocomplete } from './GenericAutocomplete'
import type { AutocompleteOption } from './GenericAutocomplete'

interface ContributorRolesAutocompleteProps {
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

export const ContributorRolesAutocomplete = (
  props: ContributorRolesAutocompleteProps,
) => {
  return (
    <GenericAutocomplete
      {...props}
      endpoint="contributors/roles"
      idKey="id"
      labelKey="role"
      pluralLabel="contributor_roles"
      createPayloadKey="role"
    />
  )
}
