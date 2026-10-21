import { ShieldAlert, CheckCircle2, AlertTriangle, Users, MapPin, Heart } from 'lucide-react'

export function Safety() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-100 space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Safety & Community Rules</h1>
          <p className="text-sm text-gray-500 mt-2">
            Mopani Singles is dedicated to a safe, respectful, and genuine matchmaking experience for everyone in Limpopo.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="flex gap-4 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 font-bold">
              18+
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Strictly 18 Years and Older</h3>
              <p className="text-xs text-gray-600 mt-1">
                All members must be 18 years or older. Age verification and manual admin checks are enforced on every single registration.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-amber-50/60 border border-amber-100">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold">
              🚫
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">No Nude or Inappropriate Content</h3>
              <p className="text-xs text-gray-600 mt-1">
                Explicit images, nudity, and suggestive adult content are strictly prohibited. Profiles violating this rule are instantly banned and removed.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-red-50/60 border border-red-100">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 font-bold">
              💰
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Scam & Money Request Prevention</h3>
              <p className="text-xs text-gray-600 mt-1">
                Never send money, airtime, or financial gifts to anyone you meet online. Report any suspicious behavior or financial requests immediately using the Report button on profiles.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-blue-50/60 border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
              📍
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Meet in Public & Stay Safe</h3>
              <p className="text-xs text-gray-600 mt-1">
                When meeting someone in person for the first time in Maruleng, Tzaneen, Letaba, Phalaborwa, or Giyani, always choose a busy public place (like a mall or restaurant) and inform a trusted friend or family member.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Every profile features a report button for immediate community protection. Admins review all reports within 24 hours.
          </p>
        </div>
      </div>
    </div>
  )
}
