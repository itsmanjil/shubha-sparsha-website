import { useSiteConfig } from '../contexts/SiteConfigContext'

export default function Process() {
  const { config } = useSiteConfig()
  const { colors, processSection, processSteps = [] } = config
  const lt = colors.lightText || '#f7ecd0'

  if (!processSteps.length) return null

  return (
    <section id="process" className="py-16 md:py-28" style={{ background: colors.maroon }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
          >
            {processSection.label}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: lt }}
          >
            {processSection.title} <em style={{ color: colors.gold }}>{processSection.titleAccent}</em>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: colors.gold }} />
            <span style={{ color: colors.gold }}>✦</span>
            <div className="h-px w-16" style={{ background: colors.gold }} />
          </div>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {processSteps.map((step, i) => (
            <div key={i} className="relative text-center">
              <p
                className="text-5xl md:text-6xl font-bold mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: `${colors.gold}33` }}
              >
                {step.number}
              </p>
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: colors.gold }}
              >
                {step.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: `${lt}b3`, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              >
                {step.desc}
              </p>

              {/* Connector line (desktop only, not after last) */}
              {i < processSteps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-7 -right-3 w-6 h-px"
                  style={{ background: `${colors.gold}50` }}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
