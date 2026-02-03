import { ReactNode } from 'react'
import { SlideFade } from '@chakra-ui/react'
import Menu from './Menu.tsx'
import Footer from './Footer.tsx'

interface LayoutProps {
  children: ReactNode
  changeLanguageOverride?: () => void
}

export default function Layout({
  children,
  changeLanguageOverride,
}: LayoutProps) {
  return (
    <>
      <Menu changeLanguageOverride={changeLanguageOverride} />
      <SlideFade in>{children}</SlideFade>
      <Footer />
    </>
  )
}
