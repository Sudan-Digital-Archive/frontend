import { useEffect } from 'react'
import CodeOfConduct from './pages/CodeofConduct.tsx'
import Archive from './pages/Archive.tsx'
import Mission from './pages/Mission.tsx'
import ViewAccession from './pages/ViewAccession.tsx'
import WhoAreWe from './pages/WhoAreWe.tsx'
import WhyAnotherArchive from './pages/WhyAnotherArchive.tsx'
import TechnicalStack from './pages/TechnicalStack.tsx'
import Collections from './pages/Collections.tsx'
import CollectionView from './pages/CollectionView.tsx'
import NotFound from './pages/NotFound.tsx'
import UserManagement from './pages/UserManagement.tsx'
import './il18n.ts'
import './css/styles.css'
import { Routes, Route, ScrollRestoration } from 'react-router'
import Home from './pages/Home.tsx'
import ContactUs from './pages/ContactUs.tsx'
import Login from './pages/Login.tsx'
import JWTAuth from './pages/JWTAuth.tsx'
import { useUser } from './hooks/useUser.ts'

export const App = () => {
  const { setIsLoggedIn } = useUser()

  // note this is information only, the actual auth cookie is httpOnly
  // so can't be accessed via JS, this is just to update the UI
  useEffect(() => {
    const isLoggedInCookie = document.cookie
      .split(';')
      .some((item) => item.trim() === 'logged_in=true')
    if (isLoggedInCookie) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [setIsLoggedIn])

  return (
    <>
      <ScrollRestoration />
      <Routes>
        <Route index element={<Home />} />
        <Route path="mission" element={<Mission />} />
        <Route path="who-are-we" element={<WhoAreWe />} />
        <Route path="why-another-archive" element={<WhyAnotherArchive />} />
        <Route path="tech-stack" element={<TechnicalStack />} />
        <Route path="code-of-conduct" element={<CodeOfConduct />} />
        <Route path="archive" element={<Archive />} />
        <Route path="collections" element={<Collections />} />
        <Route path="collections/:id" element={<CollectionView />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="archive/:id" element={<ViewAccession />} />
        <Route path="login" element={<Login />} />
        <Route path="jwt-auth" element={<JWTAuth />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
