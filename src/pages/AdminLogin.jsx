import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/dashboard', { replace: true })
    })
  }, [navigate])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      navigate('/admin/dashboard', { replace: true })
    }
  }

  const input = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid rgba(212,175,55,0.5)',
    outline: 'none',
    fontFamily: "'Lato', sans-serif",
    fontSize: '0.95rem',
    background: 'transparent',
    color: '#2a0000',
    boxSizing: 'border-box',
  }

  const label = {
    display: 'block',
    fontSize: '0.65rem',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: '#7a5f06',
    fontFamily: "'Lato', sans-serif",
    marginBottom: '0.5rem',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2a0000 0%, #550000 50%, #3d2000 100%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700 }}>
            Shubha Sparsha
          </p>
          <p style={{ color: 'rgba(247,236,208,0.45)', fontFamily: "'Lato', sans-serif", fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ background: '#fffdf5', padding: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={label}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={input} />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={input} />
          </div>

          {error && (
            <p style={{ color: '#800000', fontSize: '0.85rem', marginBottom: '1rem', fontFamily: "'Lato', sans-serif" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: loading ? '#c9a832' : 'linear-gradient(135deg, #d4af37, #b8960c)',
              color: '#2a0000',
              fontFamily: "'Lato', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
