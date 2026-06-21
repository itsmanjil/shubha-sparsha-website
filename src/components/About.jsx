import { Link } from 'react-scroll'
import { useSiteConfig } from '../contexts/SiteConfigContext'
import { darken } from '../lib/color'

export default function About() {
  const { config } = useSiteConfig()
  const { colors, about, stats } = config
  const dt = colors.darkText || '#5c4604'
  const lt = colors.lightText || '#f7ecd0'
  const eyebrow = darken(colors.gold, 35)

  return (
    <section id="about" className="py-16 md:py-28" style={{ background: colors.cream }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: eyebrow, fontFamily: "'Lato', sans-serif", fontWeight: 700 }}
          >
            {about.subheading}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: colors.maroon }}
          >
            {about.heading}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: colors.gold }} />
            <span style={{ color: colors.gold }}>✦</span>
            <div className="h-px w-16" style={{ background: colors.gold }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 md:mb-20">
          {/* Image */}
          <div className="relative">
            {about.imageUrl ? (
              <img
                src={about.imageUrl}
                alt="About Shubha Sparsha"
                className="w-full aspect-[4/5] object-cover"
              />
            ) : (
              <div
                className="aspect-[4/5] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, #f7ecd0, #edd99a)` }}
              >
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🌸</div>
                  <p
                    className="text-sm tracking-[0.2em] uppercase"
                    style={{ color: '#7a5f06', fontFamily: "'Lato', sans-serif" }}
                  >
                    Add your photo in admin
                  </p>
                </div>
              </div>
            )}
            {/* Gold accent border */}
            <div
              className="absolute -bottom-4 -right-4 w-full h-full border-2 -z-10 hidden sm:block"
              style={{ borderColor: colors.gold }}
            />
          </div>

          {/* Text */}
          <div>
            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: dt, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            >
              {about.paragraph1}
            </p>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: dt, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            >
              {about.paragraph2}
            </p>
            <Link
              to="contact"
              smooth
              duration={600}
              offset={-80}
              className="cursor-pointer inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:gap-5"
              style={{ color: colors.maroon500, fontFamily: "'Lato', sans-serif" }}
            >
              {about.followLinkText}
              <span
                className="h-px w-12 inline-block transition-all duration-300"
                style={{ background: colors.maroon500 }}
              />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ background: colors.gold }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center py-8 px-3 md:py-10 md:px-6"
              style={{ background: colors.maroon }}
            >
              <p
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: colors.gold }}
              >
                {s.value}
              </p>
              <p
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: `${lt}b3`, fontFamily: "'Lato', sans-serif" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
