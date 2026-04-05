import { useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function LeaveForm() {
  const { user } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ reason: '', from_date: '', to_date: '' })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (new Date(form.to_date) < new Date(form.from_date)) {
      return toast.error('To date cannot be before From date')
    }
    setLoading(true)
    let image_url = null

    if (image) {
      const fileName = `leaves/${user.id}_${Date.now()}`
      const { error: uploadError } = await supabase.storage
        .from('leave-images')
        .upload(fileName, image)
      if (!uploadError) {
        const { data } = supabase.storage.from('leave-images').getPublicUrl(fileName)
        image_url = data.publicUrl
      }
    }

    const { error } = await supabase.from('leaves').insert({
      student_id: user.id,
      student_name: user.name,
      ...form,
      image_url,
      status: 'pending',
    })

    setLoading(false)
    if (error) return toast.error('Failed to submit leave: ' + error.message)
    toast.success('Leave request submitted successfully!')
    setForm({ reason: '', from_date: '', to_date: '' })
    setImage(null)
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Submit Leave Request</h3>
              <p className="text-sm text-white/80">Fill in the details for your leave application</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave*</label>
            <textarea required placeholder="Describe the reason for your leave request..." rows={4}
              value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date*</label>
              <input required type="date" value={form.from_date}
                onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date*</label>
              <input required type="date" value={form.to_date}
                onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attach Image (optional)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-[#0ea5e9] transition cursor-pointer"
              onClick={() => document.getElementById('leave-image').click()}>
              {image ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">{image.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setImage(null) }}
                    className="text-red-400 hover:text-red-600 ml-2">✕</button>
                </div>
              ) : (
                <div className="text-gray-400">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Click to upload image (optional)</p>
                </div>
              )}
              <input id="leave-image" type="file" accept="image/*" className="hidden"
                onChange={(e) => setImage(e.target.files[0])} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white py-3 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
