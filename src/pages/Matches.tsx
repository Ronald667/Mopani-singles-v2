import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateCompatibility, MatchResult } from '@/utils/matchingAlgorithm'
import { MOPANI_16_PROFILES } from '@/utils/seedProfiles'
import { Sparkles, Heart, MapPin, MessageCircle, ShieldCheck, Sliders, Check } from 'lucide-react'

const VILLAGES = {
  "Maruleng": ["Lorraine", "Sekororo", "Trichardtsdal", "The Oaks", "Hoedspruit", "Makhutsi"],
  "Greater Tzaneen": ["Tzaneen", "Lenyenye", "Letsitele", "Maake", "Nkowankowa"],
  "Greater Letaba": ["Modjadjiskloof", "Ga-Kgapane", "Mokwakwaila"],
  "Ba-Phalaborwa": ["Phalaborwa", "Namakgale", "Lulekani", "Gravalotte"],
  "Greater Giyani": ["Giyani", "Dzumeri", "Nkomo"]
}

export function Matches({ onStartChat }: { onStartChat: (profileId: string) => void }) {
  const [preferences, setPreferences] = useState({
    intention: 'Marriage',
    municipality: 'Greater Tzaneen',
    language: 'Sepedi',
    age: 27
  })

  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAndCalculateMatches()
  }, [preferences])

  const fetchAndCalculateMatches = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', true)
        .eq('is_banned', false)

      let allProfiles = data || []
      const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
      const combined = [...MOPANI_16_PROFILES, ...localProfiles].filter(p => p.is_approved && !p.is_banned)

      const scored: MatchResult[] = combined.map(candidate => calculateCompatibility(preferences, candidate))
      scored.sort((a, b) => b.score - a.score)

      setMatches(scored)
    } catch (err) {
      console.warn('Error fetching matches:', err)
      const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
      const combined = [...MOPANI_16_PROFILES, ...localProfiles].filter(p => p.is_approved && !p.is_banned)
      const scored = combined.map(candidate => calculateCompatibility(preferences, candidate))
      scored.sort((a, b) => b.score - a.score)
      setMatches(scored)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-700 rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-rose-950/65 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-rose-200 mb-3 border border-rose-500/35">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Compatibility Algorithm
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Smart Matches for You</h1>
          <p className="text-rose-100 text-sm max-w-xl">
            Our intelligent matching algorithm analyzes your preferred location, intention, age range, and bio details to suggest your most compatible partners in Mopani.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 w-full md:w-80 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Your Match Preferences
          </h3>

          <div>
            <label className="block text-[11px] text-rose-200 mb-1">Intention</label>
            <select
              value={preferences.intention}
              onChange={e => setPreferences({ ...preferences, intention: e.target.value })}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="Marriage" className="text-gray-900">Marriage</option>
              <option value="Dating" className="text-gray-900">Dating</option>
              <option value="Friendship" className="text-gray-900">Friendship</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-rose-200 mb-1">Preferred Municipality</label>
            <select
              value={preferences.municipality}
              onChange={e => setPreferences({ ...preferences, municipality: e.target.value })}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              {Object.keys(VILLAGES).map(m => (
                <option key={m} value={m} className="text-gray-900">{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Calculating compatibility scores...</div>
      ) : matches.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">No matches found</h3>
          <p className="text-sm text-gray-500">Try adjusting your preference filters above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((item, index) => {
            const p = item.profile
            return (
              <div key={p.id || index} className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-lg flex flex-col transition hover:scale-[1.01]">
                <div className="relative h-64 bg-gray-200">
                  <img src={p.photo_url} alt={p.full_name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 bg-rose-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {item.score}% Match
                  </div>

                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Verified 18+
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-xl font-bold">{p.full_name}, {p.age}</h3>
                    <p className="text-xs text-rose-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {p.village}, {p.municipality}
                    </p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.matchReasons.map((reason, idx) => (
                        <span key={idx} className="bg-rose-50 text-rose-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Check className="w-3 h-3 text-rose-600" /> {reason}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">"{p.bio}"</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => onStartChat(p.id)}
                      className="flex-1 bg-rose-700 hover:bg-rose-800 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" /> Start Direct Chat
                    </button>
                    <a
                      href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(p.full_name)},%20we%20matched%20on%20Mopani%20Singles!`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
