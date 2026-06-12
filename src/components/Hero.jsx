import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { FiInstagram, FiArrowDown } from 'react-icons/fi'
import { useSiteConfig } from '../contexts/SiteConfigContext'

export default function Hero() {
  const { config } = useSiteConfig()
  const { colors, hero, contactInfo, heroSlides } = config
  const slides = Array.isArray(heroSlides) ? heroSlides : []
  const hasSlides = slides.length > 0
  const interval = Math.max(2, hero.sliderInterval || 5) * 1000

  const [activeSlide, setActiveSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => advanceTo((activeSlide + 1) % slides.length), interval)
    return () => clearInterval(t)
  }, [slides.length, activeSlide, interval])

  function advanceTo(idx) {
    if (idx === activeSlide) return
    setPrevSlide(activeSlide)
    setFading(true)
    setActiveSlide(idx)
    setTimeout(() => { setPrevSlide(null); setFading(false) }, 900)
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors.maroon} 0%, ${colors.maroon500} 40%, ${colors.maroon500} 70%, ${colors.maroon} 100%)` }}
    >
      {/* Slider background images */}
      {slides.map((url, i) => (
        <div
          key={url}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === activeSlide ? 1 : (i === prevSlide && fading ? 0 : 0),
            transition: i === activeSlide ? 'opacity 0.9s ease-in-out' : 'none',
            zIndex: i === activeSlide ? 1 : (i === prevSlide ? 0 : -1),
          }}
        />
      ))}

      {/* Dark overlay when slides are showing */}
      {hasSlides && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,0,0,0.52)', zIndex: 2 }} />
      )}

      {/* Decorative gold pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          zIndex: 3,
          backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.gold} 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, ${colors.gold} 0%, transparent 40%),
                           radial-gradient(circle at 60% 80%, ${colors.gold} 0%, transparent 35%)`,
        }}
      />

      {/* Thin gold border frame */}
      <div className="absolute inset-6 border border-gold-400/20 pointer-events-none hidden md:block" style={{ zIndex: 3 }} />
      <div className="absolute inset-8 border border-gold-400/10 pointer-events-none hidden md:block" style={{ zIndex: 3 }} />

      {/* Corner ornaments */}
      <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-gold-400/40 hidden md:block" style={{ zIndex: 3 }} />
      <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-gold-400/40 hidden md:block" style={{ zIndex: 3 }} />
      <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-gold-400/40 hidden md:block" style={{ zIndex: 3 }} />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-gold-400/40 hidden md:block" style={{ zIndex: 3 }} />

      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center" style={{ zIndex: 4 }}>
        {/* Gold divider */}
        <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
          <div className="h-px w-8 sm:w-16 flex-shrink-0" style={{ background: `linear-gradient(to right, transparent, ${colors.gold})` }} />
          <span className="text-[10px] sm:text-sm tracking-[0.25em] sm:tracking-[0.4em] uppercase" style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}>
            {hero.tagline}
          </span>
          <div className="h-px w-8 sm:w-16 flex-shrink-0" style={{ background: `linear-gradient(to left, transparent, ${colors.gold})` }} />
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: '#f7ecd0' }}
        >
          {hero.title}{' '}
          <span style={{ color: colors.gold }}>{hero.titleAccent}</span>
          <br />
          <em>{hero.titleItalic}</em>
        </h1>

        <div className="flex items-center justify-center gap-4 my-6 md:my-8">
          <div className="h-px w-12 sm:w-24" style={{ background: `${colors.gold}80` }} />
          <span style={{ color: colors.gold, fontSize: '1.25rem' }}>✦</span>
          <div className="h-px w-12 sm:w-24" style={{ background: `${colors.gold}80` }} />
        </div>

        <p
          className="text-base md:text-xl text-white/70 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
        >
          {hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            to="services"
            smooth
            duration={600}
            offset={-80}
            className="cursor-pointer px-8 md:px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${colors.gold}, #b8960c)`, color: colors.maroon, fontFamily: "'Lato', sans-serif" }}
          >
            {hero.servicesButton}
          </Link>
          <a
            href={contactInfo.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300"
            style={{ border: `1px solid ${colors.gold}99`, color: colors.gold, fontFamily: "'Lato', sans-serif" }}
          >
            <FiInstagram />
            {hero.instagramButton}
          </a>
        </div>
      </div>

      {/* Slide dots */}
      {slides.length > 1 && (
        <div
          className="absolute flex items-center gap-2"
          style={{ bottom: '5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => advanceTo(i)}
              style={{
                width: i === activeSlide ? '28px' : '8px',
                height: '8px',
                background: i === activeSlide ? colors.gold : `${colors.gold}50`,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <Link
        to="about"
        smooth
        duration={600}
        offset={-80}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center gap-2 transition-colors"
        style={{ color: `${colors.gold}99`, zIndex: 5 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>Scroll</span>
        <FiArrowDown className="animate-bounce" />
      </Link>
    </section>
  )
}
