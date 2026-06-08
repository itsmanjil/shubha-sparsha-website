import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'

const navLinks = [
  { label: 'Home', to: 'hero' },
  { label: 'About', to: 'about' },
  { label: 'Services', to: 'services' },
  { label: 'Portfolio', to: 'gallery' },
  { label: 'Contact', to: 'contact' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-maroon-700/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      style={{ background: scrolled ? 'rgba(85,0,0,0.95)' : 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-left">
          <span
            className="font-serif text-xl font-semibold tracking-widest"
            style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif" }}
          >
            Shubha Sparsha
          </span>
          <span
            className="block text-xs tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Lato', sans-serif" }}
          >
            Event Planning
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                smooth
                duration={600}
                offset={-80}
                className="cursor-pointer text-sm tracking-widest uppercase transition-colors"
                style={{ color: 'rgba(255,255,255,0.8)', fontFamily: "'Lato', sans-serif" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Book now CTA */}
        <div className="hidden lg:block">
          <Link
            to="contact"
            smooth
            duration={600}
            offset={-80}
            className="cursor-pointer px-6 py-2 text-xs tracking-[0.2em] uppercase font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #b8960c)',
              color: '#2a0000',
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-2xl"
          style={{ color: 'white' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden px-6 pb-8 pt-4"
          style={{ background: '#550000', borderTop: '1px solid rgba(212,175,55,0.2)' }}
        >
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  smooth
                  duration={600}
                  offset={-80}
                  className="cursor-pointer text-sm tracking-widest uppercase"
                  style={{ color: 'rgba(255,255,255,0.8)', fontFamily: "'Lato', sans-serif" }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
