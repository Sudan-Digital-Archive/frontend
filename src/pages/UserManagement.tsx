
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  HStack,
  Spinner,
  Text,
  Flex,
  Table,
  NativeSelect,
  Checkbox,
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, Plus } from 'react-feather'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import { useUsers } from '../hooks/useUsers'
import { useToast } from '../context/ToastContext'
import type { User, UserRole } from '../apiTypes/userTypes'

export default function UserManagement() {
  const { t } = useTranslation()
  const { showToast } = useToast()
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

  const [editState, setEditState] = useState<
    Record<string, { role: UserRole; isActive: boolean }>
  >({})

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState<UserRole>('Contributor')
  const [newUserIsActive, setNewUserIsActive] = useState(true)

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmailFilter(emailFilter)
    }, 300)
    return () => clearTimeout(handler)
  }, [emailFilter])

  useEffect(() => {
    updateFilters({ email: debouncedEmailFilter })
  }, [debouncedEmailFilter, updateFilters])

  useEffect(() => {
    const newEditState: Record<string, { role: UserRole; isActive: boolean }> =
      {}
    users.forEach((user) => {
      newEditState[user.id] = {
        role: user.role,
        isActive: user.is_active,
      }
    })
    setEditState(newEditState)
  }, [users])

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setEditState((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        role: newRole,
      },
    }))
  }

  const handleActiveChange = (userId: string, isActive: boolean) => {
    setEditState((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        isActive,
      },
    }))
  }

  const handleUpdateUser = async (userId: string) => {
    try {
      const state = editState[userId]
      await updateUser(userId, {
        role: state.role,
        is_active: state.isActive,
      })
      showToast(t('user_management_update_success'), 'success')
    } catch {
      showToast(t('user_management_update_error'), 'error')
    }
  }

  const handleCreateUser = async () => {
    try {
      await createUser({
        email: newUserEmail,
        role: newUserRole,
        is_active: newUserIsActive,
      })
      showToast(t('user_management_create_success'), 'success')
      setIsCreateModalOpen(false)
      setNewUserEmail('')
      setNewUserRole('Contributor')
      setNewUserIsActive(true)
    } catch {
      showToast(t('user_management_create_error'), 'error')
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteUserId) return
    try {
      await deleteUser(deleteUserId)
      showToast(t('user_management_delete_success'), 'success')
      setDeleteUserId(null)
    } catch {
      showToast(t('user_management_delete_error'), 'error')
    }
  }

  return (
    <Layout>
      <VStack alignItems="center" justifyContent="center" p={8}>
        <Heading
          size="xl"
          bgGradient="linear(to-r, cyan.300, pink.600)"
          bgClip="text"
          mb={8}
        >
          {t('user_management_title')}
        </Heading>

        <Box w="100%" maxW="1000px">
          <Flex mb={4} justifyContent="space-between" alignItems="center">
            <Input
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              placeholder={t('user_management_email_filter_placeholder')}
              maxW="300px"
              bg="input.bg"
              borderColor="input.border"
              _placeholder={{ color: 'fg.muted' }}
            />
            <Button
              variant="ghost"
              colorPalette="cyan"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={16} style={{ marginRight: '4px' }} />
              {t('user_management_create_user_button')}
            </Button>
          </Flex>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={10}>
              <Spinner />
            </Box>
          ) : users.length === 0 ? (
            <Text textAlign="center" py={10}>
              {t('user_management_no_users_found')}
            </Text>
          ) : (
            <>
              <Box overflowX="auto">
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>
                        {t('user_management_email_header')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader>
                        {t('user_management_role_header')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader>
                        {t('user_management_active_header')}
                      </Table.ColumnHeader>
                      <Table.ColumnHeader>
                        {t('user_management_actions_header')}
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {users.map((user: User) => (
                      <Table.Row key={user.id}>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                          <NativeSelect.Root maxW="150px" bg="bg.emphasized">
                            <NativeSelect.Field
                              value={editState[user.id]?.role || user.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value as UserRole,
                                )
                              }
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
                            </NativeSelect.Field>
                          </NativeSelect.Root>
                        </Table.Cell>
                        <Table.Cell>
                          <Checkbox.Root
                            checked={
                              editState[user.id]?.isActive ?? user.is_active
                            }
                            onCheckedChange={(e) =>
                              handleActiveChange(user.id, e.checked === true)
                            }
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label />
                          </Checkbox.Root>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack gap={2}>
                            <Button
                              size="sm"
                              variant="ghost"
                              colorPalette="cyan"
                              onClick={() => handleUpdateUser(user.id)}
                            >
                              {t('user_management_update_button')}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              colorPalette="red"
                              onClick={() => setDeleteUserId(user.id)}
                            >
                              {t('user_management_delete_button')}
                            </Button>
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>

              <HStack mt={4} justifyContent="center">
                {pagination.currentPage !== 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      updateFilters({ page: pagination.currentPage - 1 })
                    }
                  >
                    <ArrowLeft size={14} style={{ marginRight: '4px' }} />
                    {t('user_management_previous')}
                  </Button>
                )}
                {pagination.currentPage + 1 < pagination.totalPages && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      updateFilters({ page: pagination.currentPage + 1 })
                    }
                  >
                    {t('user_management_next')}
                    <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                  </Button>
                )}
              </HStack>
            </>
          )}
        </Box>
      </VStack>

      {isCreateModalOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.700"
          zIndex={1000}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg="bg.subtle"
            p={6}
            borderRadius="md"
            maxW="500px"
            mx={4}
            border="1px solid"
            borderColor="border"
          >
            <VStack gap={4} align="stretch">
              <Heading size="md">
                {t('user_management_create_modal_title')}
              </Heading>

              <Box>
                <Text mb={1}>{t('user_management_email_label')}</Text>
                <Input
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder={t('user_management_email_placeholder')}
                  bg="input.bg"
                  borderColor="input.border"
                />
              </Box>

              <Box>
                <Text mb={1}>{t('user_management_role_label')}</Text>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    bg="bg.emphasized"
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
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>

              <Flex alignItems="center" gap={2}>
                <Checkbox.Root
                  checked={newUserIsActive}
                  onCheckedChange={(e) =>
                    setNewUserIsActive(e.checked === true)
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label />
                </Checkbox.Root>
                <Text>{t('user_management_active_label')}</Text>
              </Flex>

              <HStack justifyContent="flex-end" gap={2}>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  {t('user_management_cancel_button')}
                </Button>
                <Button
                  variant="ghost"
                  colorPalette="cyan"
                  onClick={handleCreateUser}
                >
                  {t('user_management_create_button')}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}

      {deleteUserId && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.700"
          zIndex={1000}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg="bg.subtle"
            p={6}
            borderRadius="md"
            maxW="500px"
            mx={4}
            border="1px solid"
            borderColor="border"
          >
            <VStack gap={4} align="stretch">
              <Heading size="md">
                {t('user_management_delete_dialog_title')}
              </Heading>
              <Text>
                {t('user_management_delete_dialog_body', {
                  email: users.find((u) => u.id === deleteUserId)?.email,
                })}
              </Text>
              <HStack justifyContent="flex-end" gap={2}>
                <Button variant="outline" onClick={() => setDeleteUserId(null)}>
                  {t('delete_accession_cancel_button')}
                </Button>
                <Button
                  variant="ghost"
                  colorPalette="red"
                  onClick={handleDeleteUser}
                >
                  {t('user_management_delete_confirm_button')}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </Layout>
  )
}
