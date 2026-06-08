import { Link } from 'react-scroll'
import { FiInstagram, FiArrowDown } from 'react-icons/fi'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2a0000 0%, #550000 40%, #6b0000 70%, #3d2000 100%)' }}
    >
      {/* Decorative gold pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #d4af37 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #d4af37 0%, transparent 40%),
                           radial-gradient(circle at 60% 80%, #d4af37 0%, transparent 35%)`,
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
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
          <span className="text-gold-400 text-sm tracking-[0.4em] uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>
            Est. Since Love
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: '#f7ecd0' }}
        >
          Crafting{' '}
          <span style={{ color: '#d4af37' }}>
            Memories
          </span>
          <br />
          <em>That Last Forever</em>
        </h1>

        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-px w-24 bg-gold-400/50" />
          <span style={{ color: '#d4af37', fontSize: '1.25rem' }}>✦</span>
          <div className="h-px w-24 bg-gold-400/50" />
        </div>

        <p
          className="text-base md:text-xl text-white/70 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
        >
          From intimate gatherings to grand celebrations — we orchestrate every
          detail with elegance, passion, and an auspicious touch.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            to="services"
            smooth
            duration={600}
            offset={-80}
            className="cursor-pointer px-8 md:px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #b8960c)',
              color: '#2a0000',
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Our Services
          </Link>
          <a
            href="https://www.instagram.com/shubhasparshanp/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 md:px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold border border-gold-400/60 text-gold-400 hover:bg-gold-400/10 transition-all duration-300"
            style={{ fontFamily: "'Lato', sans-serif" }}
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center gap-2 text-gold-400/60 hover:text-gold-400 transition-colors"
      >
        <span className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'Lato', sans-serif" }}>Scroll</span>
        <FiArrowDown className="animate-bounce" />
      </Link>
    </section>
  )
}
