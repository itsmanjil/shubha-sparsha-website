import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteConfigProvider } from './contexts/SiteConfigContext'
import AdminRoute from './components/AdminRoute'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './index.css'

function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SiteConfigProvider>
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
      </SiteConfigProvider>
    </BrowserRouter>
  )
}

export default App
