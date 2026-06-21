import { useSiteConfig } from '../contexts/SiteConfigContext'

export default function Portfolio() {
  const { config } = useSiteConfig()
  const { colors, portfolio = [], portfolioSection } = config
  const dt = colors.darkText || '#5c4604'

  if (!portfolio.length) return null

  function planLikeThis(entry) {
    window.dispatchEvent(new CustomEvent('prefill-contact', { detail: { type: entry.type, name: entry.name } }))
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="portfolio" className="py-16 md:py-28" style={{ background: colors.cream }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
          >
            {portfolioSection.label}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: colors.maroon }}
          >
            {portfolioSection.title} <em style={{ color: colors.maroon500 }}>{portfolioSection.titleAccent}</em>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: colors.gold }} />
            <span style={{ color: colors.gold }}>✦</span>
            <div className="h-px w-16" style={{ background: colors.gold }} />
          </div>
          {portfolioSection.desc && (
            <p
              className="max-w-xl mx-auto text-lg"
              style={{ color: dt, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            >
              {portfolioSection.desc}
            </p>
          )}
        </div>

        {/* Alternating editorial rows */}
        <div className="space-y-14 md:space-y-24">
          {portfolio.map((entry, i) => (
            <div key={i} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Cover image */}
              <div className={`relative ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                {entry.coverImage ? (
                  <img
                    src={entry.coverImage}
                    alt={entry.name}
                    className="w-full aspect-[4/3] object-cover"
                  />
                ) : (
                  <div
                    className="w-full aspect-[4/3] flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${colors.maroon}, ${colors.maroon500})` }}
                  >
                    <span className="text-5xl" style={{ opacity: 0.35 }}>📸</span>
                  </div>
                )}
                {/* Gold offset frame */}
                <div
                  className="absolute -bottom-3 -right-3 w-full h-full border-2 -z-10 hidden sm:block"
                  style={{ borderColor: colors.gold }}
                />
              </div>

              {/* Story */}
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                {entry.type && (
                  <span
                    className="inline-block text-xs px-3 py-1 tracking-[0.2em] uppercase mb-4"
                    style={{ background: '#f7ecd0', color: '#7a5f06', fontFamily: "'Lato', sans-serif", fontWeight: 700 }}
                  >
                    {entry.type}
                  </span>
                )}
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: colors.maroon }}
                >
                  {entry.name}
                </h3>
                <p
                  className="leading-relaxed mb-7"
                  style={{ color: dt, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                >
                  {entry.description}
                </p>
                <button
                  onClick={() => planLikeThis(entry)}
                  className="inline-flex items-center gap-3 px-8 py-3.5 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:gap-5"
                  style={{ background: `linear-gradient(135deg, ${colors.gold}, #b8960c)`, color: colors.maroon, fontFamily: "'Lato', sans-serif" }}
                >
                  Plan an event like this →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
