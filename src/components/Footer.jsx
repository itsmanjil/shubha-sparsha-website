import { Link } from 'react-scroll'
import { FiInstagram, FiMail } from 'react-icons/fi'
import { useSiteConfig } from '../contexts/SiteConfigContext'

export default function Footer() {
  const { config } = useSiteConfig()
  const { colors, footer, contactInfo, navLinks = [] } = config
  const lt = colors.lightText || '#f7ecd0'

  return (
    <footer style={{ background: colors.maroon }}>
      {/* Top gold line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)` }} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif", color: colors.gold }}
            >
              {footer.brandName}
            </p>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: `${lt}80`, fontFamily: "'Lato', sans-serif" }}
            >
              {footer.brandSubtitle}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: `${lt}99`, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            >
              {footer.tagline}
            </p>
          </div>

          {/* Nav links */}
          <div className="text-center md:text-left">
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
                      color: `${lt}99`,
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
          <div className="text-center md:text-left">
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
                className="inline-flex items-center gap-3 text-sm transition-opacity hover:opacity-100"
                style={{ color: `${lt}99`, fontFamily: "'Lato', sans-serif" }}
              >
                <FiInstagram style={{ color: colors.gold }} />
                {contactInfo.instagramHandle}
              </a>
              <div>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="inline-flex items-center gap-3 text-sm transition-opacity hover:opacity-100"
                  style={{ color: `${lt}99`, fontFamily: "'Lato', sans-serif" }}
                >
                  <FiMail style={{ color: colors.gold }} />
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-center md:text-left"
          style={{ borderTop: `1px solid ${colors.gold}26`, color: `${lt}66`, fontFamily: "'Lato', sans-serif" }}
        >
          <p>&copy; {new Date().getFullYear()} {footer.copyright}</p>
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
