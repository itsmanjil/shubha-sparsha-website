import { useState } from 'react'
import { FiX, FiMail, FiLock } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } =
      mode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password)

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      if (mode === 'signup') setStatus('check-email')
      else onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div
        className="relative w-full max-w-md p-10"
        style={{ background: '#1a0000', border: '1px solid rgba(212,175,55,0.3)' }}
      >
        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: 'rgba(212,175,55,0.5)' }}
          aria-label="Close"
        >
          <FiX className="text-xl" />
        </button>

        <p
          className="text-xs tracking-[0.4em] uppercase mb-2"
          style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}
        >
          {mode === 'login' ? 'Admin Access' : 'Create Account'}
        </p>
        <h2
          className="text-2xl font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', serif", color: '#f7ecd0' }}
        >
          {mode === 'login' ? 'Sign In' : 'Register'}
        </h2>

        {status === 'check-email' ? (
          <p className="text-center py-6" style={{ color: '#d4af37', fontFamily: "'Lato', sans-serif" }}>
            Check your email to confirm your account.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-xs tracking-[0.2em] uppercase mb-2"
                style={{ color: 'rgba(212,175,55,0.7)', fontFamily: "'Lato', sans-serif" }}
              >
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(212,175,55,0.5)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border focus:outline-none"
                  style={{ borderColor: 'rgba(212,175,55,0.3)', color: '#f7ecd0', fontFamily: "'Lato', sans-serif" }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs tracking-[0.2em] uppercase mb-2"
                style={{ color: 'rgba(212,175,55,0.7)', fontFamily: "'Lato', sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(212,175,55,0.5)' }} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border focus:outline-none"
                  style={{ borderColor: 'rgba(212,175,55,0.3)', color: '#f7ecd0', fontFamily: "'Lato', sans-serif" }}
                />
              </div>
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 text-sm tracking-[0.2em] uppercase font-semibold disabled:opacity-60 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                color: '#2a0000',
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {status === 'loading' ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>

            <p
              className="text-center text-sm"
              style={{ color: 'rgba(247,236,208,0.5)', fontFamily: "'Lato', sans-serif" }}
            >
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrorMsg('') }}
                style={{ color: '#d4af37' }}
                className="hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
