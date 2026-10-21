import React, { useState, useEffect } from 'react'
import { ImageCropperModal } from '@/components/ImageCropperModal'
import { User, Edit3, ShieldCheck, MapPin, Camera, Check, Trash2 } from 'lucide-react'

const VILLAGES = {
  "Maruleng": ["Lorraine", "Sekororo", "Trichardtsdal", "The Oaks", "Hoedspruit", "Makhutsi"],
  "Greater Tzaneen": ["Tzaneen", "Lenyenye", "Letsitele", "Maake", "Nkowankowa"],
  "Greater Letaba": ["Modjadjiskloof", "Ga-Kgapane", "Mokwakwaila"],
  "Ba-Phalaborwa": ["Phalaborwa", "Namakgale", "Lulekani", "Gravalotte"],
  "Greater Giyani": ["Giyani", "Dzumeri", "Nkomo"]
}

export function MyProfile({ onGoRegister }: { onGoRegister: () => void }) {
  const [myProfile, setMyProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    loadMyProfile()
  }, [])

  const loadMyProfile = () => {
    const saved = localStorage.getItem('mopani_my_profile')
    if (saved) {
      const parsed = JSON.parse(saved)
      setMyProfile(parsed)
      setFormData(parsed)
    }
  }

  const handleCropComplete = (croppedBase64: string) => {
    setFormData({ ...formData, photo_url: croppedBase64 })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    localStorage.setItem('mopani_my_profile', JSON.stringify(formData))

    const localProfiles = JSON.parse(localStorage.getItem('mopani_local_profiles') || '[]')
    const index = localProfiles.findIndex((p: any) => p.whatsapp === formData.whatsapp || p.id === formData.id)
    if (index >= 0) {
      localProfiles[index] = formData
    } else {
      localProfiles.push(formData)
    }
    localStorage.setItem('mopani_local_profiles', JSON.stringify(localProfiles))

    setMyProfile(formData)
    setIsEditing(false)
    alert('Your profile has been updated successfully!')
  }

  const handleDeleteProfile = () => {
    if (!confirm('Are you sure you want to delete your profile?')) return
    localStorage.removeItem('mopani_my_profile')
    setMyProfile(null)
    setFormData(null)
    alert('Profile deleted.')
  }

  if (!myProfile) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-rose-100 space-y-5">
          <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">No Profile Found</h2>
          <p className="text-xs text-gray-500">
            You haven't created your Mopani Singles profile yet, or it was cleared from this browser session.
          </p>
          <button
            onClick={onGoRegister}
            className="w-full bg-rose-700 hover:bg-rose-800 text-white font-bold py-3 rounded-2xl shadow-md transition text-sm"
          >
            Create Your Profile Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-700 p-8 text-white relative">
          <div className="flex justify-between items-start">
            <div className="inline-flex items-center gap-2 bg-rose-950/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-rose-200 border border-rose-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> One Profile Per User (Active)
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/25 hover:bg-white/35 text-white font-semibold px-4 py-2 rounded-xl text-xs backdrop-blur-md transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pb-8 pt-0 relative">
          <div className="-mt-16 mb-4 flex justify-between items-end">
            <img
              src={myProfile.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500'}
              alt={myProfile.full_name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
            />
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${myProfile.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {myProfile.is_approved ? 'Approved & Live' : 'Pending Safety Review'}
            </span>
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-gray-900">{myProfile.full_name}, {myProfile.age}</h1>
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {myProfile.village}, {myProfile.municipality} • {myProfile.language}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-xl">
                  Intention: {myProfile.intention}
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-xl">
                  Gender: {myProfile.gender}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">My Bio</h3>
                <p className="text-sm text-gray-800 leading-relaxed">"{myProfile.bio}"</p>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-rose-900">Private WhatsApp Number</h3>
                  <p className="text-xs text-gray-600 font-mono mt-0.5">{myProfile.whatsapp}</p>
                </div>
                <button
                  onClick={handleDeleteProfile}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Edit Your Profile</h2>

              <div className="flex items-center gap-4">
                <img src={formData.photo_url} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-rose-600" />
                <button
                  type="button"
                  onClick={() => setCropperOpen(true)}
                  className="bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" /> Change Photo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Age</label>
                  <select
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white"
                  >
                    {Array.from({ length: 53 }, (_, i) => i + 18).map(ageNum => (
                      <option key={ageNum} value={ageNum}>{ageNum} Years Old</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Municipality</label>
                  <select
                    value={formData.municipality}
                    onChange={e => {
                      const mun = e.target.value
                      const firstVil = (VILLAGES as any)[mun]?.[0] || ''
                      setFormData({ ...formData, municipality: mun, village: firstVil })
                    }}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white"
                  >
                    {Object.keys(VILLAGES).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Village</label>
                  <select
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full border rounded-xl p-2.5 text-sm bg-white"
                  >
                    {(VILLAGES as any)[formData.municipality]?.map((v: string) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Intention</label>
                <select
                  value={formData.intention}
                  onChange={e => setFormData({ ...formData, intention: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-sm bg-white"
                >
                  <option value="Marriage">Marriage</option>
                  <option value="Dating">Dating</option>
                  <option value="Friendship">Friendship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bio (max 200 chars)</label>
                <textarea
                  maxLength={200}
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border rounded-xl p-2.5 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-700 hover:bg-rose-800 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  )
}
