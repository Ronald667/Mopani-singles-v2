import { Lock, ShieldCheck } from 'lucide-react'

export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-100 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">POPIA Privacy Policy</h1>
          <p className="text-xs text-gray-500 mt-2">
            Protection of Personal Information Act (POPIA) Compliance Statement
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            Mopani Singles collects and processes personal information (first name, age, municipality, village, relationship intention, bio, photo, and private WhatsApp number) solely for verified matchmaking and community connection within the Mopani District of Limpopo, South Africa.
          </p>

          <h3 className="font-bold text-gray-900 pt-2">Data Security & Privacy</h3>
          <p>
            Your WhatsApp number is stored securely and is <strong className="text-gray-900">never shown publicly</strong>. It is only utilized when another member clicks the direct WhatsApp chat button to start a conversation with you. Photos are stored securely in Supabase storage and optimized for community display.
          </p>

          <h3 className="font-bold text-gray-900 pt-2">Your Rights under POPIA</h3>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Right to access: You can request access to your personal profile data at any time.</li>
            <li>Right to correction: You can request updates or corrections to your information.</li>
            <li>Right to deletion (Right to be forgotten): You can request complete deletion of your profile and personal data anytime via our Delete Data page.</li>
          </ul>

          <h3 className="font-bold text-gray-900 pt-2">Data Retention</h3>
          <p>
            Profiles inactive for over 12 months are automatically archived and purged. We do not sell, rent, or share your personal data with third-party marketers.
          </p>
        </div>
      </div>
    </div>
  )
}
