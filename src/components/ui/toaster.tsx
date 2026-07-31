import { createToaster, Toaster, Toast } from '@chakra-ui/react'

// eslint-disable-next-line react-refresh/only-export-components
export const toaster = createToaster({
  placement: 'top',
  duration: 4000,
})

export function ToasterComponent() {
  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root key={toast.id}>
          <Toast.Description>{toast.description}</Toast.Description>
        </Toast.Root>
      )}
    </Toaster>
  )
}
