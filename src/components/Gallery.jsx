import { useEffect, useState } from 'react'
import { FiInstagram, FiExternalLink, FiImage } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const categories = ['All', 'Weddings', 'Birthdays', 'Corporate', 'Ceremonies']

export default function Gallery() {
  const [images, setImages] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchImages()

    const channel = supabase
      .channel('gallery-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, fetchImages)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchImages() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setImages(data)
  }

  const filtered = filter === 'All' ? images : images.filter((img) => img.category === filter)
  const placeholderCount = Math.max(0, 6 - filtered.length)

  return (
    <section id="gallery" className="py-28" style={{ background: '#2a0000' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
          >
            Our Work
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: '#f7ecd0' }}
          >
            Event <em style={{ color: '#d4af37' }}>Portfolio</em>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16" style={{ background: '#d4af37' }} />
            <span style={{ color: '#d4af37' }}>✦</span>
            <div className="h-px w-16" style={{ background: '#d4af37' }} />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  background: filter === cat ? '#d4af37' : 'transparent',
                  color: filter === cat ? '#2a0000' : '#d4af37',
                  border: '1px solid #d4af37',
                  fontWeight: filter === cat ? 700 : 400,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {filtered.map((img) => (
            <a
              key={img.id}
              href="https://www.instagram.com/shubhasparshanp/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={img.image_url}
                alt={img.title || 'Event photo'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'rgba(42,0,0,0.7)' }}
              >
                <FiExternalLink className="text-3xl" style={{ color: '#d4af37' }} />
              </div>
            </a>
          ))}

          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className="aspect-square flex items-center justify-center"
              style={{ background: i % 2 === 0 ? '#3d0000' : '#400000' }}
            >
              <FiImage className="text-4xl opacity-20" style={{ color: '#d4af37' }} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://www.instagram.com/shubhasparshanp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold border transition-all duration-300 hover:gap-5"
            style={{
              borderColor: '#d4af37',
              color: '#d4af37',
              fontFamily: "'Lato', sans-serif",
            }}
          >
            <FiInstagram />
            View Full Portfolio on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
