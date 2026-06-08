import { useState } from 'react'
import { FiInstagram, FiMail, FiPhone, FiSend, FiMapPin } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const eventTypes = [
  'Wedding', 'Birthday', 'Corporate Event', 'Religious Ceremony', 'Engagement', 'Other'
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', event_type: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    // 1. Save to Supabase database
    const { error: dbError } = await supabase.from('contacts').insert([form])
    if (dbError) {
      setErrorMsg(dbError.message)
      setStatus('error')
      return
    }

    // 2. Send email notification via Web3Forms
    const emailRes = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: import.meta.env.VITE_WEB3FORMS_KEY,
        subject: `New Enquiry from ${form.name} — ${form.event_type || 'Event Planning'}`,
        from_name: 'Shubha Sparsha Website',
        name: form.name,
        email: form.email,
        phone: form.phone,
        event_type: form.event_type,
        message: form.message,
      }),
    })

    const emailData = await emailRes.json()
    if (!emailData.success) {
      // DB saved successfully — don't block the user, just log the email failure
      console.warn('Email notification failed:', emailData.message)
    }

    setStatus('success')
  }

  return (
    <section id="contact" className="py-28" style={{ background: '#fffdf5' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
          >
            Let's Plan Together
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2a0000' }}
          >
            Begin Your{' '}
            <em style={{ color: '#800000' }}>Celebration</em>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: '#d4af37' }} />
            <span style={{ color: '#d4af37' }}>✦</span>
            <div className="h-px w-16" style={{ background: '#d4af37' }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info panel */}
          <div
            className="lg:col-span-2 p-10 flex flex-col justify-between"
            style={{ background: '#2a0000' }}
          >
            <div>
              <h3
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "'Playfair Display', serif", color: '#f7ecd0' }}
              >
                Get In Touch
              </h3>
              <p
                className="mb-10 leading-relaxed"
                style={{ color: 'rgba(247,236,208,0.7)', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              >
                Share your vision and we'll craft something truly unforgettable together.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <FiInstagram />, label: 'Instagram', value: '@shubhasparshanp', href: 'https://www.instagram.com/shubhasparshanp/' },
                  { icon: <FiMail />, label: 'Email', value: 'shubhasparshanp@gmail.com', href: 'mailto:shubhasparshanp@gmail.com' },
                  { icon: <FiPhone />, label: 'Phone', value: '+977 9852052172', href: 'tel:+9779852052172' },
                  { icon: <FiMapPin />, label: 'Location', value: 'Nepal', href: '#' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="text-xs tracking-[0.2em] uppercase mb-0.5"
                        style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
                      >
                        {item.label}
                      </p>
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        style={{ color: '#f7ecd0', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {status === 'success' ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-16 border"
                style={{ borderColor: '#d4af37' }}
              >
                <div className="text-5xl mb-6">✨</div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2a0000' }}
                >
                  Thank You!
                </h3>
                <p style={{ color: '#5c4604', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}>
                  We've received your enquiry and will reach out within 24 hours to begin planning your celebration.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-xs tracking-[0.2em] uppercase mb-2"
                      style={{ color: '#7a5f06', fontFamily: "'Lato', sans-serif" }}
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
                      style={{ borderBottom: '2px solid rgba(212,175,55,0.4)', color: '#2a0000', fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs tracking-[0.2em] uppercase mb-2"
                      style={{ color: '#7a5f06', fontFamily: "'Lato', sans-serif" }}
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
                      style={{ borderBottom: '2px solid rgba(212,175,55,0.4)', color: '#2a0000', fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-xs tracking-[0.2em] uppercase mb-2"
                      style={{ color: '#7a5f06', fontFamily: "'Lato', sans-serif" }}
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
                      style={{ borderBottom: '2px solid rgba(212,175,55,0.4)', color: '#2a0000', fontFamily: "'Lato', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs tracking-[0.2em] uppercase mb-2"
                      style={{ color: '#7a5f06', fontFamily: "'Lato', sans-serif" }}
                    >
                      Event Type
                    </label>
                    <select
                      name="event_type"
                      value={form.event_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent focus:outline-none"
                      style={{ borderBottom: '2px solid rgba(212,175,55,0.4)', color: form.event_type ? '#2a0000' : '#9ca3af', fontFamily: "'Lato', sans-serif" }}
                    >
                      <option value="">Select event type</option>
                      {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: '#7a5f06', fontFamily: "'Lato', sans-serif" }}
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
                    style={{ borderBottom: '2px solid rgba(212,175,55,0.4)', color: '#2a0000', fontFamily: "'Lato', sans-serif" }}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:gap-5 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #800000, #550000)', color: '#f7ecd0', fontFamily: "'Lato', sans-serif" }}
                >
                  <FiSend />
                  {status === 'loading' ? 'Sending…' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
