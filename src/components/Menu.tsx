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
    const { isLoggedIn } = useUser()

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
                <MenuItem pl={6}>
                  <NavLink to="/archive">{t('nav_search')}</NavLink>
                </MenuItem>
                <MenuItem pl={6}>
                  <NavLink to="/collections">{t('nav_collections')}</NavLink>
                </MenuItem>
                <MenuItem isDisabled>
                  <HStack>
                    <Text fontWeight="bold">{t('nav_about')}</Text>
                    <ChevronDown size="16" />
                  </HStack>
                </MenuItem>
                <MenuItem pl={6}>
                  <NavLink to="/who-are-we">{t('nav_who_are_we')}</NavLink>
                </MenuItem>
                <MenuItem pl={6}>
                  <NavLink to="/mission">{t('nav_mission')}</NavLink>
                </MenuItem>
                <MenuItem pl={6}>
                  <NavLink to="/why-another-archive">
                    {t('nav_why_another_archive')}
                  </NavLink>
                </MenuItem>
                <MenuItem pl={6}>
                  <NavLink to="/tech-stack">{t('nav_tech_stack')}</NavLink>
                </MenuItem>
                <MenuItem pl={6}>
                  <NavLink to="/code-of-conduct">{t('nav_coc')}</NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/contact-us">{t('nav_contact')}</NavLink>
                </MenuItem>
                {!isLoggedIn && (
                  <MenuItem>
                    <NavLink to="/login">{t('nav_login')}</NavLink>
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
                <MenuItem>
                  <NavLink to="/archive">{t('nav_search')}</NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/collections">{t('nav_collections')}</NavLink>
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
                <MenuItem>
                  <NavLink to="/who-are-we">{t('nav_who_are_we')}</NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/mission">{t('nav_mission')}</NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/why-another-archive">
                    {t('nav_why_another_archive')}
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/tech-stack">{t('nav_tech_stack')}</NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/code-of-conduct">{t('nav_coc')}</NavLink>
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
