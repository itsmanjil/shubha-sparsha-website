const stats = [
  { value: '200+', label: 'Events Planned' },
  { value: '8+', label: 'Years of Experience' },
  { value: '500+', label: 'Happy Families' },
  { value: '100%', label: 'Client Satisfaction' },
]

export default function About() {
  return (
    <section id="about" className="py-16 md:py-28" style={{ background: '#fffdf5' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
          >
            Our Story
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2a0000' }}
          >
            Where Tradition Meets{' '}
            <em style={{ color: '#d4af37' }}>Elegance</em>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: '#d4af37' }} />
            <span style={{ color: '#d4af37' }}>✦</span>
            <div className="h-px w-16" style={{ background: '#d4af37' }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 md:mb-20">
          {/* Image placeholder — replace with real photo */}
          <div className="relative">
            <div
              className="aspect-[4/5] rounded-none flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f7ecd0, #edd99a)' }}
            >
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🌸</div>
                <p
                  className="text-sm tracking-[0.2em] uppercase"
                  style={{ color: '#7a5f06', fontFamily: "'Lato', sans-serif" }}
                >
                  Add your photo here
                </p>
              </div>
            </div>
            {/* Gold accent border */}
            <div
              className="absolute -bottom-4 -right-4 w-full h-full border-2 -z-10 hidden sm:block"
              style={{ borderColor: '#d4af37' }}
            />
          </div>

          {/* Text */}
          <div>
            <p
              className="text-lg leading-relaxed mb-6"
              style={{ color: '#5c4604', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            >
              <strong
                style={{ fontFamily: "'Playfair Display', serif", color: '#2a0000', fontWeight: 600 }}
              >
                Shubha Sparsha
              </strong>{' '}
              — meaning "auspicious touch" — was founded on the belief that every
              celebration deserves to be extraordinary. We are passionate event planners
              dedicated to turning your vision into reality.
            </p>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: '#5c4604', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            >
              From the grandeur of wedding mandaps to the joy of birthday soirées, we bring
              meticulous attention to detail, creative flair, and genuine care to every event
              we craft. Our team works closely with you to understand your culture, traditions,
              and personal style.
            </p>
            <a
              href="https://www.instagram.com/shubhasparshanp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:gap-5"
              style={{ color: '#800000', fontFamily: "'Lato', sans-serif" }}
            >
              Follow Our Journey
              <span
                className="h-px w-12 inline-block transition-all duration-300"
                style={{ background: '#800000' }}
              />
            </a>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ background: '#d4af37' }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center py-10 px-6"
              style={{ background: '#2a0000' }}
            >
              <p
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: '#d4af37' }}
              >
                {s.value}
              </p>
              <p
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: '#f7ecd0/70', fontFamily: "'Lato', sans-serif" }}
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
