import { Box, HStack, Button, Stack, Text, Portal } from '@chakra-ui/react'
import { NavLink, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from '../hooks/useWindowSize'
import { useUser } from '../hooks/useUser'
import { useColorMode } from './ui/color-mode'
import { useState } from 'react'
import { Menu } from '@chakra-ui/react'
import { ChevronDown, Home, Sun, Moon } from 'react-feather'

interface NavbarProps {
  changeLanguageOverride?: () => void
}

const Navbar = ({ changeLanguageOverride }: NavbarProps) => {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const width = useWindowSize()
  const isMobile = width <= 768
  const { isLoggedIn, role } = useUser()
  const { colorMode, toggleColorMode } = useColorMode()
  const isAdmin = role?.toLowerCase() === 'admin'
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLanguage)
    switch (newLanguage) {
      case 'en':
        document.documentElement.lang = 'en'
        document.documentElement.dir = 'ltr'
        break
      case 'ar':
        document.documentElement.lang = 'ar'
        document.documentElement.dir = 'rtl'
        break
      default:
        throw `Language ${newLanguage} is not supported`
    }
  }

  const archiveItems = [
    { path: '/archive', label: t('nav_search') },
    { path: '/collections', label: t('nav_collections') },
  ]

  const aboutItems = [
    { path: '/who-are-we', label: t('nav_who_are_we') },
    { path: '/mission', label: t('nav_mission') },
    { path: '/why-another-archive', label: t('nav_why_another_archive') },
    { path: '/tech-stack', label: t('nav_tech_stack') },
    { path: '/code-of-conduct', label: t('nav_coc') },
  ]

  const handleMenuItemClick = (path: string) => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <Box
      as="header"
      zIndex={1}
      borderTop="3px solid"
      style={{
        borderImage: 'linear-gradient(to right, #67e8f9, #ec4899) 1 0 0 0',
      }}
    >
      <Box maxW="6xl" mx="auto" px={4}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          py={4}
          flexDir={['column', 'column', 'row']}
          gap={[4, 4, 0]}
        >
          <Box display="flex" alignItems="center">
            <NavLink to="/" style={{ cursor: 'pointer' }}>
              <Home size={20} />
            </NavLink>
          </Box>

          {isMobile ? (
            <Menu.Root
              open={menuOpen}
              onOpenChange={(e) => setMenuOpen(e.open)}
            >
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                  <ChevronDown size={16} />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content bg="colors.dropdownBg">
                    <Menu.ItemGroup>
                      <Menu.ItemGroupLabel
                        px={4}
                        py={2}
                        color="fg.muted"
                        fontWeight="semibold"
                      >
                        {t('nav_the_archive')}
                      </Menu.ItemGroupLabel>
                      {archiveItems.map((item) => (
                        <Menu.Item
                          key={item.path}
                          value={item.path}
                          onClick={() => handleMenuItemClick(item.path)}
                          cursor="pointer"
                          px={4}
                          py={2}
                          _hover={{ bg: 'colors.dropdownHover' }}
                        >
                          {item.label}
                        </Menu.Item>
                      ))}
                    </Menu.ItemGroup>

                    <Menu.Separator />

                    <Menu.ItemGroup>
                      <Menu.ItemGroupLabel
                        px={4}
                        py={2}
                        color="fg.muted"
                        fontWeight="semibold"
                      >
                        {t('nav_about')}
                      </Menu.ItemGroupLabel>
                      {aboutItems.map((item) => (
                        <Menu.Item
                          key={item.path}
                          value={item.path}
                          onClick={() => handleMenuItemClick(item.path)}
                          cursor="pointer"
                          px={4}
                          py={2}
                          _hover={{ bg: 'colors.dropdownHover' }}
                        >
                          {item.label}
                        </Menu.Item>
                      ))}
                    </Menu.ItemGroup>

                    <Menu.Separator />

                    <Menu.Item
                      value="contact-us"
                      onClick={() => handleMenuItemClick('/contact-us')}
                      cursor="pointer"
                      px={4}
                      py={2}
                      _hover={{ bg: 'colors.dropdownHover' }}
                    >
                      <Text>{t('nav_contact')}</Text>
                    </Menu.Item>

                    {!isLoggedIn && (
                      <Menu.Item
                        value="login"
                        onClick={() => handleMenuItemClick('/login')}
                        cursor="pointer"
                        px={4}
                        py={2}
                        _hover={{ bg: 'colors.dropdownHover' }}
                      >
                        <Text>{t('nav_login')}</Text>
                      </Menu.Item>
                    )}

                    {isAdmin && (
                      <Menu.Item
                        value="user-management"
                        onClick={() => handleMenuItemClick('/user-management')}
                        cursor="pointer"
                        px={4}
                        py={2}
                        _hover={{ bg: 'colors.dropdownHover' }}
                      >
                        <Text>{t('nav_user_management')}</Text>
                      </Menu.Item>
                    )}

                    <Menu.Separator />

                    <Menu.Item
                      value="language"
                      onClick={changeLanguageOverride || handleLanguageChange}
                      cursor="pointer"
                      px={4}
                      py={2}
                      _hover={{ bg: 'colors.dropdownHoverPink' }}
                    >
                      <Text colorPalette="pink">
                        {i18n.language === 'en' ? 'عربي' : 'English'}
                      </Text>
                    </Menu.Item>

                    <Menu.Item
                      value="theme"
                      onClick={toggleColorMode}
                      cursor="pointer"
                      px={4}
                      py={2}
                      _hover={{ bg: 'colors.dropdownHover' }}
                    >
                      <HStack gap={2}>
                        {colorMode === 'dark' ? (
                          <Sun size={16} />
                        ) : (
                          <Moon size={16} />
                        )}
                        <Text display={{ base: 'none', md: 'block' }}>
                          {colorMode === 'dark'
                            ? t('light_mode')
                            : t('dark_mode')}
                        </Text>
                      </HStack>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          ) : (
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              aria-label="navigation-menu"
            >
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    cursor="pointer"
                    _hover={{ bg: 'colors.dropdownHover' }}
                  >
                    {t('nav_the_archive')}{' '}
                    <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content bg="dropdownBg" minWidth="150px">
                      {archiveItems.map((item) => (
                        <Menu.Item
                          key={item.path}
                          value={item.path}
                          onClick={() => navigate(item.path)}
                          cursor="pointer"
                          px={4}
                          py={2}
                          _hover={{ bg: 'colors.dropdownHover' }}
                        >
                          {item.label}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    cursor="pointer"
                    _hover={{ bg: 'colors.dropdownHover' }}
                  >
                    {t('nav_about')}{' '}
                    <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content bg="dropdownBg" minWidth="180px">
                      {aboutItems.map((item) => (
                        <Menu.Item
                          key={item.path}
                          value={item.path}
                          onClick={() => navigate(item.path)}
                          cursor="pointer"
                          px={4}
                          py={2}
                          _hover={{ bg: 'colors.dropdownHover' }}
                        >
                          {item.label}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              <NavLink to="/contact-us" style={{ cursor: 'pointer' }}>
                <Button
                  size="sm"
                  variant="ghost"
                  cursor="pointer"
                  _hover={{ bg: 'colors.dropdownHover' }}
                >
                  {t('nav_contact')}
                </Button>
              </NavLink>

              {!isLoggedIn && (
                <NavLink to="/login" style={{ cursor: 'pointer' }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    cursor="pointer"
                    _hover={{ bg: 'colors.dropdownHover' }}
                  >
                    {t('nav_login')}
                  </Button>
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/user-management" style={{ cursor: 'pointer' }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    cursor="pointer"
                    _hover={{ bg: 'colors.dropdownHover' }}
                  >
                    {t('nav_user_management')}
                  </Button>
                </NavLink>
              )}

              <Button
                colorPalette="pink"
                variant="ghost"
                cursor="pointer"
                onClick={changeLanguageOverride || handleLanguageChange}
                _hover={{ bg: 'colors.dropdownHoverPink' }}
              >
                {i18n.language === 'en' ? 'عربي' : 'English'}
              </Button>

              <Button
                variant="ghost"
                cursor="pointer"
                onClick={toggleColorMode}
                _hover={{ bg: 'colors.dropdownHover' }}
                p={2}
              >
                {colorMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </Stack>
          )}
        </HStack>
      </Box>
    </Box>
  )
}

export default Navbar
