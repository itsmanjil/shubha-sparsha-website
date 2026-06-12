import { Link } from 'react-scroll'
import { FiInstagram, FiMail } from 'react-icons/fi'
import { useSiteConfig } from '../contexts/SiteConfigContext'

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
]

export default function Footer() {
  const { config } = useSiteConfig()
  const { colors, footer, contactInfo } = config

  return (
    <footer style={{ background: '#1a0000' }}>
      {/* Top gold line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)` }} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Brand */}
          <div>
            <p
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif", color: colors.gold }}
            >
              Shubha Sparsha
            </p>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: 'rgba(247,236,208,0.5)', fontFamily: "'Lato', sans-serif" }}
            >
              Event Planning
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(247,236,208,0.6)', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            >
              {footer.tagline}
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
            >
              Quick Links
            </p>
            <ul className="space-y-3">
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <Link
                    to={id}
                    smooth
                    duration={600}
                    offset={-80}
                    className="cursor-pointer text-sm capitalize transition-colors"
                    style={{
                      color: 'rgba(247,236,208,0.6)',
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
            >
              Connect With Us
            </p>
            <div className="space-y-4">
              <a
                href={contactInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm transition-opacity hover:opacity-100"
                style={{ color: 'rgba(247,236,208,0.6)', fontFamily: "'Lato', sans-serif" }}
              >
                <FiInstagram style={{ color: colors.gold }} />
                {contactInfo.instagramHandle}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-sm transition-opacity hover:opacity-100"
                style={{ color: 'rgba(247,236,208,0.6)', fontFamily: "'Lato', sans-serif" }}
              >
                <FiMail style={{ color: colors.gold }} />
                {contactInfo.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: `1px solid ${colors.gold}26`, color: 'rgba(247,236,208,0.4)', fontFamily: "'Lato', sans-serif" }}
        >
          <p>&copy; {new Date().getFullYear()} Shubha Sparsha. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="h-px w-8" style={{ background: colors.gold, opacity: 0.4 }} />
            <span style={{ color: colors.gold, opacity: 0.6 }}>✦</span>
            <div className="h-px w-8" style={{ background: colors.gold, opacity: 0.4 }} />
          </div>
          <p>{footer.bottomText}</p>
        </div>
      </div>
    </footer>
  )
}
