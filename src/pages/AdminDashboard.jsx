import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSiteConfig } from '../contexts/SiteConfigContext'

const TABS = ['Colors', 'Hero', 'About', 'Stats', 'Services', 'Contact', 'Footer']

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
    <div style={{ background: 'white', padding: '2rem', maxWidth: '820px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
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

  // Local state for each section — seeded from config
  const [colors, setColors] = useState({ ...config.colors })
  const [hero, setHero] = useState({ ...config.hero })
  const [about, setAbout] = useState({ ...config.about })
  const [stats, setStats] = useState(config.stats.map(s => ({ ...s })))
  const [services, setServices] = useState(
    config.services.map(s => ({ ...s, tags: Array.isArray(s.tags) ? s.tags.join(', ') : s.tags }))
  )
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
      {/* Header */}
      <header style={{ background: '#2a0000', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
          <span style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>
            Shubha Sparsha
          </span>
          <span style={{ color: 'rgba(247,236,208,0.4)', fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            Admin Dashboard
          </span>
        </div>
        <button
          onClick={handleSignOut}
          style={{ padding: '0.45rem 1.1rem', border: '1px solid rgba(212,175,55,0.4)', color: 'rgba(212,175,55,0.85)', background: 'transparent', fontSize: '0.72rem', letterSpacing: '0.15em', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '190px', background: 'white', borderRight: '1px solid #e5e7eb', flexShrink: 0, paddingTop: '1rem' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.75rem' }}>
                <ColorPicker label="Dark Maroon (backgrounds)" value={colors.maroon} onChange={v => setColors(p => ({ ...p, maroon: v }))} />
                <ColorPicker label="Medium Maroon (accents)" value={colors.maroon500} onChange={v => setColors(p => ({ ...p, maroon500: v }))} />
                <ColorPicker label="Gold (primary accent)" value={colors.gold} onChange={v => setColors(p => ({ ...p, gold: v }))} />
                <ColorPicker label="Cream (section backgrounds)" value={colors.cream} onChange={v => setColors(p => ({ ...p, cream: v }))} />
              </div>
            </Section>
          )}

          {/* HERO */}
          {activeTab === 'Hero' && (
            <Section title="Hero Section" onSave={() => doSave('hero', hero)} saving={saving}>
              <Field label="Tagline (small text above title)" value={hero.tagline} onChange={v => setHero(p => ({ ...p, tagline: v }))} />
              <Field label="Title — first word(s)" value={hero.title} onChange={v => setHero(p => ({ ...p, title: v }))} />
              <Field label="Title — gold accent word" value={hero.titleAccent} onChange={v => setHero(p => ({ ...p, titleAccent: v }))} />
              <Field label="Title — italic second line" value={hero.titleItalic} onChange={v => setHero(p => ({ ...p, titleItalic: v }))} />
              <Field label="Subtitle paragraph" value={hero.subtitle} onChange={v => setHero(p => ({ ...p, subtitle: v }))} multiline />
            </Section>
          )}

          {/* ABOUT */}
          {activeTab === 'About' && (
            <Section title="About Section" onSave={() => doSave('about', about)} saving={saving}>
              <Field label="Subheading (small label)" value={about.subheading} onChange={v => setAbout(p => ({ ...p, subheading: v }))} />
              <Field label="Main heading" value={about.heading} onChange={v => setAbout(p => ({ ...p, heading: v }))} />
              <Field label="Paragraph 1" value={about.paragraph1} onChange={v => setAbout(p => ({ ...p, paragraph1: v }))} multiline />
              <Field label="Paragraph 2" value={about.paragraph2} onChange={v => setAbout(p => ({ ...p, paragraph2: v }))} multiline />
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
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem', marginBottom: '1rem', alignItems: 'start' }}>
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
            <Section title="Services" onSave={saveServices} saving={saving}>
              {services.map((svc, i) => (
                <div key={i} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fafafa', border: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', marginBottom: '1.25rem', fontWeight: 700 }}>
                    Service {i + 1}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr', gap: '1rem' }}>
                    <Field label="Emoji" value={svc.emoji} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, emoji: v } : s))} />
                    <Field label="Title" value={svc.title} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, title: v } : s))} />
                    <Field label="Subtitle" value={svc.subtitle} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, subtitle: v } : s))} />
                  </div>
                  <Field label="Description" value={svc.desc} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, desc: v } : s))} multiline />
                  <Field label="Tags (comma-separated)" value={svc.tags} onChange={v => setServices(prev => prev.map((s, j) => j === i ? { ...s, tags: v } : s))} />
                </div>
              ))}
            </Section>
          )}

          {/* CONTACT */}
          {activeTab === 'Contact' && (
            <Section title="Contact Information" onSave={() => doSave('contactInfo', contactInfo)} saving={saving}>
              <Field label="Phone number" value={contactInfo.phone} onChange={v => setContactInfo(p => ({ ...p, phone: v }))} />
              <Field label="Email address" value={contactInfo.email} onChange={v => setContactInfo(p => ({ ...p, email: v }))} />
              <Field label="Location / Address" value={contactInfo.address} onChange={v => setContactInfo(p => ({ ...p, address: v }))} />
              <Field label="Instagram handle (e.g. @shubhasparshanp)" value={contactInfo.instagramHandle} onChange={v => setContactInfo(p => ({ ...p, instagramHandle: v }))} />
              <Field label="Instagram URL" value={contactInfo.instagramUrl} onChange={v => setContactInfo(p => ({ ...p, instagramUrl: v }))} />
            </Section>
          )}

          {/* FOOTER */}
          {activeTab === 'Footer' && (
            <Section title="Footer" onSave={() => doSave('footer', footer)} saving={saving}>
              <Field label="Brand tagline" value={footer.tagline} onChange={v => setFooter(p => ({ ...p, tagline: v }))} multiline />
              <Field label="Bottom bar text (right side)" value={footer.bottomText} onChange={v => setFooter(p => ({ ...p, bottomText: v }))} />
            </Section>
          )}
        </main>
      </div>
    </div>
  )
}
