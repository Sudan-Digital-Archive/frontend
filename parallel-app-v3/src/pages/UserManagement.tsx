'use client'

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
} from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, Plus } from 'react-feather'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'
import { useUsers } from '../hooks/useUsers'
import type { User, UserRole } from '../apiTypes/userTypes'

export default function UserManagement() {
  const { t } = useTranslation()
  const [showToast, setShowToast] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
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
      setShowToast({
        type: 'success',
        message: t('user_management_update_success'),
      })
    } catch {
      setShowToast({
        type: 'error',
        message: t('user_management_update_error'),
      })
    }
  }

  const handleCreateUser = async () => {
    try {
      await createUser({
        email: newUserEmail,
        role: newUserRole,
        is_active: newUserIsActive,
      })
      setShowToast({
        type: 'success',
        message: t('user_management_create_success'),
      })
      setIsCreateModalOpen(false)
      setNewUserEmail('')
      setNewUserRole('Contributor')
      setNewUserIsActive(true)
    } catch {
      setShowToast({
        type: 'error',
        message: t('user_management_create_error'),
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteUserId) return
    try {
      await deleteUser(deleteUserId)
      setShowToast({
        type: 'success',
        message: t('user_management_delete_success'),
      })
      setDeleteUserId(null)
    } catch {
      setShowToast({
        type: 'error',
        message: t('user_management_delete_error'),
      })
    }
  }

  return (
    <Layout>
      {showToast && (
        <Box
          position="fixed"
          top={4}
          right={4}
          p={3}
          bg={showToast.type === 'success' ? 'green.500' : 'red.500'}
          color="white"
          borderRadius="md"
          zIndex={9999}
        >
          {showToast.message}
        </Box>
      )}
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
            />
            <Button
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
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th>{t('user_management_email_header')}</th>
                      <th>{t('user_management_role_header')}</th>
                      <th>{t('user_management_active_header')}</th>
                      <th>{t('user_management_actions_header')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: User) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>
                          <select
                            value={editState[user.id]?.role || user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id,
                                e.target.value as UserRole,
                              )
                            }
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--chakra-colors-gray-700)',
                            }}
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
                          </select>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={
                              editState[user.id]?.isActive ?? user.is_active
                            }
                            onChange={(e) =>
                              handleActiveChange(user.id, e.target.checked)
                            }
                          />
                        </td>
                        <td>
                          <HStack gap={2}>
                            <Button
                              size="sm"
                              colorPalette="blue"
                              onClick={() => handleUpdateUser(user.id)}
                            >
                              {t('user_management_update_button')}
                            </Button>
                            <Button
                              size="sm"
                              colorPalette="red"
                              onClick={() => setDeleteUserId(user.id)}
                            >
                              {t('user_management_delete_button')}
                            </Button>
                          </HStack>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <Text>
                  {t('user_management_page')}
                  <b>{pagination.currentPage + 1}</b>
                  {t('user_management_page_out_of')}
                  <b>{pagination.totalPages}</b>
                </Text>
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
          <Box bg="gray.800" p={6} borderRadius="md" maxW="500px" mx={4}>
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
                />
              </Box>

              <Box>
                <Text mb={1}>{t('user_management_role_label')}</Text>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--chakra-colors-gray-700)',
                  }}
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
                </select>
              </Box>

              <Flex alignItems="center" gap={2}>
                <input
                  type="checkbox"
                  checked={newUserIsActive}
                  onChange={(e) => setNewUserIsActive(e.target.checked)}
                />
                <Text>{t('user_management_active_label')}</Text>
              </Flex>

              <HStack justifyContent="flex-end" gap={2}>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  {t('user_management_cancel_button')}
                </Button>
                <Button colorPalette="cyan" onClick={handleCreateUser}>
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
          <Box bg="gray.800" p={6} borderRadius="md" maxW="500px" mx={4}>
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
                <Button colorPalette="red" onClick={handleDeleteUser}>
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
