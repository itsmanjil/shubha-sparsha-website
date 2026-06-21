import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteConfigProvider } from './contexts/SiteConfigContext'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import './index.css'

// Lazy-loaded so the admin bundle never ships to public visitors.
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Gallery />
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
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </Suspense>
      </SiteConfigProvider>
    </BrowserRouter>
  )
}

export default App
