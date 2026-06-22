import { useSiteConfig } from '../contexts/SiteConfigContext'

export default function Testimonials() {
  const { config } = useSiteConfig()
  const { colors, testimonials = [], testimonialsSection } = config
  const dt = colors.darkText || '#5c4604'
  const lt = colors.lightText || '#f7ecd0'

  if (!testimonials.length) return null

  return (
    <section id="testimonials" className="py-16 md:py-28" style={{ background: colors.maroon }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
          >
            {testimonialsSection.label}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: lt }}
          >
            {testimonialsSection.title} <em style={{ color: colors.gold }}>{testimonialsSection.titleAccent}</em>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: colors.gold }} />
            <span style={{ color: colors.gold }}>✦</span>
            <div className="h-px w-16" style={{ background: colors.gold }} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative p-7 md:p-8 border flex flex-col"
              style={{ borderColor: `${colors.gold}4D`, background: 'white' }}
            >
              <span
                className="block text-5xl leading-none mb-3"
                style={{ color: colors.gold, fontFamily: "'Playfair Display', serif" }}
                aria-hidden="true"
              >
                “
              </span>
              <p
                className="leading-relaxed mb-6 flex-1"
                style={{ color: dt, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              >
                {t.quote}
              </p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${colors.gold}26` }}>
                {t.photoUrl ? (
                  <img src={t.photoUrl} alt="" loading="lazy" decoding="async" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${colors.maroon}, ${colors.maroon500})`, color: colors.gold, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                  >
                    {t.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
                <div className="min-w-0">
                  <p
                    className="text-sm font-bold truncate"
                    style={{ color: colors.maroon, fontFamily: "'Lato', sans-serif" }}
                  >
                    {t.name}
                  </p>
                  {t.eventType && (
                    <p
                      className="text-xs tracking-wide uppercase"
                      style={{ color: '#7a5f06', fontFamily: "'Lato', sans-serif" }}
                    >
                      {t.eventType}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
