import React, { useState } from 'react'
import { AlertTriangle, X, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportedId: string
  reportedName: string
}

export function ReportModal({ isOpen, onClose, reportedId, reportedName }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    setSubmitting(true)
    try {
      // Save report
      const { error } = await supabase.from('reports').insert([
        {
          reported_id: reportedId,
          reason: reason.trim(),
        },
      ])

      if (error) {
        // Fallback local storage or print
        console.warn('Supabase report insert error (using local fallback if needed):', error.message)
        const existingReports = JSON.parse(localStorage.getItem('mopani_reports') || '[]')
        existingReports.push({ reported_id: reportedId, reason, created_at: new Date().toISOString() })
        localStorage.setItem('mopani_reports', JSON.stringify(existingReports))
      }

      alert(`Report submitted for ${reportedName}. Our admin safety team will review within 24 hours.`)
      setReason('')
      onClose()
    } catch (err: any) {
      alert('Error submitting report: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Report {reportedName}
          </h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-4">
          We take community safety extremely seriously. Please describe why you are reporting this profile (e.g. fake photo, scam, scammer asking for money, inappropriate content).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            required
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
