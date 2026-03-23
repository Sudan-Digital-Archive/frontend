'use client'

import { ReactNode } from 'react'
import Menu from './Menu'
import Footer from './Footer'
import { Toast } from './ui/Toast'

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
      <Toast />
      {children}
      <Footer />
    </>
  )
}
