import { useNavigate } from 'react-router-dom'
import { useSiteConfig } from '../contexts/SiteConfigContext'

export default function NotFound() {
  const navigate = useNavigate()
  const { config } = useSiteConfig()
  const { colors } = config
  const lt = colors.lightText || '#f7ecd0'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: colors.maroon }}
    >
      <p
        className="text-7xl md:text-8xl font-bold mb-4"
        style={{ fontFamily: "'Playfair Display', serif", color: colors.gold }}
      >
        404
      </p>
      <h1
        className="text-2xl md:text-3xl font-bold mb-4"
        style={{ fontFamily: "'Playfair Display', serif", color: lt }}
      >
        This page wandered off the guest list
      </h1>
      <p
        className="max-w-md mb-10"
        style={{ color: `${lt}b3`, fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
      >
        The page you're looking for doesn't exist or may have moved. Let's get you back to the celebration.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-3.5 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${colors.gold}, #b8960c)`,
          color: colors.maroon,
          fontFamily: "'Lato', sans-serif",
        }}
      >
        Back to Home
      </button>
    </div>
  )
}
