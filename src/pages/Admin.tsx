import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, Check, Ban, AlertTriangle, Users } from 'lucide-react'

export function Admin() {
  const [pendingList, setPendingList] = useState<any[]>([])
  const [reportsList, setReportsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'reports'>('pending')
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData()
    }
  }, [isAuthenticated])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false)
        .eq('is_banned', false)

      let profiles = data || []
      const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
      const combined = [
        ...profiles,
        ...localProfiles.filter((lp: any) => !profiles.some((dp: any) => dp.id === lp.id) && !lp.is_approved && !lp.is_banned)
      ]
      setPendingList(combined)

      const { data: repData } = await supabase.from('reports').select('*').order('created_at', { ascending: false })
      const localReports = JSON.parse(localStorage.getItem('mopani_reports') || '[]')
      setReportsList([...(repData || []), ...localReports])
    } catch (err) {
      console.warn('Error loading admin data, using local storage fallback:', err)
      const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
      setPendingList(localProfiles.filter((p: any) => !p.is_approved && !p.is_banned))
      setReportsList(JSON.parse(localStorage.getItem('mopani_reports') || '[]'))
    } finally {
      setLoading(false)
    }
  }

  const approveProfile = async (id: string) => {
    try {
      await supabase.from('profiles').update({ is_approved: true }).eq('id', id)
      const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
      const updated = localProfiles.map((p: any) => (p.id === id ? { ...p, is_approved: true } : p))
      localStorage.setItem('mopani_local_profiles', JSON.stringify(updated))

      setPendingList(pendingList.filter((p) => p.id !== id))
      alert('Profile approved and now live in discover feed!')
    } catch (err: any) {
      alert('Error approving: ' + err.message)
    }
  }

  const banProfile = async (id: string) => {
    try {
      await supabase.from('profiles').update({ is_banned: true }).eq('id', id)
      const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
      const updated = localProfiles.map((p: any) => (p.id === id ? { ...p, is_banned: true } : p))
      localStorage.setItem('mopani_local_profiles', JSON.stringify(updated))

      setPendingList(pendingList.filter((p) => p.id !== id))
      alert('Profile banned.')
    } catch (err: any) {
      alert('Error banning: ' + err.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-rose-100 text-center space-y-5">
          <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Admin Portal</h2>
          <p className="text-xs text-gray-500">
            Enter administrator password to access safety moderation and review pending profiles.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (adminPassword === 'Ronald5997') {
                setIsAuthenticated(true)
              } else {
                alert('Invalid Admin Password')
              }
            }}
            className="space-y-4 pt-2"
          >
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-center text-lg tracking-widest font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl shadow-md transition text-sm"
            >
              Access Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-rose-600" /> Admin Safety & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">Review pending profiles and community reports to keep Mopani Singles safe.</p>
        </div>
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'pending' ? 'bg-rose-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" /> Pending Approval ({pendingList.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Reports ({reportsList.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading moderation queue...</div>
      ) : activeTab === 'pending' ? (
        pendingList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <Check className="w-12 h-12 text-rose-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">All caught up!</h3>
            <p className="text-sm text-gray-500">No pending profiles waiting for approval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingList.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md flex flex-col">
                <div className="relative h-56 bg-gray-100">
                  <img src={p.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500'} alt={p.full_name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-amber-500 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">
                    Pending Review
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{p.full_name}, {p.age}</h3>
                    <p className="text-xs text-gray-500 mb-2">{p.village}, {p.municipality} • {p.gender} • {p.intention}</p>
                    <p className="text-xs font-mono text-rose-700 bg-rose-50 px-2 py-1 rounded mb-2">WhatsApp: {p.whatsapp}</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">"{p.bio}"</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => approveProfile(p.id)}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => banProfile(p.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Ban className="w-4 h-4" /> Reject & Ban
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        reportsList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <Check className="w-12 h-12 text-rose-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No Reports</h3>
            <p className="text-sm text-gray-500">No community safety reports submitted.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reportsList.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Reported ID: {r.reported_id}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(r.created_at || Date.now()).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium mt-2">Reason: "{r.reason}"</p>
                </div>
                <button
                  onClick={() => banProfile(r.reported_id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-700 transition shadow-sm whitespace-nowrap"
                >
                  Ban Reported User
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
