import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const defaultConfig = {
  colors: {
    maroon: '#2a0000',
    maroon500: '#800000',
    gold: '#d4af37',
    cream: '#fffdf5',
  },
  hero: {
    tagline: 'Est. Since Love',
    title: 'Crafting',
    titleAccent: 'Memories',
    titleItalic: 'That Last Forever',
    subtitle: 'From intimate gatherings to grand celebrations — we orchestrate every detail with elegance, passion, and an auspicious touch.',
  },
  about: {
    subheading: 'Our Story',
    heading: 'Where Tradition Meets Elegance',
    paragraph1: 'Shubha Sparsha — meaning "auspicious touch" — was founded on the belief that every celebration deserves to be extraordinary. We are passionate event planners dedicated to turning your vision into reality.',
    paragraph2: 'From the grandeur of wedding mandaps to the joy of birthday soirées, we bring meticulous attention to detail, creative flair, and genuine care to every event we craft. Our team works closely with you to understand your culture, traditions, and personal style.',
    imageUrl: '',
  },
  stats: [
    { value: '200+', label: 'Events Planned' },
    { value: '8+', label: 'Years of Experience' },
    { value: '500+', label: 'Happy Families' },
    { value: '100%', label: 'Client Satisfaction' },
  ],
  services: [
    { emoji: '💍', title: 'Wedding Planning', subtitle: 'Complete Wedding Management', desc: 'From engagement to reception — we handle every detail so you can be fully present in every precious moment.', tags: ['Venue Selection', 'Decor & Florals', 'Catering', 'Photography'] },
    { emoji: '🎂', title: 'Birthday Celebrations', subtitle: 'Milestone Birthday Parties', desc: 'Elegant, themed birthday events that reflect your personality — from intimate dinners to lavish soirées.', tags: ['Theme Design', 'Entertainment', 'Custom Cakes', 'Guest Management'] },
    { emoji: '🏛️', title: 'Corporate Events', subtitle: 'Professional Event Management', desc: 'Conferences, product launches, award nights — executed with precision, professionalism, and style.', tags: ['AV Setup', 'Branding', 'Hospitality', 'Logistics'] },
    { emoji: '🪔', title: 'Religious Ceremonies', subtitle: 'Pujas & Auspicious Occasions', desc: 'Authentic traditional ceremonies planned with reverence — havan, puja, naming ceremonies, and more.', tags: ['Pandit Arrangement', 'Samagri', 'Mandap Setup', 'Prasad'] },
    { emoji: '🌸', title: 'Engagement Ceremonies', subtitle: 'Roka, Sagai & Ring Ceremonies', desc: 'Set the perfect tone for your love story with a beautifully orchestrated engagement celebration.', tags: ['Ring Exchange Setup', 'Family Coordination', 'Decor', 'Mehendi'] },
    { emoji: '✨', title: 'Social Gatherings', subtitle: 'House Warmings & Anniversaries', desc: 'Every occasion is worth celebrating beautifully — griha pravesh, anniversaries, baby showers, and more.', tags: ['Custom Themes', 'Invitations', 'Decor', 'Catering'] },
  ],
  contactInfo: {
    phone: '9852052172',
    email: 'shubhasparshanp@gmail.com',
    address: 'Nepal',
    instagramHandle: '@shubhasparshanp',
    instagramUrl: 'https://www.instagram.com/shubhasparshanp/',
  },
  footer: {
    tagline: 'Crafting unforgettable celebrations with elegance, tradition, and an auspicious touch.',
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
