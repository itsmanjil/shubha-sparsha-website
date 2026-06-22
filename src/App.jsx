import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SiteConfigProvider } from './contexts/SiteConfigContext'
import AdminRoute from './components/AdminRoute'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import './index.css'

// Lazy-loaded so visitors who never reach the admin or gallery never
// download their bundles.
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))

function HomePage() {
  const location = useLocation()

  // Cross-page anchor navigation: nav/footer links call navigate('/', { state:
  // { scrollTo: id } }) when clicked from a different page (e.g. /gallery).
  // Once we land here, scroll to that section and clear the state so a
  // refresh or back/forward doesn't re-trigger the scroll.
  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return
    const timer = setTimeout(() => {
      const el = document.getElementById(target)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
      window.history.replaceState({}, document.title)
    }, 50)
    return () => clearTimeout(timer)
  }, [location.state])

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Process />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SiteConfigProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Analytics />
      </SiteConfigProvider>
    </BrowserRouter>
  )
}

export default App
