import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSiteConfig } from '../contexts/SiteConfigContext'
import { compressImage } from '../lib/compressImage'

const TABS = ['Dashboard', 'Colors', 'Navbar', 'Hero', 'About', 'Stats', 'Services', 'Portfolio', 'Process', 'Testimonials', 'Gallery Section', 'Contact', 'Footer', 'Gallery', 'Inquiries']

const INQUIRIES_PAGE_SIZE = 20

function friendlyUploadError(e) {
  const msg = e?.message || String(e)
  if (/exceed|too large|maximum allowed size|payload too large/i.test(msg)) {
    return 'This photo is still too large for storage even after compression. Try a smaller or simpler image, or contact support to raise the storage limit.'
  }
  return msg
}

// Valid on-page section anchors a nav link can point to — keep in sync with
// the `id` attribute on each <section> in App.jsx's homepage.
const SECTION_OPTIONS = [
  { id: 'hero', name: 'Home (Hero)' },
  { id: 'about', name: 'About' },
  { id: 'services', name: 'Services' },
  { id: 'portfolio', name: 'Portfolio' },
  { id: '/gallery', name: 'Gallery (full page)' },
  { id: 'testimonials', name: 'Testimonials' },
  { id: 'process', name: 'How It Works' },
  { id: 'contact', name: 'Contact' },
]

const ADMIN_CSS = `
  @keyframes spin { to { transform: rotate(360deg) } }
  .admin-layout { display: flex; min-height: calc(100vh - 56px); }
  .admin-sidebar {
    width: 190px; background: white; border-right: 1px solid #e5e7eb;
    flex-shrink: 0; padding-top: 1rem;
  }
  .admin-tab-dropdown { display: none; }
  .admin-main { flex: 1; padding: 2rem; overflow-y: auto; min-width: 0; }
  .admin-section { background: white; padding: 2rem; max-width: 820px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .admin-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .admin-grid-stat { display: grid; grid-template-columns: 140px 1fr; gap: 1rem; margin-bottom: 1rem; align-items: start; }
  .admin-grid-service { display: grid; grid-template-columns: 70px 1fr 1fr; gap: 1rem; }
  @media (max-width: 767px) {
    .admin-layout { flex-direction: column; }
    .admin-sidebar { display: none !important; }
    .admin-tab-dropdown { display: block; background: white; border-bottom: 1px solid #e5e7eb; padding: 0.75rem 1rem; }
    .admin-tab-dropdown select {
      width: 100%; padding: 0.6rem 0.75rem;
      border: 1px solid #e5e7eb; background: white;
      font-family: 'Lato', sans-serif; font-size: 0.85rem;
      color: #2a0000; font-weight: 600; outline: none;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23d4af37' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 0.75rem center;
      padding-right: 2rem;
    }
    .admin-main { padding: 1rem !important; }
    .admin-section { padding: 1.25rem !important; }
    .admin-grid-2 { grid-template-columns: 1fr !important; }
    .admin-grid-stat { grid-template-columns: 1fr !important; }
    .admin-grid-service { grid-template-columns: 1fr !important; }
    .admin-header-subtitle { display: none !important; }
    .admin-dash-stats { grid-template-columns: 1fr 1fr !important; }
    .admin-quick-actions { grid-template-columns: 1fr !important; }
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
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [aboutImageDrag, setAboutImageDrag] = useState(false)

  const [logoUploading, setLogoUploading] = useState(false)
  const [logoDrag, setLogoDrag] = useState(false)

  const [heroSlides, setHeroSlides] = useState(config.heroSlides || [])
  const [heroSlideUploading, setHeroSlideUploading] = useState(false)
  const [heroSlideDrag, setHeroSlideDrag] = useState(false)

  const [galleryImages, setGalleryImages] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [newPhoto, setNewPhoto] = useState({ title: '', category: config.galleryCategories?.[0] || '', file: null, preview: null })
  const [dragOver, setDragOver] = useState(false)

  const [inquiries, setInquiries] = useState([])
  const [inquiriesLoading, setInquiriesLoading] = useState(false)
  const [inquiriesVisibleCount, setInquiriesVisibleCount] = useState(INQUIRIES_PAGE_SIZE)
  const [expandedInquiry, setExpandedInquiry] = useState(null)

  const [dashStats, setDashStats] = useState({ total: 0, newThisWeek: 0, galleryCount: 0, recent: [], breakdown: {}, weekly: Array(7).fill(0) })
  const [dashLoading, setDashLoading] = useState(false)

  const [colors, setColors] = useState({ ...config.colors })
  const [navbar, setNavbar] = useState({ ...config.navbar })
  const [navLinks, setNavLinks] = useState((config.navLinks || []).map(l => ({ ...l })))
  const [hero, setHero] = useState({ ...config.hero })
  const [about, setAbout] = useState({ ...config.about })
  const [stats, setStats] = useState(config.stats.map(s => ({ ...s })))
  const [servicesSection, setServicesSection] = useState({ ...config.servicesSection })
  const [services, setServices] = useState(
    config.services.map(s => ({ ...s, tags: Array.isArray(s.tags) ? s.tags.join(', ') : s.tags }))
  )
  const [portfolioSection, setPortfolioSection] = useState({ ...config.portfolioSection })
  const [portfolio, setPortfolio] = useState((config.portfolio || []).map(p => ({ ...p })))
  const [portfolioUploadingIdx, setPortfolioUploadingIdx] = useState(null)
  const [processSection, setProcessSection] = useState({ ...config.processSection })
  const [processSteps, setProcessSteps] = useState((config.processSteps || []).map(s => ({ ...s })))
  const [testimonialsSection, setTestimonialsSection] = useState({ ...config.testimonialsSection })
  const [testimonials, setTestimonials] = useState((config.testimonials || []).map(t => ({ ...t })))
  const [testimonialUploadingIdx, setTestimonialUploadingIdx] = useState(null)
  const [gallerySection, setGallerySection] = useState({ ...config.gallerySection })
  const [galleryCategories, setGalleryCategories] = useState([...(config.galleryCategories || [])])
  const [newCategory, setNewCategory] = useState('')
  const [contactSection, setContactSection] = useState({ ...config.contactSection })
  const [contactInfo, setContactInfo] = useState({ ...config.contactInfo })
  const [eventTypes, setEventTypes] = useState([...(config.eventTypes || [])])
  const [newEventType, setNewEventType] = useState('')
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
      setSavedMsg('Error: ' + friendlyUploadError(e))
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
      const compressed = await compressImage(file, { targetBytes: 1.5 * 1024 * 1024 })
      const ext = compressed.name.split('.').pop()
      const path = `hero/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('site-images').upload(path, compressed)
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
      const updated = [...heroSlides, publicUrl]
      setHeroSlides(updated)
      await saveConfig('heroSlides', updated)
      setSavedMsg('Slide added!')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (e) {
      setSavedMsg('Error: ' + friendlyUploadError(e))
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
      const compressed = await compressImage(file)
      const ext = compressed.name.split('.').pop()
      const path = `about-image.${ext}`
      const { error: uploadErr } = await supabase.storage.from('site-images').upload(path, compressed, { upsert: true })
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
      const updated = { ...about, imageUrl: publicUrl }
      setAbout(updated)
      await doSave('about', updated)
    } catch (e) {
      alert('Image upload failed: ' + friendlyUploadError(e))
    } finally {
      setUploadingImage(false)
    }
  }

  // Auto sign-out after 30 min of inactivity
  useEffect(() => {
    let timer = setTimeout(handleSignOut, 30 * 60 * 1000)
    const reset = () => { clearTimeout(timer); timer = setTimeout(handleSignOut, 30 * 60 * 1000) }
    window.addEventListener('mousemove', reset)
    window.addEventListener('keydown', reset)
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', reset); window.removeEventListener('keydown', reset) }
  }, [])

  useEffect(() => { fetchDashboardData() }, [])

  useEffect(() => {
    if (activeTab === 'Dashboard') fetchDashboardData()
    if (activeTab === 'Gallery') fetchGallery()
    if (activeTab === 'Inquiries') fetchInquiries()
  }, [activeTab])

  async function fetchInquiries() {
    setInquiriesLoading(true)
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    if (data) setInquiries(data)
    setInquiriesVisibleCount(INQUIRIES_PAGE_SIZE)
    setInquiriesLoading(false)
  }

  async function deleteInquiry(id) {
    if (!confirm('Delete this inquiry?')) return
    await supabase.from('contacts').delete().eq('id', id)
    setInquiries(prev => prev.filter(i => i.id !== id))
  }

  async function fetchDashboardData() {
    setDashLoading(true)
    try {
      const [{ data: contacts }, { count: galleryCount }] = await Promise.all([
        supabase.from('contacts').select('id, name, email, event_type, created_at').order('created_at', { ascending: false }),
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
      ])
      if (!contacts) return
      const now = new Date()
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
      const newThisWeek = contacts.filter(c => new Date(c.created_at) >= weekAgo).length
      const breakdown = {}
      contacts.forEach(c => { const t = c.event_type || 'Other'; breakdown[t] = (breakdown[t] || 0) + 1 })
      const weeklyBuckets = Array(7).fill(0)
      contacts.forEach(c => {
        const ageDays = (now - new Date(c.created_at)) / (24 * 60 * 60 * 1000)
        const idx = Math.floor(ageDays / 7)
        if (idx < 7) weeklyBuckets[idx]++
      })
      setDashStats({ total: contacts.length, newThisWeek, galleryCount: galleryCount || 0, recent: contacts.slice(0, 5), breakdown, weekly: [...weeklyBuckets].reverse() })
    } finally {
      setDashLoading(false)
    }
  }

  async function exportCSV() {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    if (!data || data.length === 0) { alert('No inquiries to export.'); return }
    const headers = ['Name', 'Email', 'Phone', 'Event Type', 'Message', 'Date']
    const rows = data.map(i => [i.name, i.email, i.phone || '', i.event_type || '', (i.message || '').replace(/"/g, '""'), new Date(i.created_at).toLocaleDateString('en-GB')])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `inquiries-${new Date().toISOString().slice(0, 10)}.csv` })
    a.click()
  }

  async function fetchGallery() {
    setGalleryLoading(true)
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (data) setGalleryImages(data)
    setGalleryLoading(false)
  }

  function addGalleryCategory() {
    const name = newCategory.trim()
    if (!name) return
    if (galleryCategories.some(c => c.toLowerCase() === name.toLowerCase())) {
      setSavedMsg('Error: that category already exists')
      return
    }
    const updated = [...galleryCategories, name]
    setGalleryCategories(updated)
    setNewCategory('')
    doSave('galleryCategories', updated)
  }

  function removeGalleryCategory(name) {
    if (!confirm(`Remove "${name}"? Existing photos tagged with it will stay in the gallery but won't appear under any filter button.`)) return
    const updated = galleryCategories.filter(c => c !== name)
    setGalleryCategories(updated)
    doSave('galleryCategories', updated)
  }

  function moveGalleryCategory(i, dir) {
    const target = i + dir
    if (target < 0 || target >= galleryCategories.length) return
    const updated = [...galleryCategories]
    ;[updated[i], updated[target]] = [updated[target], updated[i]]
    setGalleryCategories(updated)
    doSave('galleryCategories', updated)
  }

  function addNavLink() {
    setNavLinks(prev => [...prev, { id: 'about', label: 'New Link' }])
  }

  function removeNavLink(i) {
    if (!confirm('Remove this menu link?')) return
    setNavLinks(prev => prev.filter((_, j) => j !== i))
  }

  function moveNavLink(i, dir) {
    setNavLinks(prev => {
      const target = i + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }

  function addEventType() {
    const name = newEventType.trim()
    if (!name) return
    if (eventTypes.some(t => t.toLowerCase() === name.toLowerCase())) {
      setSavedMsg('Error: that event type already exists')
      return
    }
    const updated = [...eventTypes, name]
    setEventTypes(updated)
    setNewEventType('')
    doSave('eventTypes', updated)
  }

  function removeEventType(name) {
    if (!confirm(`Remove "${name}" from the contact form's event type list?`)) return
    const updated = eventTypes.filter(t => t !== name)
    setEventTypes(updated)
    doSave('eventTypes', updated)
  }

  function moveEventType(i, dir) {
    const target = i + dir
    if (target < 0 || target >= eventTypes.length) return
    const updated = [...eventTypes]
    ;[updated[i], updated[target]] = [updated[target], updated[i]]
    setEventTypes(updated)
    doSave('eventTypes', updated)
  }

  async function uploadGalleryPhoto() {
    if (!newPhoto.file) return
    setGalleryUploading(true)
    try {
      const file = await compressImage(newPhoto.file)
      const ext = file.name.split('.').pop()
      const path = `gallery/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('site-images').upload(path, file)
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
      const { error: dbErr } = await supabase.from('gallery').insert([{
        title: newPhoto.title || null,
        image_url: publicUrl,
        category: newPhoto.category,
      }])
      if (dbErr) throw dbErr
      setNewPhoto({ title: '', category: galleryCategories[0] || '', file: null, preview: null })
      await fetchGallery()
      setSavedMsg('Photo uploaded!')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch (e) {
      setSavedMsg('Error: ' + friendlyUploadError(e))
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

  function addStat() {
    setStats(prev => [...prev, { value: '0+', label: 'New Stat' }])
  }

  function removeStat(i) {
    if (!confirm('Remove this stat card?')) return
    setStats(prev => prev.filter((_, j) => j !== i))
  }

  function moveStat(i, dir) {
    setStats(prev => {
      const target = i + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }

  function addService() {
    setServices(prev => [...prev, { emoji: '✨', title: 'New Service', subtitle: '', desc: '', tags: '' }])
  }

  function removeService(i) {
    if (!confirm('Remove this service card?')) return
    setServices(prev => prev.filter((_, j) => j !== i))
  }

  function moveService(i, dir) {
    setServices(prev => {
      const target = i + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }

  function addPortfolio() {
    setPortfolio(prev => [...prev, { coverImage: '', type: '', name: 'New Event', description: '' }])
  }

  function removePortfolio(i) {
    if (!confirm('Remove this portfolio entry?')) return
    setPortfolio(prev => prev.filter((_, j) => j !== i))
  }

  function movePortfolio(i, dir) {
    setPortfolio(prev => {
      const target = i + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }

  async function uploadPortfolioCover(i, file) {
    if (!file || !file.type.startsWith('image/')) return
    setPortfolioUploadingIdx(i)
    try {
      const compressed = await compressImage(file)
      const ext = compressed.name.split('.').pop()
      const path = `portfolio/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('site-images').upload(path, compressed)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
      setPortfolio(prev => prev.map((p, j) => j === i ? { ...p, coverImage: publicUrl } : p))
    } catch (e) {
      setSavedMsg('Error: ' + friendlyUploadError(e))
    } finally {
      setPortfolioUploadingIdx(null)
    }
  }

  function addTestimonial() {
    setTestimonials(prev => [...prev, { name: 'New Client', eventType: '', quote: '', photoUrl: '' }])
  }

  function removeTestimonial(i) {
    if (!confirm('Remove this testimonial?')) return
    setTestimonials(prev => prev.filter((_, j) => j !== i))
  }

  function moveTestimonial(i, dir) {
    setTestimonials(prev => {
      const target = i + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }

  async function uploadTestimonialPhoto(i, file) {
    if (!file || !file.type.startsWith('image/')) return
    setTestimonialUploadingIdx(i)
    try {
      const compressed = await compressImage(file)
      const ext = compressed.name.split('.').pop()
      const path = `testimonials/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('site-images').upload(path, compressed)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
      setTestimonials(prev => prev.map((t, j) => j === i ? { ...t, photoUrl: publicUrl } : t))
    } catch (e) {
      setSavedMsg('Error: ' + friendlyUploadError(e))
    } finally {
      setTestimonialUploadingIdx(null)
    }
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

      {/* Mobile dropdown */}
      <div className="admin-tab-dropdown">
        <select value={activeTab} onChange={e => setActiveTab(e.target.value)}>
          {TABS.map(tab => <option key={tab} value={tab}>{tab}</option>)}
        </select>
      </div>

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

          {/* DASHBOARD */}
          {activeTab === 'Dashboard' && (
            <div>
              {/* Greeting */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#2a0000', margin: 0 }}>Dashboard</h2>
                  <p style={{ fontSize: '0.78rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif", marginTop: '0.2rem' }}>
                    {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={fetchDashboardData}
                  style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.4rem 1rem', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', color: '#6b7280', fontFamily: "'Lato', sans-serif" }}
                >
                  Refresh
                </button>
              </div>

              {dashLoading ? (
                <p style={{ color: '#9ca3af', fontFamily: "'Lato', sans-serif", fontSize: '0.85rem' }}>Loading…</p>
              ) : (
                <>
                  {/* Stat cards */}
                  <div className="admin-dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
                    {[
                      { label: 'Total inquiries', value: dashStats.total, sub: 'all time' },
                      { label: 'New this week', value: dashStats.newThisWeek, sub: 'last 7 days', highlight: dashStats.newThisWeek > 0 },
                      { label: 'Gallery images', value: dashStats.galleryCount, sub: 'uploaded' },
                      { label: 'Top event', value: Object.entries(dashStats.breakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || '—', sub: `${Object.entries(dashStats.breakdown).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} inquiries`, small: true },
                    ].map(({ label, value, sub, highlight, small }) => (
                      <div key={label} style={{ background: 'white', border: `1px solid ${highlight ? '#d4af3766' : '#e5e7eb'}`, padding: '1.1rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: "'Lato', sans-serif", marginBottom: '0.5rem' }}>
                          {label}
                        </p>
                        <p style={{ fontSize: small ? '1.1rem' : '1.75rem', fontWeight: 700, color: highlight ? '#2a0000' : '#1f2937', fontFamily: small ? "'Playfair Display', serif" : "'Lato', sans-serif", margin: 0, lineHeight: 1.1 }}>{value}</p>
                        <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif", marginTop: '0.3rem' }}>{sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Row 2: Recent inquiries + Quick actions */}
                  <div className="admin-grid-2" style={{ marginBottom: '1.25rem' }}>
                    {/* Recent inquiries */}
                    <div style={{ background: 'white', border: '1px solid #e5e7eb', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280', fontFamily: "'Lato', sans-serif", fontWeight: 700, margin: 0 }}>Recent inquiries</p>
                        <button onClick={() => setActiveTab('Inquiries')} style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4af37', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Lato', sans-serif", fontWeight: 700 }}>View all →</button>
                      </div>
                      {dashStats.recent.length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: '0.82rem', fontFamily: "'Lato', sans-serif" }}>No inquiries yet.</p>
                      ) : (
                        dashStats.recent.map((inq, i) => (
                          <div key={inq.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: i < dashStats.recent.length - 1 ? '10px' : 0, marginBottom: i < dashStats.recent.length - 1 ? '10px' : 0, borderBottom: i < dashStats.recent.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #2a0000, #550000)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Playfair Display', serif", flexShrink: 0 }}>
                              {inq.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1f2937', fontFamily: "'Lato', sans-serif", margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.name}</p>
                              <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif", margin: 0 }}>{inq.event_type || 'Event'}</p>
                            </div>
                            <p style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif", flexShrink: 0 }}>
                              {new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Quick actions */}
                    <div style={{ background: 'white', border: '1px solid #e5e7eb', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280', fontFamily: "'Lato', sans-serif", fontWeight: 700, margin: '0 0 1rem' }}>Quick actions</p>
                      <div className="admin-quick-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[
                          { label: 'Add photo', tab: 'Gallery' },
                          { label: 'Edit colors', tab: 'Colors' },
                          { label: 'View inquiries', tab: 'Inquiries' },
                          { label: 'Edit navbar', tab: 'Navbar' },
                          { label: 'Edit footer', tab: 'Footer' },
                          { label: 'Edit hero', tab: 'Hero' },
                        ].map(({ label, tab }) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '0.7rem 0.75rem', cursor: 'pointer', textAlign: 'left', fontSize: '0.78rem', color: '#374151', fontFamily: "'Lato', sans-serif" }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={exportCSV}
                        style={{ marginTop: '8px', width: '100%', padding: '0.7rem 0.75rem', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#2a0000', border: 'none', cursor: 'pointer', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, fontFamily: "'Lato', sans-serif" }}
                      >
                        ↓ Export all inquiries CSV
                      </button>
                    </div>
                  </div>

                  {/* Row 3: Breakdown + Sparkline */}
                  <div className="admin-grid-2">
                    {/* Inquiry breakdown */}
                    <div style={{ background: 'white', border: '1px solid #e5e7eb', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280', fontFamily: "'Lato', sans-serif", fontWeight: 700, margin: '0 0 1rem' }}>By event type</p>
                      {Object.keys(dashStats.breakdown).length === 0 ? (
                        <p style={{ color: '#9ca3af', fontSize: '0.82rem', fontFamily: "'Lato', sans-serif" }}>No data yet.</p>
                      ) : (
                        Object.entries(dashStats.breakdown)
                          .sort((a, b) => b[1] - a[1])
                          .map(([type, count]) => (
                            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                              <span style={{ fontSize: '0.78rem', color: '#6b7280', fontFamily: "'Lato', sans-serif", minWidth: '90px', flexShrink: 0 }}>{type}</span>
                              <div style={{ flex: 1, height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.round((count / dashStats.total) * 100)}%`, background: 'linear-gradient(90deg, #d4af37, #b8960c)', borderRadius: '3px' }} />
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif", minWidth: '18px', textAlign: 'right' }}>{count}</span>
                            </div>
                          ))
                      )}
                    </div>

                    {/* Weekly sparkline */}
                    <div style={{ background: 'white', border: '1px solid #e5e7eb', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <p style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280', fontFamily: "'Lato', sans-serif", fontWeight: 700, margin: '0 0 1rem' }}>Inquiries per week</p>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '64px' }}>
                        {dashStats.weekly.map((v, i) => {
                          const max = Math.max(...dashStats.weekly, 1)
                          const isLatest = i === dashStats.weekly.length - 1
                          return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '4px' }}>
                              <span style={{ fontSize: '0.6rem', color: isLatest ? '#d4af37' : '#d1d5db', fontFamily: "'Lato', sans-serif", fontWeight: isLatest ? 700 : 400 }}>{v}</span>
                              <div style={{ width: '100%', height: `${Math.round((v / max) * 44) + 4}px`, background: isLatest ? 'linear-gradient(180deg, #d4af37, #b8960c)' : '#e5e7eb', borderRadius: '2px 2px 0 0', minHeight: '4px' }} />
                            </div>
                          )
                        })}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.6rem', color: '#d1d5db', fontFamily: "'Lato', sans-serif" }}>6 wks ago</span>
                        <span style={{ fontSize: '0.6rem', color: '#d4af37', fontFamily: "'Lato', sans-serif", fontWeight: 700 }}>This week</span>
                      </div>
                      <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#fffdf5', border: '1px solid #d4af3733' }}>
                        <p style={{ fontSize: '0.72rem', color: '#6b7280', fontFamily: "'Lato', sans-serif", margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#d4af37' }}>🔒</span> Auto sign-out after 30 min of inactivity
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
                <ColorPicker label="Light text (on dark backgrounds)" value={colors.lightText || '#f7ecd0'} onChange={v => setColors(p => ({ ...p, lightText: v }))} />
                <ColorPicker label="Dark text (body text on light backgrounds)" value={colors.darkText || '#5c4604'} onChange={v => setColors(p => ({ ...p, darkText: v }))} />
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

            {/* Menu links */}
            <div style={{ marginTop: '1.5rem' }} />
            <Section title="Menu Links" onSave={() => doSave('navLinks', navLinks)} saving={saving}>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Controls both the top navbar and the footer's "Quick Links" — they always stay in sync. Each link scrolls to a section on the page. Press <strong>Save Changes</strong> to apply.
              </p>
              {navLinks.map((link, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Label</label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={e => setNavLinks(prev => prev.map((l, j) => j === i ? { ...l, label: e.target.value } : l))}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Links to</label>
                    <select
                      value={link.id}
                      onChange={e => setNavLinks(prev => prev.map((l, j) => j === i ? { ...l, id: e.target.value } : l))}
                      style={inputStyle}
                    >
                      {SECTION_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <button type="button" onClick={() => moveNavLink(i, -1)} disabled={i === 0} title="Move up" style={{ width: '2.625rem', height: '2.625rem', border: '1px solid #e5e7eb', background: 'white', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#d1d5db' : '#6b7280', fontSize: '0.85rem', flexShrink: 0 }}>↑</button>
                  <button type="button" onClick={() => moveNavLink(i, 1)} disabled={i === navLinks.length - 1} title="Move down" style={{ width: '2.625rem', height: '2.625rem', border: '1px solid #e5e7eb', background: 'white', cursor: i === navLinks.length - 1 ? 'not-allowed' : 'pointer', color: i === navLinks.length - 1 ? '#d1d5db' : '#6b7280', fontSize: '0.85rem', flexShrink: 0 }}>↓</button>
                  <button type="button" onClick={() => removeNavLink(i)} title="Remove" style={{ height: '2.625rem', padding: '0 0.85rem', border: '1px solid #fca5a5', background: 'white', cursor: 'pointer', color: '#ef4444', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, flexShrink: 0 }}>Remove</button>
                </div>
              ))}
              <button
                type="button"
                onClick={addNavLink}
                style={{ width: '100%', padding: '0.75rem', border: '2px dashed #d4af37', background: '#fffdf5', color: '#7a5f06', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif", marginTop: '0.5rem' }}
              >
                + Add Menu Link
              </button>
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
              <Field label="Secondary button text (links to Contact)" value={hero.quoteButton} onChange={v => setHero(p => ({ ...p, quoteButton: v }))} />
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
              <Field label="Contact link text (links to Contact section)" value={about.followLinkText} onChange={v => setAbout(p => ({ ...p, followLinkText: v }))} />
              <div style={{ marginTop: '0.5rem' }}>
                <label style={labelStyle}>About Image</label>
                <input
                  id="about-image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files[0]; if (f) uploadAboutImage(f); e.target.value = '' }}
                />
                {about.imageUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', border: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                    <img src={about.imageUrl} alt="About" style={{ width: '90px', height: '90px', objectFit: 'cover', border: '1px solid #e5e7eb', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: '100px' }}>
                      <p style={{ fontSize: '0.78rem', color: '#374151', fontFamily: "'Lato', sans-serif", margin: '0 0 0.5rem' }}>Current image</p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => document.getElementById('about-image-input').click()}
                          style={{ padding: '0.35rem 0.9rem', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#2a0000', border: 'none', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}
                        >Replace</button>
                        <button
                          onClick={() => { const updated = { ...about, imageUrl: '' }; setAbout(updated); doSave('about', updated) }}
                          style={{ padding: '0.35rem 0.9rem', background: 'transparent', color: '#9ca3af', border: '1px solid #e5e7eb', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}
                        >Remove</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploadingImage && document.getElementById('about-image-input').click()}
                    onDragOver={e => { e.preventDefault(); setAboutImageDrag(true) }}
                    onDragLeave={() => setAboutImageDrag(false)}
                    onDrop={e => { e.preventDefault(); setAboutImageDrag(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) uploadAboutImage(f) }}
                    style={{
                      border: `2px dashed ${aboutImageDrag ? '#d4af37' : '#e5e7eb'}`,
                      background: aboutImageDrag ? '#fffdf5' : '#fafafa',
                      borderRadius: '4px',
                      minHeight: '120px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: uploadingImage ? 'wait' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {uploadingImage ? (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '20px', height: '20px', border: '2px solid #e5e7eb', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 0.5rem' }} />
                        <p style={{ fontSize: '0.82rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif" }}>Uploading…</p>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}>🌸</div>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                          {aboutImageDrag ? 'Drop image here' : 'Drop image here or click to browse'}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: '#d1d5db', margin: '0.4rem 0 0', fontFamily: "'Lato', sans-serif" }}>
                          JPG, PNG, WEBP · Recommended: portrait (4:5 ratio)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* STATS */}
          {activeTab === 'Stats' && (
            <Section title="Statistics" onSave={() => doSave('stats', stats)} saving={saving}>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                The stat cards shown on the homepage (e.g. "200+ Events Planned"). Add, remove, or reorder. Changes apply once you press <strong>Save Changes</strong>.
              </p>
              {stats.map((stat, i) => (
                <div key={i} style={{ marginBottom: '1.25rem', padding: '1rem', background: '#fafafa', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', margin: 0, fontWeight: 700 }}>
                      Stat {i + 1}
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button type="button" onClick={() => moveStat(i, -1)} disabled={i === 0} title="Move up" style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', background: 'white', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#d1d5db' : '#6b7280', fontSize: '0.8rem' }}>↑</button>
                      <button type="button" onClick={() => moveStat(i, 1)} disabled={i === stats.length - 1} title="Move down" style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', background: 'white', cursor: i === stats.length - 1 ? 'not-allowed' : 'pointer', color: i === stats.length - 1 ? '#d1d5db' : '#6b7280', fontSize: '0.8rem' }}>↓</button>
                      <button type="button" onClick={() => removeStat(i)} title="Remove" style={{ height: '28px', padding: '0 0.7rem', border: '1px solid #fca5a5', background: 'white', cursor: 'pointer', color: '#ef4444', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Remove</button>
                    </div>
                  </div>
                  <div className="admin-grid-stat">
                    <Field
                      label="Value"
                      value={stat.value}
                      onChange={v => setStats(prev => prev.map((s, j) => j === i ? { ...s, value: v } : s))}
                    />
                    <Field
                      label="Label"
                      value={stat.label}
                      onChange={v => setStats(prev => prev.map((s, j) => j === i ? { ...s, label: v } : s))}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addStat}
                style={{ width: '100%', padding: '0.85rem', border: '2px dashed #d4af37', background: '#fffdf5', color: '#7a5f06', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}
              >
                + Add Stat
              </button>
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
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Add, reorder, or remove the service cards shown on the homepage. Changes apply once you press <strong>Save Changes</strong>.
              </p>
              {services.map((svc, i) => (
                <div key={i} style={{ marginBottom: '2rem', padding: '1.25rem', background: '#fafafa', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', margin: 0, fontWeight: 700 }}>
                      Service {i + 1}
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => moveService(i, -1)}
                        disabled={i === 0}
                        title="Move up"
                        style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', background: 'white', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#d1d5db' : '#6b7280', fontSize: '0.8rem' }}
                      >↑</button>
                      <button
                        type="button"
                        onClick={() => moveService(i, 1)}
                        disabled={i === services.length - 1}
                        title="Move down"
                        style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', background: 'white', cursor: i === services.length - 1 ? 'not-allowed' : 'pointer', color: i === services.length - 1 ? '#d1d5db' : '#6b7280', fontSize: '0.8rem' }}
                      >↓</button>
                      <button
                        type="button"
                        onClick={() => removeService(i)}
                        title="Remove"
                        style={{ height: '28px', padding: '0 0.7rem', border: '1px solid #fca5a5', background: 'white', cursor: 'pointer', color: '#ef4444', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}
                      >Remove</button>
                    </div>
                  </div>
                  <div className="admin-grid-service">
                    <Field label="Emoji" value={svc.emoji} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, emoji: v } : s))} />
                    <Field label="Title" value={svc.title} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, title: v } : s))} />
                    <Field label="Subtitle" value={svc.subtitle} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, subtitle: v } : s))} />
                  </div>
                  <Field label="Description" value={svc.desc} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, desc: v } : s))} multiline />
                  <Field label="Tags (comma-separated)" value={svc.tags} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, tags: v } : s))} />
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                style={{ width: '100%', padding: '0.85rem', border: '2px dashed #d4af37', background: '#fffdf5', color: '#7a5f06', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}
              >
                + Add Service Card
              </button>
            </Section>
            </>
          )}

          {/* PORTFOLIO */}
          {activeTab === 'Portfolio' && (
            <>
            <Section title="Portfolio Section Header" onSave={() => doSave('portfolioSection', portfolioSection)} saving={saving}>
              <Field label="Section label (small caps above title)" value={portfolioSection.label} onChange={v => setPortfolioSection(p => ({ ...p, label: v }))} />
              <div className="admin-grid-2">
                <Field label="Title — first word(s)" value={portfolioSection.title} onChange={v => setPortfolioSection(p => ({ ...p, title: v }))} />
                <Field label="Title — italic accent word" value={portfolioSection.titleAccent} onChange={v => setPortfolioSection(p => ({ ...p, titleAccent: v }))} />
              </div>
              <Field label="Description paragraph" value={portfolioSection.desc} onChange={v => setPortfolioSection(p => ({ ...p, desc: v }))} multiline />
            </Section>
            <div style={{ marginTop: '1.5rem' }} />
            <Section title="Featured Events" onSave={() => doSave('portfolio', portfolio)} saving={saving}>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Showcase real events as case studies. Each appears as a large image-and-story row on the homepage with a “Plan an event like this” button. Tip: set the <strong>Event type</strong> to match a contact-form option (Wedding, Birthday, Corporate Event, Religious Ceremony, Engagement) so the button pre-fills it. Changes apply once you press <strong>Save Changes</strong>.
              </p>
              {portfolio.map((entry, i) => (
                <div key={i} style={{ marginBottom: '2rem', padding: '1.25rem', background: '#fafafa', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', margin: 0, fontWeight: 700 }}>
                      Event {i + 1}
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button type="button" onClick={() => movePortfolio(i, -1)} disabled={i === 0} title="Move up" style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', background: 'white', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#d1d5db' : '#6b7280', fontSize: '0.8rem' }}>↑</button>
                      <button type="button" onClick={() => movePortfolio(i, 1)} disabled={i === portfolio.length - 1} title="Move down" style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', background: 'white', cursor: i === portfolio.length - 1 ? 'not-allowed' : 'pointer', color: i === portfolio.length - 1 ? '#d1d5db' : '#6b7280', fontSize: '0.8rem' }}>↓</button>
                      <button type="button" onClick={() => removePortfolio(i)} title="Remove" style={{ height: '28px', padding: '0 0.7rem', border: '1px solid #fca5a5', background: 'white', cursor: 'pointer', color: '#ef4444', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Remove</button>
                    </div>
                  </div>

                  {/* Cover image */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ width: '140px', height: '105px', flexShrink: 0, background: '#f3f4f6', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {entry.coverImage
                        ? <img src={entry.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>📸</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <label style={labelStyle}>Cover image</label>
                      <input
                        type="file"
                        accept="image/*"
                        id={`pf-cover-${i}`}
                        style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadPortfolioCover(i, f); e.target.value = '' }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById(`pf-cover-${i}`).click()}
                        disabled={portfolioUploadingIdx === i}
                        style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#2a0000', border: 'none', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, cursor: portfolioUploadingIdx === i ? 'wait' : 'pointer', fontFamily: "'Lato', sans-serif" }}
                      >
                        {portfolioUploadingIdx === i ? 'Uploading…' : entry.coverImage ? 'Replace photo' : 'Upload photo'}
                      </button>
                      <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0.5rem 0 0' }}>Large photos are auto-compressed before upload.</p>
                    </div>
                  </div>

                  <div className="admin-grid-2">
                    <Field label="Event type (e.g. Wedding)" value={entry.type} onChange={v => setPortfolio(prev => prev.map((p, j) => j === i ? { ...p, type: v } : p))} />
                    <Field label="Event name / title" value={entry.name} onChange={v => setPortfolio(prev => prev.map((p, j) => j === i ? { ...p, name: v } : p))} />
                  </div>
                  <Field label="Description / story" value={entry.description} onChange={v => setPortfolio(prev => prev.map((p, j) => j === i ? { ...p, description: v } : p))} multiline />
                </div>
              ))}
              <button
                type="button"
                onClick={addPortfolio}
                style={{ width: '100%', padding: '0.85rem', border: '2px dashed #d4af37', background: '#fffdf5', color: '#7a5f06', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}
              >
                + Add Featured Event
              </button>
            </Section>
            </>
          )}

          {/* PROCESS */}
          {activeTab === 'Process' && (
            <>
            <Section title="How It Works — Section Header" onSave={() => doSave('processSection', processSection)} saving={saving}>
              <Field label="Section label (small caps above title)" value={processSection.label} onChange={v => setProcessSection(p => ({ ...p, label: v }))} />
              <div className="admin-grid-2">
                <Field label="Title — first word(s)" value={processSection.title} onChange={v => setProcessSection(p => ({ ...p, title: v }))} />
                <Field label="Title — italic accent word" value={processSection.titleAccent} onChange={v => setProcessSection(p => ({ ...p, titleAccent: v }))} />
              </div>
            </Section>
            <div style={{ marginTop: '1.5rem' }} />
            <Section title="Process Steps" onSave={() => doSave('processSteps', processSteps)} saving={saving}>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                The 4-step process shown to visitors before the contact form.
              </p>
              {processSteps.map((step, i) => (
                <div key={i} style={{ marginBottom: '1.5rem', padding: '1.25rem', background: '#fafafa', border: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', marginBottom: '1.25rem', fontWeight: 700 }}>
                    Step {i + 1}
                  </p>
                  <div className="admin-grid-service">
                    <Field label="Number" value={step.number} onChange={v => setProcessSteps(prev => prev.map((s, j) => j === i ? { ...s, number: v } : s))} />
                    <Field label="Title" value={step.title} onChange={v => setProcessSteps(prev => prev.map((s, j) => j === i ? { ...s, title: v } : s))} />
                    <div />
                  </div>
                  <Field label="Description" value={step.desc} onChange={v => setProcessSteps(prev => prev.map((s, j) => j === i ? { ...s, desc: v } : s))} multiline />
                </div>
              ))}
            </Section>
            </>
          )}

          {/* TESTIMONIALS */}
          {activeTab === 'Testimonials' && (
            <>
            <Section title="Testimonials Section Header" onSave={() => doSave('testimonialsSection', testimonialsSection)} saving={saving}>
              <Field label="Section label (small caps above title)" value={testimonialsSection.label} onChange={v => setTestimonialsSection(p => ({ ...p, label: v }))} />
              <div className="admin-grid-2">
                <Field label="Title — first word(s)" value={testimonialsSection.title} onChange={v => setTestimonialsSection(p => ({ ...p, title: v }))} />
                <Field label="Title — italic accent word" value={testimonialsSection.titleAccent} onChange={v => setTestimonialsSection(p => ({ ...p, titleAccent: v }))} />
              </div>
            </Section>
            <div style={{ marginTop: '1.5rem' }} />
            <Section title="Client Testimonials" onSave={() => doSave('testimonials', testimonials)} saving={saving}>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Real client quotes build trust. Photo is optional — without one, an initial avatar is shown. Changes apply once you press <strong>Save Changes</strong>.
              </p>
              {testimonials.map((t, i) => (
                <div key={i} style={{ marginBottom: '2rem', padding: '1.25rem', background: '#fafafa', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', margin: 0, fontWeight: 700 }}>
                      Testimonial {i + 1}
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button type="button" onClick={() => moveTestimonial(i, -1)} disabled={i === 0} title="Move up" style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', background: 'white', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#d1d5db' : '#6b7280', fontSize: '0.8rem' }}>↑</button>
                      <button type="button" onClick={() => moveTestimonial(i, 1)} disabled={i === testimonials.length - 1} title="Move down" style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', background: 'white', cursor: i === testimonials.length - 1 ? 'not-allowed' : 'pointer', color: i === testimonials.length - 1 ? '#d1d5db' : '#6b7280', fontSize: '0.8rem' }}>↓</button>
                      <button type="button" onClick={() => removeTestimonial(i)} title="Remove" style={{ height: '28px', padding: '0 0.7rem', border: '1px solid #fca5a5', background: 'white', cursor: 'pointer', color: '#ef4444', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Remove</button>
                    </div>
                  </div>

                  {/* Photo */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0, background: '#f3f4f6', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {t.photoUrl
                        ? <img src={t.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '1.25rem', opacity: 0.3 }}>👤</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        id={`tm-photo-${i}`}
                        style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadTestimonialPhoto(i, f); e.target.value = '' }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById(`tm-photo-${i}`).click()}
                        disabled={testimonialUploadingIdx === i}
                        style={{ padding: '0.45rem 0.9rem', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#2a0000', border: 'none', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, cursor: testimonialUploadingIdx === i ? 'wait' : 'pointer', fontFamily: "'Lato', sans-serif" }}
                      >
                        {testimonialUploadingIdx === i ? 'Uploading…' : t.photoUrl ? 'Replace photo' : 'Upload photo (optional)'}
                      </button>
                    </div>
                  </div>

                  <div className="admin-grid-2">
                    <Field label="Client name" value={t.name} onChange={v => setTestimonials(prev => prev.map((p, j) => j === i ? { ...p, name: v } : p))} />
                    <Field label="Event type" value={t.eventType} onChange={v => setTestimonials(prev => prev.map((p, j) => j === i ? { ...p, eventType: v } : p))} />
                  </div>
                  <Field label="Quote" value={t.quote} onChange={v => setTestimonials(prev => prev.map((p, j) => j === i ? { ...p, quote: v } : p))} multiline />
                </div>
              ))}
              <button
                type="button"
                onClick={addTestimonial}
                style={{ width: '100%', padding: '0.85rem', border: '2px dashed #d4af37', background: '#fffdf5', color: '#7a5f06', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}
              >
                + Add Testimonial
              </button>
            </Section>
            </>
          )}

          {/* GALLERY SECTION */}
          {activeTab === 'Gallery Section' && (
            <>
            <Section title="Gallery Section Header" onSave={() => doSave('gallerySection', gallerySection)} saving={saving}>
              <Field label="Section label (small caps above title)" value={gallerySection.label} onChange={v => setGallerySection(p => ({ ...p, label: v }))} />
              <div className="admin-grid-2">
                <Field label="Title — first word(s)" value={gallerySection.title} onChange={v => setGallerySection(p => ({ ...p, title: v }))} />
                <Field label="Title — italic accent word" value={gallerySection.titleAccent} onChange={v => setGallerySection(p => ({ ...p, titleAccent: v }))} />
              </div>
              <Field label="Instagram button text" value={gallerySection.instagramButton} onChange={v => setGallerySection(p => ({ ...p, instagramButton: v }))} />
              <div>
                <label style={labelStyle}>Photos shown per page</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={gallerySection.pageSize ?? 12}
                  onChange={e => setGallerySection(p => ({ ...p, pageSize: Math.max(1, Math.min(60, Number(e.target.value) || 1)) }))}
                  style={{ ...inputStyle, maxWidth: '140px' }}
                />
                <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.4rem', fontFamily: "'Lato', sans-serif" }}>
                  How many photos appear before visitors need to click "Show More" — applies per category.
                </p>
              </div>
            </Section>

            <div style={{ marginTop: '1.5rem' }} />
            <div className="admin-section">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2a0000', marginTop: 0, marginBottom: '0.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f3f4f6' }}>
                Gallery Categories
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', fontFamily: "'Lato', sans-serif", lineHeight: 1.6 }}>
                These appear as filter buttons on the live gallery and as category choices when uploading a photo. Add, remove, or reorder them — changes save immediately, no need to press a separate save button.
              </p>

              {galleryCategories.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1.25rem' }}>No categories yet — add one below.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {galleryCategories.map((cat, i) => (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', background: '#fafafa', border: '1px solid #e5e7eb' }}>
                      <span style={{ flex: 1, fontSize: '0.85rem', color: '#1f2937', fontFamily: "'Lato', sans-serif", fontWeight: 600 }}>{cat}</span>
                      <button type="button" onClick={() => moveGalleryCategory(i, -1)} disabled={i === 0} title="Move up" style={{ width: '26px', height: '26px', border: '1px solid #e5e7eb', background: 'white', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#d1d5db' : '#6b7280', fontSize: '0.75rem' }}>↑</button>
                      <button type="button" onClick={() => moveGalleryCategory(i, 1)} disabled={i === galleryCategories.length - 1} title="Move down" style={{ width: '26px', height: '26px', border: '1px solid #e5e7eb', background: 'white', cursor: i === galleryCategories.length - 1 ? 'not-allowed' : 'pointer', color: i === galleryCategories.length - 1 ? '#d1d5db' : '#6b7280', fontSize: '0.75rem' }}>↓</button>
                      <button type="button" onClick={() => removeGalleryCategory(cat)} title="Remove" style={{ height: '26px', padding: '0 0.6rem', border: '1px solid #fca5a5', background: 'white', cursor: 'pointer', color: '#ef4444', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGalleryCategory() } }}
                  placeholder="e.g. Engagements"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={addGalleryCategory}
                  style={{ padding: '0 1.25rem', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#2a0000', border: 'none', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif", whiteSpace: 'nowrap' }}
                >
                  + Add
                </button>
              </div>
            </div>
            </>
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
              <Field label="WhatsApp number (leave blank to use phone)" value={contactInfo.whatsapp} onChange={v => setContactInfo(p => ({ ...p, whatsapp: v }))} />
              <Field label="Email address" value={contactInfo.email} onChange={v => setContactInfo(p => ({ ...p, email: v }))} />
              <Field label="Location / Address" value={contactInfo.address} onChange={v => setContactInfo(p => ({ ...p, address: v }))} />
              <Field label="Instagram handle (e.g. @shubhasparshanp)" value={contactInfo.instagramHandle} onChange={v => setContactInfo(p => ({ ...p, instagramHandle: v }))} />
              <Field label="Instagram URL" value={contactInfo.instagramUrl} onChange={v => setContactInfo(p => ({ ...p, instagramUrl: v }))} />
            </Section>

            <div style={{ marginTop: '1.5rem' }} />
            <div className="admin-section">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2a0000', marginTop: 0, marginBottom: '0.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f3f4f6' }}>
                Event Types
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '1.5rem', fontFamily: "'Lato', sans-serif", lineHeight: 1.6 }}>
                The dropdown options visitors choose from on the contact form. Add, remove, or reorder — changes save immediately.
              </p>

              {eventTypes.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1.25rem' }}>No event types yet — add one below.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {eventTypes.map((type, i) => (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', background: '#fafafa', border: '1px solid #e5e7eb' }}>
                      <span style={{ flex: 1, fontSize: '0.85rem', color: '#1f2937', fontFamily: "'Lato', sans-serif", fontWeight: 600 }}>{type}</span>
                      <button type="button" onClick={() => moveEventType(i, -1)} disabled={i === 0} title="Move up" style={{ width: '26px', height: '26px', border: '1px solid #e5e7eb', background: 'white', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#d1d5db' : '#6b7280', fontSize: '0.75rem' }}>↑</button>
                      <button type="button" onClick={() => moveEventType(i, 1)} disabled={i === eventTypes.length - 1} title="Move down" style={{ width: '26px', height: '26px', border: '1px solid #e5e7eb', background: 'white', cursor: i === eventTypes.length - 1 ? 'not-allowed' : 'pointer', color: i === eventTypes.length - 1 ? '#d1d5db' : '#6b7280', fontSize: '0.75rem' }}>↓</button>
                      <button type="button" onClick={() => removeEventType(type)} title="Remove" style={{ height: '26px', padding: '0 0.6rem', border: '1px solid #fca5a5', background: 'white', cursor: 'pointer', color: '#ef4444', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={newEventType}
                  onChange={e => setNewEventType(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEventType() } }}
                  placeholder="e.g. Naming Ceremony"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={addEventType}
                  style={{ padding: '0 1.25rem', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#2a0000', border: 'none', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: "'Lato', sans-serif", whiteSpace: 'nowrap' }}
                >
                  + Add
                </button>
              </div>
            </div>
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
                      {galleryCategories.map(c => <option key={c} value={c}>{c}</option>)}
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
                      e.target.value = ''
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
          {/* INQUIRIES */}
          {activeTab === 'Inquiries' && (
            <div style={{ maxWidth: '820px' }}>
              <div className="admin-section">
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#2a0000', marginTop: 0, marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '2px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span>Inquiries ({inquiries.length})</span>
                  <button onClick={fetchInquiries} style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.4rem 1rem', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', color: '#6b7280', fontFamily: "'Lato', sans-serif" }}>
                    Refresh
                  </button>
                </h2>

                {inquiriesLoading ? (
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Loading…</p>
                ) : inquiries.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No inquiries yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {inquiries.slice(0, inquiriesVisibleCount).map(inq => (
                      <div key={inq.id} style={{ border: '1px solid #e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                        {/* Header row */}
                        <div
                          onClick={() => setExpandedInquiry(expandedInquiry === inq.id ? null : inq.id)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: expandedInquiry === inq.id ? '#fffdf5' : 'white', cursor: 'pointer', gap: '0.75rem', flexWrap: 'wrap' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2a0000, #550000)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}>
                              {inq.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1f2937', fontFamily: "'Lato', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.name}</p>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontFamily: "'Lato', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.email}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                            {inq.event_type && (
                              <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', background: '#d4af3722', color: '#7a5f06', fontFamily: "'Lato', sans-serif", fontWeight: 700 }}>
                                {inq.event_type}
                              </span>
                            )}
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: "'Lato', sans-serif" }}>
                              {new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{expandedInquiry === inq.id ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {expandedInquiry === inq.id && (
                          <div style={{ padding: '1rem', borderTop: '1px solid #f3f4f6', background: '#fafafa' }}>
                            <div className="admin-grid-2" style={{ marginBottom: '1rem' }}>
                              <div>
                                <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 0.25rem', fontFamily: "'Lato', sans-serif" }}>Email</p>
                                <a href={`mailto:${inq.email}`} style={{ fontSize: '0.85rem', color: '#2a0000', fontFamily: "'Lato', sans-serif" }}>{inq.email}</a>
                              </div>
                              <div>
                                <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 0.25rem', fontFamily: "'Lato', sans-serif" }}>Phone</p>
                                <a href={`tel:${inq.phone}`} style={{ fontSize: '0.85rem', color: '#2a0000', fontFamily: "'Lato', sans-serif" }}>{inq.phone || '—'}</a>
                              </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                              <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 0.25rem', fontFamily: "'Lato', sans-serif" }}>Message</p>
                              <p style={{ fontSize: '0.85rem', color: '#374151', fontFamily: "'Lato', sans-serif", lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{inq.message}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <a
                                href={`mailto:${inq.email}?subject=Re: Your enquiry — Shubha Sparsha`}
                                style={{ padding: '0.4rem 1rem', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#2a0000', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, fontFamily: "'Lato', sans-serif", textDecoration: 'none' }}
                              >
                                Reply via Email
                              </a>
                              <button
                                onClick={() => deleteInquiry(inq.id)}
                                style={{ padding: '0.4rem 1rem', background: 'transparent', color: '#ef4444', border: '1px solid #fca5a5', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Lato', sans-serif" }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!inquiriesLoading && inquiries.length > inquiriesVisibleCount && (
                  <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setInquiriesVisibleCount(c => c + INQUIRIES_PAGE_SIZE)}
                      style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.6rem 1.5rem', border: '1px solid #d4af37', background: 'white', cursor: 'pointer', color: '#7a5f06', fontWeight: 700, fontFamily: "'Lato', sans-serif" }}
                    >
                      Load More ({inquiries.length - inquiriesVisibleCount} remaining)
                    </button>
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
