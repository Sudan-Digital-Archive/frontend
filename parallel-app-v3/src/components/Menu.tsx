'use client'

import { Box, HStack, Button, Stack, Text, Portal } from '@chakra-ui/react'
import { NavLink, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from '../hooks/useWindowSize'
import { useUser } from '../hooks/useUser'
import { useState } from 'react'
import { Menu } from '@chakra-ui/react'

interface NavbarProps {
  changeLanguageOverride?: () => void
}

const Navbar = ({ changeLanguageOverride }: NavbarProps) => {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const width = useWindowSize()
  const isMobile = width <= 768
  const { isLoggedIn, role } = useUser()
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
            <NavLink to="/">
              <Text fontWeight="bold" fontSize="xl" className="gradientText">
                {t('nav_the_archive')}
              </Text>
            </NavLink>
          </Box>

          {isMobile ? (
            <Menu.Root
              open={menuOpen}
              onOpenChange={(e) => setMenuOpen(e.open)}
            >
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                  Menu
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      value="archive"
                      onClick={() => handleMenuItemClick('/archive')}
                    >
                      <Text>{t('nav_search')}</Text>
                    </Menu.Item>
                    <Menu.Item
                      value="collections"
                      onClick={() => handleMenuItemClick('/collections')}
                    >
                      <Text>{t('nav_collections')}</Text>
                    </Menu.Item>
                    <Menu.Item
                      value="who-are-we"
                      onClick={() => handleMenuItemClick('/who-are-we')}
                    >
                      <Text>{t('nav_who_are_we')}</Text>
                    </Menu.Item>
                    <Menu.Item
                      value="mission"
                      onClick={() => handleMenuItemClick('/mission')}
                    >
                      <Text>{t('nav_mission')}</Text>
                    </Menu.Item>
                    <Menu.Item
                      value="why-another-archive"
                      onClick={() =>
                        handleMenuItemClick('/why-another-archive')
                      }
                    >
                      <Text>{t('nav_why_another_archive')}</Text>
                    </Menu.Item>
                    <Menu.Item
                      value="tech-stack"
                      onClick={() => handleMenuItemClick('/tech-stack')}
                    >
                      <Text>{t('nav_tech_stack')}</Text>
                    </Menu.Item>
                    <Menu.Item
                      value="code-of-conduct"
                      onClick={() => handleMenuItemClick('/code-of-conduct')}
                    >
                      <Text>{t('nav_coc')}</Text>
                    </Menu.Item>
                    <Menu.Item
                      value="contact-us"
                      onClick={() => handleMenuItemClick('/contact-us')}
                    >
                      <Text>{t('nav_contact')}</Text>
                    </Menu.Item>
                    {!isLoggedIn && (
                      <Menu.Item
                        value="login"
                        onClick={() => handleMenuItemClick('/login')}
                      >
                        <Text>{t('nav_login')}</Text>
                      </Menu.Item>
                    )}
                    {isAdmin && (
                      <Menu.Item
                        value="user-management"
                        onClick={() => handleMenuItemClick('/user-management')}
                      >
                        <Text>{t('nav_user_management')}</Text>
                      </Menu.Item>
                    )}
                    <Menu.Item
                      value="language"
                      onClick={changeLanguageOverride || handleLanguageChange}
                    >
                      <Text>{i18n.language === 'en' ? 'عربي' : 'English'}</Text>
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
                  <Button size="sm" variant="ghost">
                    {t('nav_the_archive')} ▼
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {archiveItems.map((item) => (
                        <Menu.Item
                          key={item.path}
                          value={item.path}
                          onClick={() => navigate(item.path)}
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
                  <Button size="sm" variant="ghost">
                    {t('nav_about')} ▼
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      {aboutItems.map((item) => (
                        <Menu.Item
                          key={item.path}
                          value={item.path}
                          onClick={() => navigate(item.path)}
                        >
                          {item.label}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>

              <NavLink to="/contact-us">
                <Button size="sm" variant="ghost">
                  {t('nav_contact')}
                </Button>
              </NavLink>

              {!isLoggedIn && (
                <NavLink to="/login">
                  <Button size="sm" variant="ghost">
                    {t('nav_login')}
                  </Button>
                </NavLink>
              )}

              {isAdmin && (
                <NavLink to="/user-management">
                  <Button size="sm" variant="ghost">
                    {t('nav_user_management')}
                  </Button>
                </NavLink>
              )}

              <Box>
                <Button
                  colorPalette="pink"
                  variant="ghost"
                  onClick={changeLanguageOverride || handleLanguageChange}
                >
                  {i18n.language === 'en' ? 'عربي' : 'English'}
                </Button>
              </Box>
            </Stack>
          )}
        </HStack>
      </Box>
    </Box>
  )
}

export default Navbar
