import { ReactNode } from 'react'
import Menu from './Menu'
import Footer from './Footer'
import { ToasterComponent } from './ui/toaster'

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
      <ToasterComponent />
      {children}
      <Footer />
    </>
  )
}
