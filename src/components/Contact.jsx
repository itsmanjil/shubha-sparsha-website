import { useState } from 'react'
import { FiInstagram, FiMail, FiPhone, FiSend, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import { useSiteConfig } from '../contexts/SiteConfigContext'

const eventTypes = [
  'Wedding', 'Birthday', 'Corporate Event', 'Religious Ceremony', 'Engagement', 'Other'
]

export default function Contact() {
  const { config } = useSiteConfig()
  const { colors, contactInfo, contactSection } = config
  const dt = colors.darkText || '#5c4604'
  const lt = colors.lightText || '#f7ecd0'

  const [form, setForm] = useState({ name: '', email: '', phone: '', event_type: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const sendEmails = () =>
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then((d) => { if (!d.success) console.warn('Email send failed:', d.error) })
      .catch((err) => console.warn('Email send error:', err))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error: dbError } = await supabase.from('contacts').insert([form])
    if (dbError) {
      setErrorMsg(dbError.message)
      setStatus('error')
      return
    }

    setStatus('success')
    sendEmails()
  }

  const contactItems = [
    { icon: <FiInstagram />, label: 'Instagram', value: contactInfo.instagramHandle, href: contactInfo.instagramUrl },
    { icon: <FiMail />, label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { icon: <FiPhone />, label: 'Phone', value: `+977 ${contactInfo.phone}`, href: `tel:+977${contactInfo.phone}` },
    { icon: <FiMapPin />, label: 'Location', value: contactInfo.address, href: '#' },
  ]

  // WhatsApp deep link — pre-fills an inquiry message. Uses the configured
  // whatsapp number if set, otherwise falls back to the contact phone.
  const waNumber = (contactInfo.whatsapp || contactInfo.phone || '').replace(/\D/g, '')
  const waMessage = `Hi Shubha Sparsha! I'd like to inquire about your event planning services.`
  const waLink = `https://wa.me/977${waNumber}?text=${encodeURIComponent(waMessage)}`

  return (
    <section id="contact" className="py-16 md:py-28" style={{ background: colors.cream }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
          >
            {contactSection.label}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: colors.maroon }}
          >
            {contactSection.title}{' '}
            <em style={{ color: colors.maroon500 }}>{contactSection.titleAccent}</em>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: colors.gold }} />
            <span style={{ color: colors.gold }}>✦</span>
            <div className="h-px w-16" style={{ background: colors.gold }} />
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 md:gap-12">
          {/* Info panel */}
          <div
            className="md:col-span-2 p-6 md:p-10 flex flex-col justify-between"
            style={{ background: colors.maroon }}
          >
            <div>
              <h3
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', serif", color: '#f7ecd0' }}
              >
                {contactSection.sidebarHeading}
              </h3>
              <p
                className="mb-10 leading-relaxed"
                style={{ color: `${lt}b3`, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              >
                {contactSection.sidebarSubtitle}
              </p>

              <div className="space-y-6">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                      style={{ background: `${colors.gold}26`, color: colors.gold }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="text-xs tracking-[0.2em] uppercase mb-0.5"
                        style={{ color: colors.gold, fontFamily: "'Lato', sans-serif" }}
                      >
                        {item.label}
                      </p>
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        style={{ color: lt, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full flex items-center justify-center gap-3 px-6 py-3.5 text-sm tracking-[0.15em] uppercase font-semibold transition-all duration-300 hover:opacity-90"
                style={{ background: '#25D366', color: '#0a3d1f', fontFamily: "'Lato', sans-serif" }}
              >
                <FaWhatsapp className="text-xl" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {status === 'success' ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-8 md:p-16 border"
                style={{ borderColor: colors.gold }}
              >
                <div className="text-5xl mb-6">✨</div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: colors.maroon }}
                >
                  Thank You!
                </h3>
                <p style={{ color: dt, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                  We've received your enquiry. A confirmation has been sent to your email — we'll reach out within 24 hours to begin planning your celebration.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-xs tracking-[0.2em] uppercase mb-2"
                      style={{ color: dt, fontFamily: "'Lato', sans-serif" }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-transparent focus:outline-none"
                      style={{ borderBottom: `2px solid ${colors.gold}66`, color: colors.maroon, fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs tracking-[0.2em] uppercase mb-2"
                      style={{ color: dt, fontFamily: "'Lato', sans-serif" }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-transparent focus:outline-none"
                      style={{ borderBottom: `2px solid ${colors.gold}66`, color: colors.maroon, fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-xs tracking-[0.2em] uppercase mb-2"
                      style={{ color: dt, fontFamily: "'Lato', sans-serif" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+977 XXXXXXXXXX"
                      className="w-full px-4 py-3 bg-transparent focus:outline-none"
                      style={{ borderBottom: `2px solid ${colors.gold}66`, color: colors.maroon, fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs tracking-[0.2em] uppercase mb-2"
                      style={{ color: dt, fontFamily: "'Lato', sans-serif" }}
                    >
                      Event Type
                    </label>
                    <select
                      name="event_type"
                      value={form.event_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent focus:outline-none"
                      style={{ borderBottom: `2px solid ${colors.gold}66`, color: form.event_type ? colors.maroon : '#9ca3af', fontFamily: "'Lato', sans-serif" }}
                    >
                      <option value="">Select event type</option>
                      {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: dt, fontFamily: "'Lato', sans-serif" }}
                  >
                    Tell Us About Your Dream Event *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Share your vision, preferred dates, approximate guest count…"
                    className="w-full px-4 py-3 bg-transparent focus:outline-none resize-none"
                    style={{ borderBottom: `2px solid ${colors.gold}66`, color: colors.maroon, fontFamily: "'Lato', sans-serif" }}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:gap-5 disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${colors.maroon500}, #550000)`, color: '#f7ecd0', fontFamily: "'Lato', sans-serif" }}
                >
                  <FiSend />
                  {status === 'loading' ? 'Sending…' : contactSection.submitButton}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
