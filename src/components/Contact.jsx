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

    const { error } = await supabase.from('contacts').insert([form])

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('success')
    }
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
                style={{ color: '#f7ecd0/70', fontFamily: "'Lato', sans-serif", fontWeight: 300, opacity: 0.7 }}
              >
                Share your vision and we'll craft something truly unforgettable together.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <FiInstagram />, label: 'Instagram', value: '@shubhasparshanp', href: 'https://www.instagram.com/shubhasparshanp/' },
                  { icon: <FiMail />, label: 'Email', value: 'contact@shubhasparsha.com', href: 'mailto:contact@shubhasparsha.com' },
                  { icon: <FiPhone />, label: 'Phone', value: '+977 9852052172', href: 'tel:+9779852052172' },
                  { icon: <FiMapPin />, label: 'Location', value: 'Nepal', href: '#' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5"
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
                        className="hover:text-gold-400 transition-colors"
                        style={{ color: '#f7ecd0', fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-10 pt-8"
              style={{ borderTop: '1px solid rgba(212,175,55,0.2)' }}
            >
              <p
                className="text-xs tracking-[0.3em] uppercase mb-3"
                style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
              >
                Follow Our Work
              </p>
              <a
                href="https://www.instagram.com/shubhasparshanp/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm"
                style={{ color: '#f7ecd0', fontFamily: "'Lato', sans-serif", opacity: 0.8 }}
              >
                <FiInstagram style={{ color: '#d4af37' }} /> @shubhasparshanp
              </a>
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
                      className="w-full px-4 py-3 border-b-2 bg-transparent focus:outline-none transition-colors"
                      style={{
                        borderColor: '#d4af37/30',
                        color: '#2a0000',
                        fontFamily: "'Lato', sans-serif",
                        borderBottomColor: 'rgba(212,175,55,0.4)',
                      }}
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
                      className="w-full px-4 py-3 border-b-2 bg-transparent focus:outline-none transition-colors"
                      style={{
                        borderBottomColor: 'rgba(212,175,55,0.4)',
                        color: '#2a0000',
                        fontFamily: "'Lato', sans-serif",
                      }}
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
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 border-b-2 bg-transparent focus:outline-none transition-colors"
                      style={{
                        borderBottomColor: 'rgba(212,175,55,0.4)',
                        color: '#2a0000',
                        fontFamily: "'Lato', sans-serif",
                      }}
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
                      className="w-full px-4 py-3 border-b-2 bg-transparent focus:outline-none transition-colors"
                      style={{
                        borderBottomColor: 'rgba(212,175,55,0.4)',
                        color: form.event_type ? '#2a0000' : '#9ca3af',
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      <option value="">Select event type</option>
                      {eventTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
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
                    className="w-full px-4 py-3 border-b-2 bg-transparent focus:outline-none resize-none transition-colors"
                    style={{
                      borderBottomColor: 'rgba(212,175,55,0.4)',
                      color: '#2a0000',
                      fontFamily: "'Lato', sans-serif",
                    }}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:gap-5 disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #800000, #550000)',
                    color: '#f7ecd0',
                    fontFamily: "'Lato', sans-serif",
                  }}
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
