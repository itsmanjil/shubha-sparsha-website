import { FaWhatsapp } from 'react-icons/fa'
import { useSiteConfig } from '../contexts/SiteConfigContext'
import { getWhatsAppLink } from '../lib/whatsapp'

export default function FloatingWhatsApp() {
  const { config } = useSiteConfig()
  const waLink = getWhatsAppLink(config.contactInfo)

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-[60] flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
      style={{ background: '#25D366' }}
    >
      <FaWhatsapp className="text-3xl" style={{ color: '#0a3d1f' }} />
      <span
        className="absolute inset-0 rounded-full animate-ping"
        style={{ background: '#25D366', opacity: 0.5 }}
        aria-hidden="true"
      />
    </a>
  )
}
