import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSiteConfig } from '../contexts/SiteConfigContext'

const TABS = ['Colors', 'Navbar', 'Hero', 'About', 'Stats', 'Services', 'Gallery Section', 'Contact', 'Footer', 'Gallery']
const GALLERY_CATEGORIES = ['Weddings', 'Birthdays', 'Corporate', 'Ceremonies']

const ADMIN_CSS = `
  @keyframes spin { to { transform: rotate(360deg) } }
  .admin-layout { display: flex; min-height: calc(100vh - 56px); }
  .admin-sidebar {
    width: 190px; background: white; border-right: 1px solid #e5e7eb;
    flex-shrink: 0; padding-top: 1rem;
  }
  .admin-main { flex: 1; padding: 2rem; overflow-y: auto; min-width: 0; }
  .admin-section { background: white; padding: 2rem; max-width: 820px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .admin-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .admin-grid-stat { display: grid; grid-template-columns: 140px 1fr; gap: 1rem; margin-bottom: 1rem; align-items: start; }
  .admin-grid-service { display: grid; grid-template-columns: 70px 1fr 1fr; gap: 1rem; }
  @media (max-width: 767px) {
    .admin-layout { flex-direction: column; }
    .admin-sidebar {
      width: 100% !important; padding-top: 0 !important;
      border-right: none !important; border-bottom: 1px solid #e5e7eb;
      display: flex !important; overflow-x: auto; -webkit-overflow-scrolling: touch;
    }
    .admin-sidebar button {
      flex-shrink: 0 !important; text-align: center !important;
      padding: 0.75rem 1rem !important; white-space: nowrap !important;
      border-left: 3px solid transparent !important;
      border-bottom: 3px solid transparent !important;
    }
    .admin-sidebar button.active-tab {
      border-left: 3px solid transparent !important;
      border-bottom: 3px solid #d4af37 !important;
    }
    .admin-main { padding: 1rem !important; }
    .admin-section { padding: 1.25rem !important; }
    .admin-grid-2 { grid-template-columns: 1fr !important; }
    .admin-grid-stat { grid-template-columns: 1fr !important; }
    .admin-grid-service { grid-template-columns: 1fr !important; }
    .admin-header-subtitle { display: none !important; }
  }
`

const labelStyle = {
  display: 'block',
  fontSize: '0.65rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#6b7280',
  fontFamily: "'Lato', sans-serif",
  marginBottom: '0.5rem',
  fontWeight: 600,
}

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid #e5e7eb',
  fontFamily: "'Lato', sans-serif",
  fontSize: '0.9rem',
  color: '#1f2937',
  outline: 'none',
  boxSizing: 'border-box',
  background: 'white',
}

function Field({ label, value, onChange, multiline }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  )
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: '2.75rem', height: '2.75rem', border: '1px solid #e5e7eb', cursor: 'pointer', padding: '2px', background: 'white' }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}
        />
      </div>
      <div style={{ height: '6px', background: value, borderRadius: '2px' }} />
    </div>
  )
}

function Section({ title, children, onSave, saving }) {
  return (
    <div className="admin-section">
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2a0000', marginTop: 0, marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '2px solid #f3f4f6' }}>
        {title}
      </h2>
      {children}
      <button
        onClick={onSave}
        disabled={saving}
        style={{
          marginTop: '1.75rem',
          padding: '0.75rem 2rem',
          background: saving ? '#c9a832' : 'linear-gradient(135deg, #d4af37, #b8960c)',
          color: '#2a0000',
          fontFamily: "'Lato', sans-serif",
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 700,
          border: 'none',
          cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { config, saveConfig } = useSiteConfig()
  const [activeTab, setActiveTab] = useState('Colors')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const [logoUploading, setLogoUploading] = useState(false)
  const [logoDrag, setLogoDrag] = useState(false)

  const [heroSlides, setHeroSlides] = useState(config.heroSlides || [])
  const [heroSlideUploading, setHeroSlideUploading] = useState(false)
  const [heroSlideDrag, setHeroSlideDrag] = useState(false)

  const [galleryImages, setGalleryImages] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [newPhoto, setNewPhoto] = useState({ title: '', category: 'Weddings', file: null, preview: null })
  const [dragOver, setDragOver] = useState(false)

  const [colors, setColors] = useState({ ...config.colors })
  const [navbar, setNavbar] = useState({ ...config.navbar })
  const [hero, setHero] = useState({ ...config.hero })
  const [about, setAbout] = useState({ ...config.about })
  const [stats, setStats] = useState(config.stats.map(s => ({ ...s })))
  const [servicesSection, setServicesSection] = useState({ ...config.servicesSection })
  const [services, setServices] = useState(
    config.services.map(s => ({ ...s, tags: Array.isArray(s.tags) ? s.tags.join(', ') : s.tags }))
  )
  const [gallerySection, setGallerySection] = useState({ ...config.gallerySection })
  const [contactSection, setContactSection] = useState({ ...config.contactSection })
  const [contactInfo, setContactInfo] = useState({ ...config.contactInfo })
  const [footer, setFooter] = useState({ ...config.footer })

  async function doSave(key, value) {
    setSaving(true)
    try {
      await saveConfig(key, value)
      setSavedMsg('Saved successfully!')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (e) {
      setSavedMsg('Error: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  async function uploadLogo(file) {
    setLogoUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `logo/logo.${ext}`
      const { error: uploadErr } = await supabase.storage.from('site-images').upload(path, file, { upsert: true })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
      const updated = { ...navbar, logoUrl: publicUrl }
      setNavbar(updated)
      await saveConfig('navbar', updated)
      setSavedMsg('Logo updated!')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (e) {
      setSavedMsg('Error: ' + e.message)
    } finally {
      setLogoUploading(false)
    }
  }

  async function removeLogo() {
    const updated = { ...navbar, logoUrl: '' }
    setNavbar(updated)
    await saveConfig('navbar', updated)
  }

  async function uploadHeroSlide(file) {
    setHeroSlideUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `hero/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('site-images').upload(path, file)
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
      const updated = [...heroSlides, publicUrl]
      setHeroSlides(updated)
      await saveConfig('heroSlides', updated)
      setSavedMsg('Slide added!')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (e) {
      setSavedMsg('Error: ' + e.message)
    } finally {
      setHeroSlideUploading(false)
    }
  }

  async function deleteHeroSlide(index) {
    const url = heroSlides[index]
    const pathMatch = url.match(/site-images\/(.+)$/)
    if (pathMatch) await supabase.storage.from('site-images').remove([pathMatch[1]])
    const updated = heroSlides.filter((_, i) => i !== index)
    setHeroSlides(updated)
    await saveConfig('heroSlides', updated)
    setSavedMsg('Slide removed!')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  async function uploadAboutImage(file) {
    setUploadingImage(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `about-image.${ext}`
      const { error: uploadErr } = await supabase.storage.from('site-images').upload(path, file, { upsert: true })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
      const updated = { ...about, imageUrl: publicUrl }
      setAbout(updated)
      await doSave('about', updated)
    } catch (e) {
      alert('Image upload failed: ' + e.message)
    } finally {
      setUploadingImage(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'Gallery') fetchGallery()
  }, [activeTab])

  async function fetchGallery() {
    setGalleryLoading(true)
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (data) setGalleryImages(data)
    setGalleryLoading(false)
  }

  async function uploadGalleryPhoto() {
    if (!newPhoto.file) return
    setGalleryUploading(true)
    try {
      const ext = newPhoto.file.name.split('.').pop()
      const path = `gallery/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('site-images').upload(path, newPhoto.file)
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
      const { error: dbErr } = await supabase.from('gallery').insert([{
        title: newPhoto.title || null,
        image_url: publicUrl,
        category: newPhoto.category,
      }])
      if (dbErr) throw dbErr
      setNewPhoto({ title: '', category: 'Weddings', file: null, preview: null })
      await fetchGallery()
      setSavedMsg('Photo uploaded!')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (e) {
      setSavedMsg('Error: ' + e.message)
    } finally {
      setGalleryUploading(false)
    }
  }

  async function deleteGalleryPhoto(img) {
    if (!confirm(`Delete "${img.title || 'this photo'}"?`)) return
    const pathMatch = img.image_url.match(/site-images\/(.+)$/)
    if (pathMatch) await supabase.storage.from('site-images').remove([pathMatch[1]])
    await supabase.from('gallery').delete().eq('id', img.id)
    setGalleryImages(prev => prev.filter(i => i.id !== img.id))
  }

  function saveServices() {
    const parsed = services.map(s => ({
      ...s,
      tags: typeof s.tags === 'string'
        ? s.tags.split(',').map(t => t.trim()).filter(Boolean)
        : s.tags,
    }))
    doSave('services', parsed)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: "'Lato', sans-serif" }}>
      <style>{ADMIN_CSS}</style>

      {/* Header */}
      <header style={{ background: '#2a0000', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', minWidth: 0 }}>
          <span style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, flexShrink: 0 }}>
            Shubha Sparsha
          </span>
          <span className="admin-header-subtitle" style={{ color: 'rgba(247,236,208,0.4)', fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            Admin
          </span>
        </div>
        <button
          onClick={handleSignOut}
          style={{ padding: '0.45rem 1rem', border: '1px solid rgba(212,175,55,0.4)', color: 'rgba(212,175,55,0.85)', background: 'transparent', fontSize: '0.72rem', letterSpacing: '0.15em', cursor: 'pointer', flexShrink: 0 }}
        >
          Sign Out
        </button>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'active-tab' : ''}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.8rem 1.25rem',
                fontFamily: "'Lato', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: 'none',
                borderLeft: activeTab === tab ? '3px solid #d4af37' : '3px solid transparent',
                cursor: 'pointer',
                background: activeTab === tab ? '#fffdf5' : 'transparent',
                color: activeTab === tab ? '#2a0000' : '#9ca3af',
                fontWeight: activeTab === tab ? 700 : 400,
              }}
            >
              {tab}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="admin-main">
          {savedMsg && (
            <div style={{
              marginBottom: '1.25rem',
              padding: '0.75rem 1rem',
              background: savedMsg.startsWith('Error') ? '#fee2e2' : '#dcfce7',
              border: `1px solid ${savedMsg.startsWith('Error') ? '#fca5a5' : '#86efac'}`,
              color: savedMsg.startsWith('Error') ? '#991b1b' : '#166534',
              fontSize: '0.85rem',
            }}>
              {savedMsg}
            </div>
          )}

          {/* COLORS */}
          {activeTab === 'Colors' && (
            <Section title="Brand Colors" onSave={() => doSave('colors', colors)} saving={saving}>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                These four colors drive the entire site's look. Changing them updates headers, buttons, accents, and section backgrounds.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.75rem' }}>
                <ColorPicker label="Dark Maroon (backgrounds)" value={colors.maroon} onChange={v => setColors(p => ({ ...p, maroon: v }))} />
                <ColorPicker label="Medium Maroon (accents)" value={colors.maroon500} onChange={v => setColors(p => ({ ...p, maroon500: v }))} />
                <ColorPicker label="Gold (primary accent)" value={colors.gold} onChange={v => setColors(p => ({ ...p, gold: v }))} />
                <ColorPicker label="Cream (section backgrounds)" value={colors.cream} onChange={v => setColors(p => ({ ...p, cream: v }))} />
              </div>
            </Section>
          )}

          {/* NAVBAR */}
          {activeTab === 'Navbar' && (
            <>
            <Section title="Navigation Bar" onSave={() => doSave('navbar', navbar)} saving={saving}>
              <Field label="Brand name" value={navbar.brandName} onChange={v => setNavbar(p => ({ ...p, brandName: v }))} />
              <Field label="Brand subtitle (below name)" value={navbar.brandSubtitle} onChange={v => setNavbar(p => ({ ...p, brandSubtitle: v }))} />
              <Field label="CTA button text" value={navbar.ctaButton} onChange={v => setNavbar(p => ({ ...p, ctaButton: v }))} />
              <Field label="Browser tab title" value={navbar.pageTitle} onChange={v => setNavbar(p => ({ ...p, pageTitle: v }))} />
            </Section>

            {/* Logo upload */}
            <div className="admin-section" style={{ marginTop: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2a0000', marginTop: 0, marginBottom: '0.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f3f4f6' }}>
                Logo
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', fontFamily: "'Lato', sans-serif", lineHeight: 1.6 }}>
                Shown in the navbar next to the brand name, and used as the browser tab favicon. PNG with transparent background recommended.
              </p>

              {navbar.logoUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', border: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                  <img src={navbar.logoUrl} alt="Logo" style={{ height: '64px', width: '64px', objectFit: 'contain', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <p style={{ fontSize: '0.78rem', color: '#374151', fontFamily: "'Lato', sans-serif", margin: '0 0 0.5rem' }}>Current logo</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => document.getElementById('logo-input').click()}
                        style={{ padding: '0.35rem 0.9rem', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#2a0000', border: 'none', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}
                      >Replace</button>
                      <button
                        onClick={removeLogo}
                        style={{ padding: '0.35rem 0.9rem', background: 'transparent', color: '#9ca3af', border: '1px solid #e5e7eb', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}
                      >Remove</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', background: '#2a0000', borderRadius: '4px' }}>
                    <img src={navbar.logoUrl} alt="" style={{ height: '28px', width: '28px', objectFit: 'contain', borderRadius: '2px' }} />
                    <div>
                      <p style={{ color: '#d4af37', fontSize: '0.7rem', fontFamily: "'Playfair Display', serif", margin: 0, fontWeight: 700 }}>{navbar.brandName}</p>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Lato', sans-serif", margin: 0 }}>{navbar.brandSubtitle}</p>
                    </div>
                  </div>
                </div>
              )}

              <input
                id="logo-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files[0]; if (f) uploadLogo(f); e.target.value = '' }}
              />
              {!navbar.logoUrl && (
                <div
                  onClick={() => !logoUploading && document.getElementById('logo-input').click()}
                  onDragOver={e => { e.preventDefault(); setLogoDrag(true) }}
                  onDragLeave={() => setLogoDrag(false)}
                  onDrop={e => { e.preventDefault(); setLogoDrag(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) uploadLogo(f) }}
                  style={{
                    border: `2px dashed ${logoDrag ? '#d4af37' : '#e5e7eb'}`,
                    background: logoDrag ? '#fffdf5' : '#fafafa',
                    borderRadius: '4px',
                    minHeight: '110px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: logoUploading ? 'wait' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {logoUploading ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '18px', height: '18px', border: '2px solid #e5e7eb', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 0.5rem' }} />
                      <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif" }}>Uploading…</p>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}>🏷️</div>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                        {logoDrag ? 'Drop logo here' : 'Drop logo here or click to browse'}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: '#d1d5db', margin: '0.4rem 0 0', fontFamily: "'Lato', sans-serif" }}>
                        PNG (transparent) · SVG · JPG · Recommended: square
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            </>
          )}

          {/* HERO */}
          {activeTab === 'Hero' && (
            <>
            <Section title="Hero Section" onSave={() => doSave('hero', hero)} saving={saving}>
              <Field label="Tagline (small text above title)" value={hero.tagline} onChange={v => setHero(p => ({ ...p, tagline: v }))} />
              <Field label="Title — first word(s)" value={hero.title} onChange={v => setHero(p => ({ ...p, title: v }))} />
              <Field label="Title — gold accent word" value={hero.titleAccent} onChange={v => setHero(p => ({ ...p, titleAccent: v }))} />
              <Field label="Title — italic second line" value={hero.titleItalic} onChange={v => setHero(p => ({ ...p, titleItalic: v }))} />
              <Field label="Subtitle paragraph" value={hero.subtitle} onChange={v => setHero(p => ({ ...p, subtitle: v }))} multiline />
              <Field label="Primary button text" value={hero.servicesButton} onChange={v => setHero(p => ({ ...p, servicesButton: v }))} />
              <Field label="Instagram button text" value={hero.instagramButton} onChange={v => setHero(p => ({ ...p, instagramButton: v }))} />
            </Section>

            <div className="admin-section" style={{ marginTop: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2a0000', marginTop: 0, marginBottom: '0.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f3f4f6' }}>
                Background Slider
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', fontFamily: "'Lato', sans-serif", lineHeight: 1.6 }}>
                Upload photos to replace the default gradient background with a slideshow. The gradient is shown if no images are added.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <label style={labelStyle}>Slide duration (seconds)</label>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={hero.sliderInterval || 5}
                    onChange={e => setHero(p => ({ ...p, sliderInterval: Number(e.target.value) || 5 }))}
                    style={{ ...inputStyle, maxWidth: '120px' }}
                  />
                </div>
                <button
                  onClick={() => doSave('hero', hero)}
                  disabled={saving}
                  style={{ marginTop: '1.4rem', padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#2a0000', fontFamily: "'Lato', sans-serif", fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Save Interval
                </button>
              </div>

              <input
                id="hero-slide-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files[0]; if (f) uploadHeroSlide(f); e.target.value = '' }}
              />
              <div
                onClick={() => !heroSlideUploading && document.getElementById('hero-slide-input').click()}
                onDragOver={e => { e.preventDefault(); setHeroSlideDrag(true) }}
                onDragLeave={() => setHeroSlideDrag(false)}
                onDrop={e => { e.preventDefault(); setHeroSlideDrag(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) uploadHeroSlide(f) }}
                style={{
                  border: `2px dashed ${heroSlideDrag ? '#d4af37' : '#e5e7eb'}`,
                  background: heroSlideDrag ? '#fffdf5' : '#fafafa',
                  borderRadius: '4px',
                  minHeight: '120px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: heroSlideUploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '1.5rem',
                }}
              >
                {heroSlideUploading ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 0.5rem' }} />
                    <p style={{ fontSize: '0.82rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif" }}>Uploading…</p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem', opacity: 0.3 }}>🖼️</div>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                      {heroSlideDrag ? 'Drop to add slide' : 'Drop image here or click to browse'}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#d1d5db', margin: '0.4rem 0 0', fontFamily: "'Lato', sans-serif" }}>
                      JPG, PNG, WEBP · Recommended: 1920×1080 or wider
                    </p>
                  </div>
                )}
              </div>

              {heroSlides.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif" }}>No slides yet — gradient background is active.</p>
              ) : (
                <>
                  <p style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: "'Lato', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    {heroSlides.length} slide{heroSlides.length !== 1 ? 's' : ''} · cycles every {hero.sliderInterval || 5}s
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                    {heroSlides.map((url, i) => (
                      <div key={url} style={{ position: 'relative', border: '1px solid #e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                        <img src={url} alt={`Slide ${i + 1}`} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', top: '0.3rem', left: '0.4rem', background: 'rgba(42,0,0,0.7)', color: '#d4af37', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.4rem', fontFamily: "'Lato', sans-serif" }}>
                          {i + 1}
                        </div>
                        <button
                          onClick={() => deleteHeroSlide(i)}
                          style={{ position: 'absolute', top: '0.3rem', right: '0.3rem', background: 'rgba(0,0,0,0.65)', color: 'white', border: 'none', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}
                          title="Remove slide"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            </>
          )}

          {/* ABOUT */}
          {activeTab === 'About' && (
            <Section title="About Section" onSave={() => doSave('about', about)} saving={saving}>
              <Field label="Subheading (small label)" value={about.subheading} onChange={v => setAbout(p => ({ ...p, subheading: v }))} />
              <Field label="Main heading" value={about.heading} onChange={v => setAbout(p => ({ ...p, heading: v }))} />
              <Field label="Paragraph 1" value={about.paragraph1} onChange={v => setAbout(p => ({ ...p, paragraph1: v }))} multiline />
              <Field label="Paragraph 2" value={about.paragraph2} onChange={v => setAbout(p => ({ ...p, paragraph2: v }))} multiline />
              <Field label="Instagram link text" value={about.followLinkText} onChange={v => setAbout(p => ({ ...p, followLinkText: v }))} />
              <div style={{ marginTop: '0.5rem' }}>
                <label style={labelStyle}>About Image</label>
                {about.imageUrl && (
                  <img src={about.imageUrl} alt="About" style={{ width: '180px', height: '180px', objectFit: 'cover', display: 'block', marginBottom: '0.75rem', border: '1px solid #e5e7eb' }} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files[0] && uploadAboutImage(e.target.files[0])}
                  style={{ fontSize: '0.85rem' }}
                />
                {uploadingImage && <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.82rem' }}>Uploading image…</p>}
                <p style={{ color: '#9ca3af', marginTop: '0.5rem', fontSize: '0.78rem' }}>
                  Uploading a new image saves it immediately. Then click Save Changes to persist the URL.
                </p>
              </div>
            </Section>
          )}

          {/* STATS */}
          {activeTab === 'Stats' && (
            <Section title="Statistics" onSave={() => doSave('stats', stats)} saving={saving}>
              {stats.map((stat, i) => (
                <div key={i} className="admin-grid-stat">
                  <Field
                    label={`Stat ${i + 1} — value`}
                    value={stat.value}
                    onChange={v => setStats(prev => prev.map((s, j) => j === i ? { ...s, value: v } : s))}
                  />
                  <Field
                    label="label"
                    value={stat.label}
                    onChange={v => setStats(prev => prev.map((s, j) => j === i ? { ...s, label: v } : s))}
                  />
                </div>
              ))}
            </Section>
          )}

          {/* SERVICES */}
          {activeTab === 'Services' && (
            <>
            <Section title="Services Section Header" onSave={() => doSave('servicesSection', servicesSection)} saving={saving}>
              <Field label="Section label (small caps above title)" value={servicesSection.label} onChange={v => setServicesSection(p => ({ ...p, label: v }))} />
              <div className="admin-grid-2">
                <Field label="Title — first word(s)" value={servicesSection.title} onChange={v => setServicesSection(p => ({ ...p, title: v }))} />
                <Field label="Title — italic accent word" value={servicesSection.titleAccent} onChange={v => setServicesSection(p => ({ ...p, titleAccent: v }))} />
              </div>
              <Field label="Description paragraph" value={servicesSection.desc} onChange={v => setServicesSection(p => ({ ...p, desc: v }))} multiline />
            </Section>
            <div style={{ marginTop: '1.5rem' }} />
            <Section title="Service Cards" onSave={saveServices} saving={saving}>
              {services.map((svc, i) => (
                <div key={i} style={{ marginBottom: '2rem', padding: '1.25rem', background: '#fafafa', border: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', marginBottom: '1.25rem', fontWeight: 700 }}>
                    Service {i + 1}
                  </p>
                  <div className="admin-grid-service">
                    <Field label="Emoji" value={svc.emoji} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, emoji: v } : s))} />
                    <Field label="Title" value={svc.title} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, title: v } : s))} />
                    <Field label="Subtitle" value={svc.subtitle} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, subtitle: v } : s))} />
                  </div>
                  <Field label="Description" value={svc.desc} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, desc: v } : s))} multiline />
                  <Field label="Tags (comma-separated)" value={svc.tags} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, tags: v } : s))} />
                </div>
              ))}
            </Section>
            </>
          )}

          {/* GALLERY SECTION */}
          {activeTab === 'Gallery Section' && (
            <Section title="Gallery Section Header" onSave={() => doSave('gallerySection', gallerySection)} saving={saving}>
              <Field label="Section label (small caps above title)" value={gallerySection.label} onChange={v => setGallerySection(p => ({ ...p, label: v }))} />
              <div className="admin-grid-2">
                <Field label="Title — first word(s)" value={gallerySection.title} onChange={v => setGallerySection(p => ({ ...p, title: v }))} />
                <Field label="Title — italic accent word" value={gallerySection.titleAccent} onChange={v => setGallerySection(p => ({ ...p, titleAccent: v }))} />
              </div>
              <Field label="Instagram button text" value={gallerySection.instagramButton} onChange={v => setGallerySection(p => ({ ...p, instagramButton: v }))} />
            </Section>
          )}

          {/* CONTACT */}
          {activeTab === 'Contact' && (
            <>
            <Section title="Contact Section Text" onSave={() => doSave('contactSection', contactSection)} saving={saving}>
              <Field label="Section label (small caps above title)" value={contactSection.label} onChange={v => setContactSection(p => ({ ...p, label: v }))} />
              <div className="admin-grid-2">
                <Field label="Title — first word(s)" value={contactSection.title} onChange={v => setContactSection(p => ({ ...p, title: v }))} />
                <Field label="Title — italic accent word" value={contactSection.titleAccent} onChange={v => setContactSection(p => ({ ...p, titleAccent: v }))} />
              </div>
              <Field label="Sidebar heading" value={contactSection.sidebarHeading} onChange={v => setContactSection(p => ({ ...p, sidebarHeading: v }))} />
              <Field label="Sidebar subtitle" value={contactSection.sidebarSubtitle} onChange={v => setContactSection(p => ({ ...p, sidebarSubtitle: v }))} multiline />
              <Field label="Submit button text" value={contactSection.submitButton} onChange={v => setContactSection(p => ({ ...p, submitButton: v }))} />
            </Section>
            <div style={{ marginTop: '1.5rem' }} />
            <Section title="Contact Details" onSave={() => doSave('contactInfo', contactInfo)} saving={saving}>
              <Field label="Phone number" value={contactInfo.phone} onChange={v => setContactInfo(p => ({ ...p, phone: v }))} />
              <Field label="Email address" value={contactInfo.email} onChange={v => setContactInfo(p => ({ ...p, email: v }))} />
              <Field label="Location / Address" value={contactInfo.address} onChange={v => setContactInfo(p => ({ ...p, address: v }))} />
              <Field label="Instagram handle (e.g. @shubhasparshanp)" value={contactInfo.instagramHandle} onChange={v => setContactInfo(p => ({ ...p, instagramHandle: v }))} />
              <Field label="Instagram URL" value={contactInfo.instagramUrl} onChange={v => setContactInfo(p => ({ ...p, instagramUrl: v }))} />
            </Section>
            </>
          )}

          {/* FOOTER */}
          {activeTab === 'Footer' && (
            <Section title="Footer" onSave={() => doSave('footer', footer)} saving={saving}>
              <Field label="Brand name" value={footer.brandName} onChange={v => setFooter(p => ({ ...p, brandName: v }))} />
              <Field label="Brand subtitle" value={footer.brandSubtitle} onChange={v => setFooter(p => ({ ...p, brandSubtitle: v }))} />
              <Field label="Brand tagline (description)" value={footer.tagline} onChange={v => setFooter(p => ({ ...p, tagline: v }))} multiline />
              <Field label="Copyright text (year added automatically)" value={footer.copyright} onChange={v => setFooter(p => ({ ...p, copyright: v }))} />
              <Field label="Bottom bar text (right side)" value={footer.bottomText} onChange={v => setFooter(p => ({ ...p, bottomText: v }))} />
            </Section>
          )}

          {/* GALLERY */}
          {activeTab === 'Gallery' && (
            <div style={{ maxWidth: '820px' }}>
              <div className="admin-section" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2a0000', marginTop: 0, marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '2px solid #f3f4f6' }}>
                  Upload New Photo
                </h2>
                <div className="admin-grid-2" style={{ marginBottom: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>Title (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Wedding 2024"
                      value={newPhoto.title}
                      onChange={e => setNewPhoto(p => ({ ...p, title: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={newPhoto.category}
                      onChange={e => setNewPhoto(p => ({ ...p, category: e.target.value }))}
                      style={inputStyle}
                    >
                      {GALLERY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Photo</label>
                  <input
                    id="gallery-file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0]
                      if (!file) return
                      setNewPhoto(p => ({ ...p, file, preview: URL.createObjectURL(file) }))
                    }}
                  />
                  <div
                    onClick={() => !newPhoto.preview && document.getElementById('gallery-file-input').click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => {
                      e.preventDefault()
                      setDragOver(false)
                      const file = e.dataTransfer.files[0]
                      if (file && file.type.startsWith('image/'))
                        setNewPhoto(p => ({ ...p, file, preview: URL.createObjectURL(file) }))
                    }}
                    style={{
                      border: `2px dashed ${dragOver ? '#d4af37' : newPhoto.preview ? '#d4af37' : '#e5e7eb'}`,
                      borderRadius: '4px',
                      background: dragOver ? '#fffdf5' : newPhoto.preview ? '#faf9f5' : '#fafafa',
                      transition: 'all 0.2s',
                      cursor: newPhoto.preview ? 'default' : 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {newPhoto.preview ? (
                      <>
                        <img
                          src={newPhoto.preview}
                          alt="Preview"
                          style={{ width: '100%', maxHeight: '260px', objectFit: 'contain', display: 'block' }}
                        />
                        <button
                          onClick={e => { e.stopPropagation(); setNewPhoto(p => ({ ...p, file: null, preview: null })) }}
                          style={{
                            position: 'absolute', top: '0.5rem', right: '0.5rem',
                            background: 'rgba(42,0,0,0.75)', color: '#f7ecd0',
                            border: 'none', borderRadius: '2px',
                            width: '28px', height: '28px', cursor: 'pointer',
                            fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                          title="Remove"
                        >✕</button>
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'rgba(42,0,0,0.55)', padding: '0.4rem 0.75rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <span style={{ color: '#f7ecd0', fontSize: '0.75rem', fontFamily: "'Lato', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                            {newPhoto.file.name}
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); document.getElementById('gallery-file-input').click() }}
                            style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.6)', color: '#d4af37', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '0.2rem 0.6rem', cursor: 'pointer', fontFamily: "'Lato', sans-serif", flexShrink: 0 }}
                          >
                            Change
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>📷</div>
                        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
                          {dragOver ? 'Drop to add' : 'Drop photo here or'}
                        </p>
                        {!dragOver && (
                          <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.78rem', color: '#d4af37', margin: '0.3rem 0 0', fontWeight: 600, letterSpacing: '0.05em' }}>
                            click to browse
                          </p>
                        )}
                        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.7rem', color: '#d1d5db', margin: '0.75rem 0 0' }}>
                          JPG, PNG, WEBP · max 5 MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={uploadGalleryPhoto}
                  disabled={!newPhoto.file || galleryUploading}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    background: galleryUploading
                      ? '#c9a832'
                      : !newPhoto.file
                        ? '#e5e7eb'
                        : 'linear-gradient(135deg, #2a0000, #550000)',
                    color: !newPhoto.file ? '#9ca3af' : '#f7ecd0',
                    fontFamily: "'Lato', sans-serif",
                    fontSize: '0.75rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    border: 'none',
                    cursor: !newPhoto.file || galleryUploading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    transition: 'background 0.2s',
                  }}
                >
                  {galleryUploading ? (
                    <>
                      <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(247,236,208,0.3)', borderTopColor: '#f7ecd0', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      Uploading…
                    </>
                  ) : (
                    <>↑ Upload to Gallery</>
                  )}
                </button>
              </div>

              <div className="admin-section">
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2a0000', marginTop: 0, marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '2px solid #f3f4f6' }}>
                  Gallery ({galleryImages.length} photos)
                </h2>
                {galleryLoading ? (
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Loading…</p>
                ) : galleryImages.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No photos yet. Upload your first one above.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                    {galleryImages.map(img => (
                      <div key={img.id} style={{ position: 'relative', border: '1px solid #e5e7eb' }}>
                        <img src={img.image_url} alt={img.title || ''} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                        <div style={{ padding: '0.5rem 0.6rem' }}>
                          <p style={{ fontSize: '0.72rem', color: '#d4af37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>{img.category}</p>
                          {img.title && <p style={{ fontSize: '0.8rem', color: '#374151', margin: '0.2rem 0 0' }}>{img.title}</p>}
                        </div>
                        <button
                          onClick={() => deleteGalleryPhoto(img)}
                          style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '2px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
