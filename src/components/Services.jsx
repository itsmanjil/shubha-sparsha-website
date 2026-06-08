const services = [
  {
    emoji: '💍',
    title: 'Wedding Planning',
    subtitle: 'Complete Wedding Management',
    desc: 'From engagement to reception — we handle every detail so you can be fully present in every precious moment.',
    tags: ['Venue Selection', 'Decor & Florals', 'Catering', 'Photography'],
  },
  {
    emoji: '🎂',
    title: 'Birthday Celebrations',
    subtitle: 'Milestone Birthday Parties',
    desc: 'Elegant, themed birthday events that reflect your personality — from intimate dinners to lavish soirées.',
    tags: ['Theme Design', 'Entertainment', 'Custom Cakes', 'Guest Management'],
  },
  {
    emoji: '🏛️',
    title: 'Corporate Events',
    subtitle: 'Professional Event Management',
    desc: 'Conferences, product launches, award nights — executed with precision, professionalism, and style.',
    tags: ['AV Setup', 'Branding', 'Hospitality', 'Logistics'],
  },
  {
    emoji: '🪔',
    title: 'Religious Ceremonies',
    subtitle: 'Pujas & Auspicious Occasions',
    desc: 'Authentic traditional ceremonies planned with reverence — havan, puja, naming ceremonies, and more.',
    tags: ['Pandit Arrangement', 'Samagri', 'Mandap Setup', 'Prasad'],
  },
  {
    emoji: '🌸',
    title: 'Engagement Ceremonies',
    subtitle: 'Roka, Sagai & Ring Ceremonies',
    desc: 'Set the perfect tone for your love story with a beautifully orchestrated engagement celebration.',
    tags: ['Ring Exchange Setup', 'Family Coordination', 'Decor', 'Mehendi'],
  },
  {
    emoji: '✨',
    title: 'Social Gatherings',
    subtitle: 'House Warmings & Anniversaries',
    desc: 'Every occasion is worth celebrating beautifully — griha pravesh, anniversaries, baby showers, and more.',
    tags: ['Custom Themes', 'Invitations', 'Decor', 'Catering'],
  },
]

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-28" style={{ background: '#fdf8ee' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
          >
            What We Do
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2a0000' }}
          >
            Our <em style={{ color: '#800000' }}>Services</em>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16" style={{ background: '#d4af37' }} />
            <span style={{ color: '#d4af37' }}>✦</span>
            <div className="h-px w-16" style={{ background: '#d4af37' }} />
          </div>
          <p
            className="text-gray-600 max-w-xl mx-auto text-lg"
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
          >
            Comprehensive event planning services tailored to your vision and traditions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative overflow-hidden border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
              style={{ borderColor: '#d4af37/30', background: '#fffdf5' }}
            >
              {/* Gold top accent */}
              <div
                className="h-1 w-full group-hover:w-full transition-all duration-500"
                style={{ background: 'linear-gradient(90deg, #d4af37, #b8960c)' }}
              />

              <div className="p-5 md:p-8">
                <div className="text-4xl mb-5">{s.emoji}</div>

                <p
                  className="text-xs tracking-[0.3em] uppercase mb-2"
                  style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
                >
                  {s.subtitle}
                </p>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2a0000' }}
                >
                  {s.title}
                </h3>
                <p
                  className="leading-relaxed mb-6"
                  style={{ color: '#5c4604', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                >
                  {s.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
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
