import { useSiteConfig } from '../contexts/SiteConfigContext'

export default function Services() {
  const { config } = useSiteConfig()
  const { colors, services, servicesSection } = config
  const dt = colors.darkText || '#5c4604'

  return (
    <section id="services" className="py-16 md:py-28" style={{ background: colors.cream }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
          >
            {servicesSection.label}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: colors.maroon }}
          >
            {servicesSection.title} <em style={{ color: colors.maroon500 }}>{servicesSection.titleAccent}</em>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: colors.gold }} />
            <span style={{ color: colors.gold }}>✦</span>
            <div className="h-px w-16" style={{ background: colors.gold }} />
          </div>
          <p
            className="text-gray-600 max-w-xl mx-auto text-lg"
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
          >
            {servicesSection.desc}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="group relative overflow-hidden border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
              style={{ borderColor: `${colors.gold}4D`, background: colors.cream }}
            >
              {/* Gold top accent */}
              <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(90deg, ${colors.gold}, #b8960c)` }}
              />

              <div className="p-5 md:p-8">
                <div className="text-4xl mb-5">{s.emoji}</div>

                <p
                  className="text-xs tracking-[0.3em] uppercase mb-2"
                  style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
                >
                  {s.subtitle}
                </p>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: colors.maroon }}
                >
                  {s.title}
                </h3>
                <p
                  className="leading-relaxed mb-6"
                  style={{ color: dt, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                >
                  {s.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(s.tags) ? s.tags : String(s.tags || '').split(',').map(t => t.trim())).filter(Boolean).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 tracking-wide"
                      style={{
                        background: '#f7ecd0',
                        color: '#7a5f06',
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
