import { useEffect, useState } from 'react'
import { FiInstagram, FiImage, FiMail } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { useSiteConfig } from '../contexts/SiteConfigContext'

// Masonry tile sizes — cycled by index so heroes appear large and fillers small.
// grid-auto-flow: dense backfills any gaps the varied spans create.
const TILE_PATTERN = ['big', 'sm', 'sm', 'tall', 'sm', 'wide', 'sm', 'tall', 'sm', 'sm', 'wide', 'big', 'sm', 'sm']
const tileClass = (i) => `g-${TILE_PATTERN[i % TILE_PATTERN.length]}`

const GALLERY_CSS = `
  .g-masonry {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 150px;
    grid-auto-flow: dense;
    gap: 12px;
  }
  .g-tile {
    position: relative; overflow: hidden; display: block; width: 100%; height: 100%;
    padding: 0; margin: 0; border: none; background: none; cursor: pointer; font: inherit;
  }
  .g-big { grid-column: span 2; grid-row: span 2; }
  .g-tall { grid-row: span 2; }
  .g-wide { grid-column: span 2; }
  @media (min-width: 768px) {
    .g-masonry { grid-template-columns: repeat(4, 1fr); grid-auto-rows: 180px; gap: 16px; }
  }
`

export default function Gallery() {
  const { config } = useSiteConfig()
  const { colors, contactInfo, gallerySection, galleryCategories = [] } = config
  const categories = ['All', ...galleryCategories]
  const pageSize = Math.max(1, Number(gallerySection.pageSize) || 12)
  const lt = colors.lightText || '#f7ecd0'
  const [images, setImages] = useState([])
  const [filter, setFilter] = useState('All')
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [lastFilter, setLastFilter] = useState(filter)

  useEffect(() => {
    fetchImages()

    const channel = supabase
      .channel('gallery-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, fetchImages)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Reset to the first page whenever the category filter changes — adjusted
  // during render (React's recommended pattern) rather than in an effect,
  // so it doesn't cause an extra render pass.
  if (filter !== lastFilter) {
    setLastFilter(filter)
    setVisibleCount(pageSize)
  }

  async function fetchImages() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setImages(data)
  }

  const filtered = filter === 'All' ? images : images.filter((img) => img.category === filter)
  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount
  const placeholderCount = Math.max(0, 6 - visible.length)

  function planLikeThis(img) {
    window.dispatchEvent(new CustomEvent('prefill-contact', { detail: { type: img.category, name: img.title || img.category } }))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="gallery" className="py-16 md:py-28" style={{ background: colors.maroon }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
          >
            {gallerySection.label}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: lt }}
          >
            {gallerySection.title} <em style={{ color: colors.gold }}>{gallerySection.titleAccent}</em>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16" style={{ background: colors.gold }} />
            <span style={{ color: colors.gold }}>✦</span>
            <div className="h-px w-16" style={{ background: colors.gold }} />
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
                  background: filter === cat ? colors.gold : 'transparent',
                  color: filter === cat ? colors.maroon : colors.gold,
                  border: `1px solid ${colors.gold}`,
                  fontWeight: filter === cat ? 700 : 400,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry mosaic */}
        <style>{GALLERY_CSS}</style>
        <div className="g-masonry mb-12">
          {visible.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => planLikeThis(img)}
              aria-label={`Enquire about a ${img.category} event like "${img.title || img.category}"`}
              className={`g-tile group text-left ${tileClass(i)}`}
            >
              <img
                src={img.image_url}
                alt={img.title || 'Event photo'}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover caption */}
              <div
                className="absolute inset-x-0 bottom-0 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to top, ${colors.maroon}e6, transparent)`, minHeight: '50%' }}
              >
                <p
                  className="text-[10px] tracking-[0.2em] uppercase mb-0.5"
                  style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
                >
                  {img.category}
                </p>
                {img.title && (
                  <p className="text-sm leading-tight" style={{ color: lt, fontFamily: "'Lato', sans-serif" }}>
                    {img.title}
                  </p>
                )}
              </div>
              {/* Enquire badge */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FiMail className="text-lg" style={{ color: colors.gold }} />
              </div>
            </button>
          ))}

          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className={`g-tile flex items-center justify-center ${tileClass(visible.length + i)}`}
              style={{ background: `${colors.maroon500}66` }}
            >
              <FiImage className="text-4xl opacity-20" style={{ color: colors.gold }} />
            </div>
          ))}
        </div>

        {/* Show more */}
        {hasMore && (
          <div className="text-center mb-12">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + pageSize)}
              className="px-10 py-3.5 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300"
              style={{
                background: colors.gold,
                color: colors.maroon,
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Show More Photos
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <a
            href={contactInfo.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold border transition-all duration-300 hover:gap-5"
            style={{
              borderColor: colors.gold,
              color: colors.gold,
              fontFamily: "'Lato', sans-serif",
            }}
          >
            <FiInstagram />
            {gallerySection.instagramButton}
          </a>
        </div>
      </div>
    </section>
  )
}
