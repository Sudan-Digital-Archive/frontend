import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Switch,
  HStack,
  VStack,
  Spinner,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Badge,
  Text,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, Plus } from 'react-feather'
import Layout from '../components/Layout.tsx'
import { useTranslation } from 'react-i18next'
import { useUsers } from '../hooks/useUsers.ts'
import type { User, UserRole } from '../apiTypes/userTypes.ts'
import { useRef } from 'react'

export default function UserManagement() {
  const { t } = useTranslation()
  const toast = useToast()
  const {
    users,
    isLoading,
    pagination,
    updateFilters,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers()

  const [emailFilter, setEmailFilter] = useState('')
  const [debouncedEmailFilter, setDebouncedEmailFilter] = useState('')

  // Edit state for each row
  const [editState, setEditState] = useState<
    Record<
      string,
      { role: UserRole; isActive: boolean; originalRole: UserRole }
    >
  >({})

  // Create user modal state
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure()
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState<UserRole>('Contributor')
  const [newUserIsActive, setNewUserIsActive] = useState(true)

  // Delete dialog state
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure()
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Debounce email filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmailFilter(emailFilter)
    }, 300)
    return () => clearTimeout(handler)
  }, [emailFilter])

  useEffect(() => {
    updateFilters({ email: debouncedEmailFilter, page: 0 })
  }, [debouncedEmailFilter, updateFilters])

  // Initialize edit state when users change
  useEffect(() => {
    const newEditState: Record<
      string,
      { role: UserRole; isActive: boolean; originalRole: UserRole }
    > = {}
    users.forEach((user) => {
      const capitalizedRole = (user.role.charAt(0).toUpperCase() +
        user.role.slice(1)) as UserRole
      newEditState[user.id] = {
        role: capitalizedRole,
        originalRole: capitalizedRole,
        isActive: user.is_active,
      }
    })
    setEditState(newEditState)
  }, [users])

  const handleUpdateUser = async (user: User) => {
    try {
      const editData = editState[user.id]
      await updateUser(user.id, {
        role: editData.role,
        is_active: editData.isActive,
      })
      toast({
        title: t('user_management_update_success'),
        status: 'success',
        duration: 3000,
      })
    } catch {
      toast({
        title: t('user_management_update_error'),
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    onDeleteDialogOpen()
  }

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id)
        toast({
          title: t('user_management_delete_success'),
          status: 'success',
          duration: 3000,
        })
      } catch {
        toast({
          title: t('user_management_delete_error'),
          status: 'error',
          duration: 3000,
        })
      }
    }
    onDeleteDialogClose()
    setUserToDelete(null)
  }

  const handleCreateUser = async () => {
    try {
      await createUser({
        email: newUserEmail,
        role: newUserRole,
        is_active: newUserIsActive,
      })
      toast({
        title: t('user_management_create_success'),
        status: 'success',
        duration: 3000,
      })
      onCreateModalClose()
      setNewUserEmail('')
      setNewUserRole('Contributor')
      setNewUserIsActive(true)
    } catch {
      toast({
        title: t('user_management_create_error'),
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleEditRoleChange = (userId: string, role: UserRole) => {
    setEditState((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], role },
    }))
  }

  const handleEditActiveChange = (userId: string, isActive: boolean) => {
    setEditState((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], isActive },
    }))
  }

  return (
    <Layout>
      <VStack alignItems="center" justifyContent="center" p={10}>
        <Heading
          textAlign="center"
          py={2}
          bgGradient="linear(to-r, cyan.300, pink.600)"
          bgClip="text"
          mb={10}
        >
          {t('user_management_title')}
        </Heading>

        <Box w="100%" maxW="6xl">
          <HStack mb={6} justifyContent="space-between">
            <Input
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              placeholder={t('user_management_email_filter_placeholder')}
              maxW="400px"
            />
            <Button
              colorScheme="pink"
              leftIcon={<Plus />}
              onClick={onCreateModalOpen}
            >
              {t('user_management_create_user_button')}
            </Button>
          </HStack>

          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>{t('user_management_email_header')}</Th>
                    <Th>{t('user_management_role_header')}</Th>
                    <Th>{t('user_management_active_header')}</Th>
                    <Th>{t('user_management_actions_header')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.email}</Td>
                      <Td>
                        <VStack align="start" spacing={3}>
                          <HStack spacing={2}>
                            <Badge colorScheme="cyan" fontSize="xs">
                              {t('user_management_current_badge')}
                            </Badge>
                            <Text fontStyle="italic" fontSize="sm">
                              {editState[user.id]?.originalRole}
                            </Text>
                          </HStack>
                          <Box>
                            <Text fontSize="xs" color="gray.500" mb={1}>
                              {t('user_management_change_role')}
                            </Text>
                            <Select
                              value={editState[user.id]?.role || user.role}
                              onChange={(e) =>
                                handleEditRoleChange(
                                  user.id,
                                  e.target.value as UserRole,
                                )
                              }
                              size="sm"
                              maxW="180px"
                            >
                              <option value="Admin">
                                {t('user_management_role_admin')}
                              </option>
                              <option value="Contributor">
                                {t('user_management_role_contributor')}
                              </option>
                              <option value="Researcher">
                                {t('user_management_role_researcher')}
                              </option>
                            </Select>
                          </Box>
                        </VStack>
                      </Td>
                      <Td>
                        <Switch
                          isChecked={
                            editState[user.id]?.isActive ?? user.is_active
                          }
                          onChange={(e) =>
                            handleEditActiveChange(user.id, e.target.checked)
                          }
                        />
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            colorScheme="cyan"
                            onClick={() => handleUpdateUser(user)}
                          >
                            {t('user_management_update_button')}
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDeleteClick(user)}
                          >
                            {t('user_management_delete_button')}
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {users.length > 0 && (
                <HStack mt={6} justifyContent="center">
                  {pagination.currentPage > 0 && (
                    <Button
                      size="sm"
                      leftIcon={<ArrowLeft />}
                      onClick={() =>
                        updateFilters({ page: pagination.currentPage - 1 })
                      }
                    >
                      {t('user_management_previous')}
                    </Button>
                  )}
                  <Box>
                    {t('user_management_page')}
                    <b>{pagination.currentPage + 1}</b>
                    {t('user_management_page_out_of')}
                    <b>{pagination.totalPages}</b>
                  </Box>
                  {pagination.currentPage + 1 < pagination.totalPages && (
                    <Button
                      size="sm"
                      rightIcon={<ArrowRight />}
                      onClick={() =>
                        updateFilters({ page: pagination.currentPage + 1 })
                      }
                    >
                      {t('user_management_next')}
                    </Button>
                  )}
                </HStack>
              )}

              {users.length === 0 && !isLoading && (
                <Box textAlign="center" mt={6}>
                  {t('user_management_no_users_found')}
                </Box>
              )}
            </>
          )}
        </Box>
      </VStack>

      {/* Create User Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={onCreateModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('user_management_create_modal_title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>{t('user_management_email_label')}</FormLabel>
              <Input
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder={t('user_management_email_placeholder')}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>{t('user_management_role_label')}</FormLabel>
              <Select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
              >
                <option value="Admin">{t('user_management_role_admin')}</option>
                <option value="Contributor">
                  {t('user_management_role_contributor')}
                </option>
                <option value="Researcher">
                  {t('user_management_role_researcher')}
                </option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>{t('user_management_active_label')}</FormLabel>
              <Switch
                isChecked={newUserIsActive}
                onChange={(e) => setNewUserIsActive(e.target.checked)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="cyan" mr={3} onClick={handleCreateUser}>
              {t('user_management_create_button')}
            </Button>
            <Button variant="ghost" onClick={onCreateModalClose}>
              {t('user_management_cancel_button')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('user_management_delete_dialog_title')}
            </AlertDialogHeader>
            <AlertDialogBody>
              {t('user_management_delete_dialog_body', {
                email: userToDelete?.email,
              })}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                {t('user_management_cancel_button')}
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                {t('user_management_delete_confirm_button')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  )
}
