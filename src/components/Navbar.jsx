import { useState, useEffect } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { useSiteConfig } from '../contexts/SiteConfigContext'

// Renders a nav entry that adapts to where the visitor currently is:
// - id starting with "/" is a real page (e.g. the Gallery page) -> router Link
// - otherwise it's a homepage section anchor:
//   - already on "/" -> react-scroll smooth-scrolls in place
//   - on another page (e.g. /gallery) -> navigates home and asks HomePage
//     to scroll to that section once it mounts (see App.jsx)
function NavEntry({ id, label, isHome, navigate, className, style, onClick }) {
  if (id.startsWith('/')) {
    return (
      <RouterLink to={id} className={className} style={style} onClick={onClick}>
        {label}
      </RouterLink>
    )
  }
  if (isHome) {
    return (
      <ScrollLink to={id} smooth duration={600} offset={-80} className={`cursor-pointer ${className}`} style={style} onClick={onClick}>
        {label}
      </ScrollLink>
    )
  }
  return (
    <button
      type="button"
      onClick={() => { navigate('/', { state: { scrollTo: id } }); onClick?.() }}
      className={`cursor-pointer text-left ${className}`}
      style={style}
    >
      {label}
    </button>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { config } = useSiteConfig()
  const { colors, navbar, navLinks = [] } = config
  const lt = colors.lightText || '#f7ecd0'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{ background: scrolled || !isHome ? `${colors.maroon500}f2` : 'transparent', backdropFilter: scrolled || !isHome ? 'blur(8px)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-left flex items-center gap-3">
          {navbar.logoUrl ? (
            <img
              src={navbar.logoUrl}
              alt={navbar.brandName}
              style={{ height: '40px', width: '40px', objectFit: 'contain', borderRadius: '4px', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: '36px', height: '36px', borderRadius: '4px', flexShrink: 0,
              background: `linear-gradient(135deg, ${colors.gold}, #b8960c)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: colors.maroon, fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem', fontWeight: 700,
            }}>
              {navbar.brandName.charAt(0)}
            </div>
          )}
          <div>
            <span
              className="font-serif text-lg md:text-xl font-semibold tracking-widest block"
              style={{ color: colors.gold, fontFamily: "'Playfair Display', serif" }}
            >
              {navbar.brandName}
            </span>
            <span
              className="block text-xs tracking-[0.3em] uppercase"
              style={{ color: `${lt}99`, fontFamily: "'Lato', sans-serif" }}
            >
              {navbar.brandSubtitle}
            </span>
          </div>
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.id}>
              <NavEntry
                id={link.id}
                label={link.label}
                isHome={isHome}
                navigate={navigate}
                className="text-sm tracking-widest uppercase transition-colors"
                style={{ color: `${lt}cc`, fontFamily: "'Lato', sans-serif" }}
              />
            </li>
          ))}
        </ul>

        {/* Book now CTA */}
        <div className="hidden lg:block">
          <NavEntry
            id="contact"
            label={navbar.ctaButton}
            isHome={isHome}
            navigate={navigate}
            className="px-6 py-2 text-xs tracking-[0.2em] uppercase font-semibold transition-all"
            style={{
              background: `linear-gradient(135deg, ${colors.gold}, #b8960c)`,
              color: colors.maroon,
              fontFamily: "'Lato', sans-serif",
            }}
          />
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-2xl"
          style={{ color: lt }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden px-4 md:px-6 pb-8 pt-4"
          style={{ background: `${colors.maroon500}f5`, borderTop: `1px solid ${colors.gold}33` }}
        >
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.id}>
                <NavEntry
                  id={link.id}
                  label={link.label}
                  isHome={isHome}
                  navigate={navigate}
                  className="text-sm tracking-widest uppercase"
                  style={{ color: `${lt}cc`, fontFamily: "'Lato', sans-serif" }}
                  onClick={() => setOpen(false)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
