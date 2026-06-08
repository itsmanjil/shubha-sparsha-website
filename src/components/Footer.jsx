import { Link } from 'react-scroll'
import { FiInstagram, FiMail } from 'react-icons/fi'

const links = ['hero', 'about', 'services', 'gallery', 'contact']

export default function Footer() {
  return (
    <footer style={{ background: '#1a0000' }}>
      {/* Top gold line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Brand */}
          <div>
            <p
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif", color: '#d4af37' }}
            >
              Shubha Sparsha
            </p>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: '#f7ecd0', opacity: 0.5, fontFamily: "'Lato', sans-serif" }}
            >
              Event Planning
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: '#f7ecd0', opacity: 0.6, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            >
              Crafting unforgettable celebrations with elegance, tradition, and an auspicious touch.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
            >
              Quick Links
            </p>
            <ul className="space-y-3">
              {links.map((id) => (
                <li key={id}>
                  <Link
                    to={id}
                    smooth
                    duration={600}
                    offset={-80}
                    className="cursor-pointer text-sm capitalize transition-colors hover:text-gold-400"
                    style={{
                      color: 'rgba(247,236,208,0.6)',
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    {id === 'gallery' ? 'Portfolio' : id === 'hero' ? 'Home' : id.charAt(0).toUpperCase() + id.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
            >
              Connect With Us
            </p>
            <div className="space-y-4">
              <a
                href="https://www.instagram.com/shubhasparshanp/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm transition-opacity hover:opacity-100"
                style={{ color: 'rgba(247,236,208,0.6)', fontFamily: "'Lato', sans-serif" }}
              >
                <FiInstagram style={{ color: '#d4af37' }} />
                @shubhasparshanp
              </a>
              <a
                href="mailto:shubhasparshanp@gmail.com"
                className="flex items-center gap-3 text-sm transition-opacity hover:opacity-100"
                style={{ color: 'rgba(247,236,208,0.6)', fontFamily: "'Lato', sans-serif" }}
              >
                <FiMail style={{ color: '#d4af37' }} />
                shubhasparshanp@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: '1px solid rgba(212,175,55,0.15)', color: 'rgba(247,236,208,0.4)', fontFamily: "'Lato', sans-serif" }}
        >
          <p>&copy; {new Date().getFullYear()} Shubha Sparsha. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="h-px w-8" style={{ background: '#d4af37', opacity: 0.4 }} />
            <span style={{ color: '#d4af37', opacity: 0.6 }}>✦</span>
            <div className="h-px w-8" style={{ background: '#d4af37', opacity: 0.4 }} />
          </div>
          <p>Crafted with love in Nepal</p>
        </div>
      </div>
    </footer>
  )
}
