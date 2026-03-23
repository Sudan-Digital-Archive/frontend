'use client'

import { BrowserRouter, Routes, Route } from 'react-router'
import { UserProvider } from './context/UserContext'
import { Provider } from './components/ui/provider'
import { ColorModeProvider } from './components/ui/color-mode'
import Home from './pages/Home'
import Mission from './pages/Mission'
import WhoAreWe from './pages/WhoAreWe'
import WhyAnotherArchive from './pages/WhyAnotherArchive'
import TechnicalStack from './pages/TechnicalStack'
import CodeofConduct from './pages/CodeofConduct'
import Archive from './pages/Archive'
import Collections from './pages/Collections'
import CollectionView from './pages/CollectionView'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import JWTAuth from './pages/JWTAuth'
import UserManagement from './pages/UserManagement'
import NotFound from './pages/NotFound'
import './i18n'
import './css/styles.css'

function App() {
  return (
    <UserProvider>
      <Provider>
        <ColorModeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/who-are-we" element={<WhoAreWe />} />
              <Route
                path="/why-another-archive"
                element={<WhyAnotherArchive />}
              />
              <Route path="/tech-stack" element={<TechnicalStack />} />
              <Route path="/code-of-conduct" element={<CodeofConduct />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/archive/:id" element={<Archive />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:id" element={<CollectionView />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/jwt-auth" element={<JWTAuth />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ColorModeProvider>
      </Provider>
    </UserProvider>
  )
}

export default App
