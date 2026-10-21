import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ReportModal } from '@/components/ReportModal'
import { MOPANI_16_PROFILES } from '@/utils/seedProfiles'
import { MapPin, MessageCircle, ShieldCheck, Heart, Sparkles, Filter, Search } from 'lucide-react'

const VILLAGES = {
  "Maruleng": ["Lorraine", "Sekororo", "Trichardtsdal", "The Oaks", "Hoedspruit", "Makhutsi"],
  "Greater Tzaneen": ["Tzaneen", "Lenyenye", "Letsitele", "Maake", "Nkowankowa"],
  "Greater Letaba": ["Modjadjiskloof", "Ga-Kgapane", "Mokwakwaila"],
  "Ba-Phalaborwa": ["Phalaborwa", "Namakgale", "Lulekani", "Gravalotte"],
  "Greater Giyani": ["Giyani", "Dzumeri", "Nkomo"]
}

export function Discover({ onGoRegister }: { onGoRegister: () => void }) {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMunicipality, setSelectedMunicipality] = useState('')
  const [selectedVillage, setSelectedVillage] = useState('')
  const [selectedIntention, setSelectedIntention] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportingProfile, setReportingProfile] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', true)
        .eq('is_banned', false)
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
        const combined = [...MOPANI_16_PROFILES, ...localProfiles].filter(p => p.is_approved && !p.is_banned)
        setProfiles(combined)
      } else {
        const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
        const combined = [...data, ...localProfiles.filter((lp: any) => !data.some((dp: any) => dp.id === lp.id))]
        setProfiles(combined.filter(p => p.is_approved && !p.is_banned))
      }
    } catch (err) {
      console.warn('Error fetching profiles, using 16 Mopani seed fallback:', err)
      const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
      setProfiles([...MOPANI_16_PROFILES, ...localProfiles].filter(p => p.is_approved && !p.is_banned))
    } finally {
      setLoading(false)
    }
  }

  const filteredProfiles = profiles.filter((p) => {
    if (selectedMunicipality && p.municipality !== selectedMunicipality) return false
    if (selectedVillage && p.village !== selectedVillage) return false
    if (selectedIntention && p.intention !== selectedIntention) return false
    if (selectedGender && p.gender !== selectedGender) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchName = p.full_name?.toLowerCase().includes(q)
      const matchBio = p.bio?.toLowerCase().includes(q)
      const matchVillage = p.village?.toLowerCase().includes(q)
      if (!matchName && !matchBio && !matchVillage) return false
    }
    return true
  })

  const openWhatsApp = (whatsappNumber: string, name: string) => {
    let cleanNum = whatsappNumber.replace(/\D/g, '')
    if (cleanNum.startsWith('0')) {
      cleanNum = '27' + cleanNum.substring(1)
    }
    const message = encodeURIComponent(`Hi ${name}, I saw your profile on Mopani Singles. I would love to connect!`)
    window.open(`https://wa.me/${cleanNum}?text=${message}`, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative bg-gradient-to-r from-rose-900 via-rose-800 to-amber-700 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-rose-950/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-rose-200 mb-4 border border-rose-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 16+ Verified Mopani District Singles
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Find Your Special Someone in Mopani
          </h1>
          <p className="text-rose-100 text-sm md:text-base mb-6 leading-relaxed">
            Connecting singles across Maruleng, Greater Tzaneen, Greater Letaba, Ba-Phalaborwa, and Greater Giyani. Safe, admin-approved profiles with POPIA privacy protection.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onGoRegister}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-6 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 text-sm"
            >
              <Heart className="w-4 h-4 fill-gray-900" /> Create Your Profile Free
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-md border border-rose-100 mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-rose-600" /> Filter Singles ({filteredProfiles.length})
          </h2>
          {(selectedMunicipality || selectedVillage || selectedIntention || selectedGender || searchQuery) && (
            <button
              onClick={() => {
                setSelectedMunicipality('')
                setSelectedVillage('')
                setSelectedIntention('')
                setSelectedGender('')
                setSearchQuery('')
              }}
              className="text-xs text-rose-700 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <select
            value={selectedMunicipality}
            onChange={(e) => {
              setSelectedMunicipality(e.target.value)
              setSelectedVillage('')
            }}
            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Municipalities</option>
            {Object.keys(VILLAGES).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            disabled={!selectedMunicipality}
            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
          >
            <option value="">All Villages / Towns</option>
            {selectedMunicipality &&
              (VILLAGES as any)[selectedMunicipality]?.map((v: string) => (
                <option key={v} value={v}>{v}</option>
              ))}
          </select>

          <select
            value={selectedIntention}
            onChange={(e) => setSelectedIntention(e.target.value)}
            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Intentions</option>
            <option value="Marriage">Marriage</option>
            <option value="Dating">Dating</option>
            <option value="Friendship">Friendship</option>
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading verified Mopani singles...</div>
      ) : filteredProfiles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">No profiles found</h3>
          <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or be the first to create a profile in this area!</p>
          <button
            onClick={onGoRegister}
            className="bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md"
          >
            Create Profile Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-64 w-full bg-gray-200 overflow-hidden">
                <img
                  src={p.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500'}
                  alt={p.full_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Verified 18+
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-rose-700/90 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-bold">
                    {p.intention || 'Dating'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {p.full_name}, {p.age}
                  </h3>
                  <p className="text-xs text-rose-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {p.village}, {p.municipality}
                  </p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 font-medium">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">Language: {p.language || 'Sepedi'}</span>
                    <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-semibold">
                      {p.gender}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    "{p.bio}"
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setReportingProfile({ id: p.id, name: p.full_name })
                      setReportModalOpen(true)
                    }}
                    className="text-xs text-gray-400 hover:text-red-600 underline transition"
                  >
                    Report
                  </button>

                  <button
                    onClick={() => openWhatsApp(p.whatsapp, p.full_name)}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-rose-600" /> WhatsApp Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reportingProfile && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => {
            setReportModalOpen(false)
            setReportingProfile(null)
          }}
          reportedId={reportingProfile.id}
          reportedName={reportingProfile.name}
        />
      )}
    </div>
  )
}
