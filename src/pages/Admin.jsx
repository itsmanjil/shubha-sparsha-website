import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiUser, FiMessageSquare, FiClock, FiLogOut, FiTrash2 } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) navigate('/')
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user) return

    fetchContacts()

    // Realtime subscription — new contact submissions appear instantly
    const channel = supabase
      .channel('contacts-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contacts' },
        (payload) => setContacts((prev) => [payload.new, ...prev])
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  async function fetchContacts() {
    setFetching(true)
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setContacts(data)
    setFetching(false)
  }

  async function deleteContact(id) {
    await supabase.from('contacts').delete().eq('id', id)
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-orange-500 text-xl">Loading…</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back to Site
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <FiLogOut />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Contact Submissions
            <span className="ml-3 text-base font-normal text-gray-500">
              ({contacts.length} total)
            </span>
          </h2>
          <span className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Realtime active
          </span>
        </div>

        {fetching ? (
          <div className="text-center py-20 text-gray-400">Loading submissions…</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FiMessageSquare className="text-5xl mx-auto mb-4 opacity-30" />
            <p>No contact submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <FiUser className="text-orange-500" />
                        <span className="font-semibold text-gray-800">{c.name}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiMail className="text-orange-500" />
                        {c.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiClock className="text-orange-500" />
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed border-l-4 border-orange-200 pl-4">
                      {c.message}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteContact(c.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
