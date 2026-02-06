import {
  Box,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  IconButton,
  Text,
} from '@chakra-ui/react'
import { ChevronDown, Menu as MenuIcon } from 'react-feather'
import { NavLink } from 'react-router'
import { Home } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from '../hooks/useWindowSize.ts'
import { useUser } from '../hooks/useUser.ts'

interface NavbarProps {
  // useful if you want to prevent layout shifts
  // e.g. refresh data before everything goes right to left
  changeLanguageOverride?: () => void
}

const Navbar = ({ changeLanguageOverride }: NavbarProps) => {
  const { i18n, t } = useTranslation()

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

  const MenuBar = () => {
    const width = useWindowSize()
    const isMobile = width <= 768
    const { isLoggedIn, role } = useUser()
    const isAdmin = role === 'Admin'

    return (
      <>
        {isMobile ? (
          <>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MenuIcon />}
                variant="outline"
              />
              <MenuList>
                <MenuItem isDisabled>
                  <HStack>
                    <Text fontWeight="bold">{t('nav_the_archive')}</Text>
                    <ChevronDown size="16" />
                  </HStack>
                </MenuItem>
                <MenuItem pl={6} as={NavLink} to="/archive">
                  {t('nav_search')}
                </MenuItem>
                <MenuItem pl={6} as={NavLink} to="/collections">
                  {t('nav_collections')}
                </MenuItem>
                <MenuItem isDisabled>
                  <HStack>
                    <Text fontWeight="bold">{t('nav_about')}</Text>
                    <ChevronDown size="16" />
                  </HStack>
                </MenuItem>
                <MenuItem pl={6} as={NavLink} to="/who-are-we">
                  {t('nav_who_are_we')}
                </MenuItem>
                <MenuItem pl={6} as={NavLink} to="/mission">
                  {t('nav_mission')}
                </MenuItem>
                <MenuItem pl={6} as={NavLink} to="/why-another-archive">
                  {t('nav_why_another_archive')}
                </MenuItem>
                <MenuItem pl={6} as={NavLink} to="/tech-stack">
                  {t('nav_tech_stack')}
                </MenuItem>
                <MenuItem pl={6} as={NavLink} to="/code-of-conduct">
                  {t('nav_coc')}
                </MenuItem>
                <MenuItem as={NavLink} to="/contact-us">
                  {t('nav_contact')}
                </MenuItem>
                {!isLoggedIn && (
                  <MenuItem as={NavLink} to="/login">
                    {t('nav_login')}
                  </MenuItem>
                )}
                {isAdmin && (
                  <MenuItem as={NavLink} to="/user-management">
                    {t('nav_user_management')}
                  </MenuItem>
                )}
                <MenuItem
                  onClick={changeLanguageOverride || handleLanguageChange}
                >
                  {i18n.language === 'en' ? 'عربي' : 'English'}
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            aria-label="navigation-menu"
          >
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDown />}
                size="sm"
                variant="ghost"
              >
                {t('nav_the_archive')}
              </MenuButton>
              <MenuList>
                <MenuItem as={NavLink} to="/archive">
                  {t('nav_search')}
                </MenuItem>
                <MenuItem as={NavLink} to="/collections">
                  {t('nav_collections')}
                </MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDown />}
                size="sm"
                variant="ghost"
              >
                {t('nav_about')}
              </MenuButton>
              <MenuList>
                <MenuItem as={NavLink} to="/who-are-we">
                  {t('nav_who_are_we')}
                </MenuItem>
                <MenuItem as={NavLink} to="/mission">
                  {t('nav_mission')}
                </MenuItem>
                <MenuItem as={NavLink} to="/why-another-archive">
                  {t('nav_why_another_archive')}
                </MenuItem>
                <MenuItem as={NavLink} to="/tech-stack">
                  {t('nav_tech_stack')}
                </MenuItem>
                <MenuItem as={NavLink} to="/code-of-conduct">
                  {t('nav_coc')}
                </MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <NavLink to="/contact-us">
                <MenuButton as={Button} size="sm" variant="ghost">
                  {t('nav_contact')}
                </MenuButton>
              </NavLink>
            </Menu>
            {!isLoggedIn && (
              <Menu>
                <NavLink to="/login">
                  <MenuButton as={Button} size="sm" variant="ghost">
                    {t('nav_login')}
                  </MenuButton>
                </NavLink>
              </Menu>
            )}
            {isAdmin && (
              <Menu>
                <NavLink to="/user-management">
                  <MenuButton as={Button} size="sm" variant="ghost">
                    {t('nav_user_management')}
                  </MenuButton>
                </NavLink>
              </Menu>
            )}
            <Box>
              <Button
                colorScheme="pink"
                variant="ghost"
                onClick={changeLanguageOverride || handleLanguageChange}
              >
                {i18n.language === 'en' ? 'عربي' : 'English'}
              </Button>
            </Box>
          </Stack>
        )}
      </>
    )
  }

  return (
    <Box
      as="header"
      zIndex={1}
      borderTop="3px solid"
      style={{
        borderImage:
          'linear-gradient(to right, var(--chakra-colors-cyan-300), var(--chakra-colors-pink-600)) 1 0 0 0',
      }}
    >
      <Box maxW="6xl" mx="auto" px={4}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          py={4}
          flexDir={['column', 'column', 'row']}
          gridGap={[4, 4, 0]}
        >
          <Box display="flex" alignItems="center">
            <NavLink to="/">
              <Home />
            </NavLink>
          </Box>
          <MenuBar />
        </HStack>
      </Box>
    </Box>
  )
}

export default Navbar
