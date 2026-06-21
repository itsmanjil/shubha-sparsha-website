import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const defaultConfig = {
  colors: {
    maroon: '#2a0000',
    maroon500: '#800000',
    gold: '#d4af37',
    cream: '#fffdf5',
    lightText: '#f7ecd0',
    darkText: '#5c4604',
  },
  navbar: {
    brandName: 'Shubha Sparsha',
    brandSubtitle: 'Event Planning',
    ctaButton: 'Book Now',
    logoUrl: '',
    pageTitle: 'Shubha Sparsha — Event Planning',
  },
  hero: {
    tagline: 'Est. Since Love',
    title: 'Crafting',
    titleAccent: 'Memories',
    titleItalic: 'That Last Forever',
    subtitle: 'From intimate gatherings to grand celebrations — we orchestrate every detail with elegance, passion, and an auspicious touch.',
    servicesButton: 'Our Services',
    quoteButton: 'Get a Free Quote',
    sliderInterval: 5,
  },
  heroSlides: [],
  about: {
    subheading: 'Our Story',
    heading: 'Where Tradition Meets Elegance',
    paragraph1: 'Shubha Sparsha — meaning "auspicious touch" — was founded on the belief that every celebration deserves to be extraordinary. We are passionate event planners dedicated to turning your vision into reality.',
    paragraph2: 'From the grandeur of wedding mandaps to the joy of birthday soirées, we bring meticulous attention to detail, creative flair, and genuine care to every event we craft. Our team works closely with you to understand your culture, traditions, and personal style.',
    imageUrl: '',
    followLinkText: "Let's Plan Together",
  },
  stats: [
    { value: '200+', label: 'Events Planned' },
    { value: '8+', label: 'Years of Experience' },
    { value: '500+', label: 'Happy Families' },
    { value: '100%', label: 'Client Satisfaction' },
  ],
  servicesSection: {
    label: 'What We Do',
    title: 'Our',
    titleAccent: 'Services',
    desc: 'Comprehensive event planning services tailored to your vision and traditions.',
  },
  services: [
    { emoji: '💍', title: 'Wedding Planning', subtitle: 'Complete Wedding Management', desc: 'From engagement to reception — we handle every detail so you can be fully present in every precious moment.', tags: ['Venue Selection', 'Decor & Florals', 'Catering', 'Photography'] },
    { emoji: '🎂', title: 'Birthday Celebrations', subtitle: 'Milestone Birthday Parties', desc: 'Elegant, themed birthday events that reflect your personality — from intimate dinners to lavish soirées.', tags: ['Theme Design', 'Entertainment', 'Custom Cakes', 'Guest Management'] },
    { emoji: '🏛️', title: 'Corporate Events', subtitle: 'Professional Event Management', desc: 'Conferences, product launches, award nights — executed with precision, professionalism, and style.', tags: ['AV Setup', 'Branding', 'Hospitality', 'Logistics'] },
    { emoji: '🪔', title: 'Religious Ceremonies', subtitle: 'Pujas & Auspicious Occasions', desc: 'Authentic traditional ceremonies planned with reverence — havan, puja, naming ceremonies, and more.', tags: ['Pandit Arrangement', 'Samagri', 'Mandap Setup', 'Prasad'] },
    { emoji: '🌸', title: 'Engagement Ceremonies', subtitle: 'Roka, Sagai & Ring Ceremonies', desc: 'Set the perfect tone for your love story with a beautifully orchestrated engagement celebration.', tags: ['Ring Exchange Setup', 'Family Coordination', 'Decor', 'Mehendi'] },
    { emoji: '✨', title: 'Social Gatherings', subtitle: 'House Warmings & Anniversaries', desc: 'Every occasion is worth celebrating beautifully — griha pravesh, anniversaries, baby showers, and more.', tags: ['Custom Themes', 'Invitations', 'Decor', 'Catering'] },
  ],
  portfolioSection: {
    label: 'Featured Work',
    title: 'Signature',
    titleAccent: 'Celebrations',
    desc: 'A closer look at a few celebrations we have brought to life.',
  },
  portfolio: [
    { coverImage: '', type: 'Wedding', name: 'A Grand Traditional Wedding', description: 'A three-day celebration blending sacred rituals with modern elegance — from the mandap ceremony to a breathtaking reception, every detail orchestrated with care.' },
    { coverImage: '', type: 'Corporate Event', name: 'Annual Awards Night', description: 'A polished corporate gala with bespoke stage design, branding, and seamless hospitality for over 300 guests.' },
    { coverImage: '', type: 'Religious Ceremony', name: 'Auspicious Griha Pravesh', description: 'A serene house-warming ceremony with authentic puja arrangements, traditional décor, and warm family hospitality.' },
  ],
  processSection: {
    label: 'How We Work',
    title: 'Your Journey With',
    titleAccent: 'Us',
  },
  processSteps: [
    { number: '01', title: 'Consult', desc: 'Share your vision, traditions, and budget with us in a free initial consultation.' },
    { number: '02', title: 'Plan', desc: 'We craft a detailed plan covering venue, décor, catering, and every logistic in between.' },
    { number: '03', title: 'Coordinate', desc: 'Our team manages vendors and timelines so you can stay present in the moment.' },
    { number: '04', title: 'Celebrate', desc: 'You enjoy the celebration while we handle every detail behind the scenes.' },
  ],
  testimonialsSection: {
    label: 'Kind Words',
    title: 'What Our',
    titleAccent: 'Clients Say',
  },
  testimonials: [
    { name: 'Priya & Rajan Sharma', eventType: 'Wedding', quote: 'Shubha Sparsha made our wedding day absolutely magical. Every detail, from the mandap to the reception, was handled with such care and elegance. We could not have asked for a better team.', photoUrl: '' },
    { name: 'Anita Gurung', eventType: 'Birthday', quote: 'They planned my daughter\'s birthday party and it exceeded every expectation. Professional, creative, and so easy to work with throughout.', photoUrl: '' },
    { name: 'Bikash Poudel', eventType: 'Corporate Event', quote: 'Our annual awards night was flawless thanks to their team. The attention to detail and on-the-day coordination was outstanding.', photoUrl: '' },
  ],
  gallerySection: {
    label: 'Our Work',
    title: 'Event',
    titleAccent: 'Portfolio',
    instagramButton: 'View Full Portfolio on Instagram',
  },
  contactInfo: {
    phone: '9852052172',
    whatsapp: '',
    email: 'shubhasparshanp@gmail.com',
    address: 'Nepal',
    instagramHandle: '@shubhasparshanp',
    instagramUrl: 'https://www.instagram.com/shubhasparshanp/',
  },
  contactSection: {
    label: "Let's Plan Together",
    title: 'Begin Your',
    titleAccent: 'Celebration',
    sidebarHeading: 'Get In Touch',
    sidebarSubtitle: "Share your vision and we'll craft something truly unforgettable together.",
    submitButton: 'Send Enquiry',
  },
  footer: {
    brandName: 'Shubha Sparsha',
    brandSubtitle: 'Event Planning',
    tagline: 'Crafting unforgettable celebrations with elegance, tradition, and an auspicious touch.',
    copyright: 'Shubha Sparsha. All rights reserved.',
    bottomText: 'Crafted with love in Nepal',
  },
}

const SiteConfigContext = createContext({ config: defaultConfig, saveConfig: async () => {} })

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig)

  useEffect(() => {
    supabase.from('site_config').select('*').then(({ data }) => {
      if (!data?.length) return
      const merged = { ...defaultConfig }
      for (const row of data) {
        if (row.key in merged) merged[row.key] = row.value
      }
      setConfig(merged)
    })
  }, [])

  useEffect(() => {
    if (config.navbar.pageTitle) document.title = config.navbar.pageTitle
    const icon = document.querySelector('link[rel="icon"]')
    if (icon && config.navbar.logoUrl) icon.href = config.navbar.logoUrl
  }, [config.navbar.pageTitle, config.navbar.logoUrl])

  async function saveConfig(key, value) {
    await supabase
      .from('site_config')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <SiteConfigContext.Provider value={{ config, saveConfig }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}
