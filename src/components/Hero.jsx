import { Link } from 'react-scroll'
import { FiInstagram, FiArrowDown } from 'react-icons/fi'
import { useSiteConfig } from '../contexts/SiteConfigContext'

export default function Hero() {
  const { config } = useSiteConfig()
  const { colors, hero, contactInfo } = config

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors.maroon} 0%, #550000 40%, #6b0000 70%, #3d2000 100%)` }}
    >
      {/* Decorative gold pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.gold} 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, ${colors.gold} 0%, transparent 40%),
                           radial-gradient(circle at 60% 80%, ${colors.gold} 0%, transparent 35%)`,
        }}
      />

      {/* Thin gold border frame */}
      <div className="absolute inset-6 border border-gold-400/20 pointer-events-none hidden md:block" />
      <div className="absolute inset-8 border border-gold-400/10 pointer-events-none hidden md:block" />

      {/* Corner ornaments */}
      <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-gold-400/40 hidden md:block" />
      <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-gold-400/40 hidden md:block" />
      <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-gold-400/40 hidden md:block" />
      <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-gold-400/40 hidden md:block" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
        {/* Gold divider */}
        <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent" style={{ background: `linear-gradient(to right, transparent, ${colors.gold})` }} />
          <span className="text-sm tracking-[0.4em] uppercase" style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}>
            {hero.tagline}
          </span>
          <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${colors.gold})` }} />
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: '#f7ecd0' }}
        >
          {hero.title}{' '}
          <span style={{ color: colors.gold }}>
            {hero.titleAccent}
          </span>
          <br />
          <em>{hero.titleItalic}</em>
        </h1>

        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-px w-24" style={{ background: `${colors.gold}80` }} />
          <span style={{ color: colors.gold, fontSize: '1.25rem' }}>✦</span>
          <div className="h-px w-24" style={{ background: `${colors.gold}80` }} />
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
            style={{
              background: `linear-gradient(135deg, ${colors.gold}, #b8960c)`,
              color: colors.maroon,
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Our Services
          </Link>
          <a
            href={contactInfo.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300"
            style={{ border: `1px solid ${colors.gold}99`, color: colors.gold, fontFamily: "'Lato', sans-serif" }}
          >
            <FiInstagram />
            Instagram
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <Link
        to="about"
        smooth
        duration={600}
        offset={-80}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center gap-2 transition-colors"
        style={{ color: `${colors.gold}99` }}
      >
        <span className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>Scroll</span>
        <FiArrowDown className="animate-bounce" />
      </Link>
    </section>
  )
}
