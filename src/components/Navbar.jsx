import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

const navLinks = [
  { label: 'Home', to: 'hero' },
  { label: 'About', to: 'about' },
  { label: 'Services', to: 'services' },
  { label: 'Portfolio', to: 'gallery' },
  { label: 'Contact', to: 'contact' },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-maroon-700/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="text-left">
            <span
              className="font-serif text-xl font-semibold tracking-widest"
              style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif" }}
            >
              Shubha Sparsha
            </span>
            <span className="block text-xs tracking-[0.3em] text-white/60 uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>
              Event Planning
            </span>
          </button>

          {/* Desktop links */}
          {isHome && (
            <ul className="hidden lg:flex gap-8 items-center">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    smooth
                    duration={600}
                    offset={-80}
                    className="cursor-pointer text-white/80 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Auth + mobile toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 transition-colors tracking-wider"
                  >
                    <FiSettings size={14} /> Admin
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <FiLogOut size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-gold-400 border border-gold-400/40 px-4 py-2 hover:bg-gold-400/10 transition-colors"
                >
                  <FiUser size={13} /> Admin
                </button>
              )}
            </div>

            <button
              className="lg:hidden text-white text-2xl"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden bg-maroon-700 border-t border-gold-400/20 px-6 pb-8 pt-4">
            <ul className="flex flex-col gap-5">
              {isHome && navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    smooth
                    duration={600}
                    offset={-80}
                    className="cursor-pointer text-white/80 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                {user ? (
                  <button onClick={() => { navigate('/admin'); setOpen(false) }} className="text-gold-400 text-sm tracking-widest uppercase">
                    Admin Dashboard
                  </button>
                ) : (
                  <button onClick={() => { setShowAuth(true); setOpen(false) }} className="text-gold-400 text-sm tracking-widest uppercase">
                    Admin Login
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
