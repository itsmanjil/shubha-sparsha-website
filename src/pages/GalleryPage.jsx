import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import { useSiteConfig } from '../contexts/SiteConfigContext'

export default function GalleryPage() {
  const { config } = useSiteConfig()
  const brandName = config.navbar.brandName || 'Shubha Sparsha'

  useEffect(() => {
    const prev = document.title
    document.title = `Gallery — ${brandName}`
    return () => { document.title = prev }
  }, [brandName])

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <Gallery standalone />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
