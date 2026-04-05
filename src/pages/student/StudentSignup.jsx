import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function StudentSignup() {
  const [form, setForm] = useState({ cnic: '', roll_number: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)

    // Check if student is pre-added by admin
    const { data: existing } = await supabase
      .from('students')
      .select('id, is_active')
      .eq('cnic', form.cnic)
      .eq('roll_number', form.roll_number)
      .single()

    if (!existing) {
      setLoading(false)
      return toast.error('You are not registered. Please contact admin.')
    }

    if (existing.is_active) {
      setLoading(false)
      return toast.error('Account already activated. Please login.')
    }

    // Update password to activate account
    const { error } = await supabase
      .from('students')
      .update({ password: form.password, is_active: true })
      .eq('id', existing.id)

    setLoading(false)
    if (error) return toast.error('Signup failed. Try again.')
    toast.success('Account activated! Please login.')
    navigate('/student/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png"
            alt="SMIT" className="h-14 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Student Signup</h2>
          <p className="text-sm text-gray-500">Only admin-registered students can sign up</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-2">
          <svg className="w-4 h-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-blue-700">Your CNIC and Roll Number must be registered by admin before you can sign up.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CNIC (without dashes)</label>
            <input required placeholder="e.g. 4210112345671"
              value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
            <input required placeholder="Enter your roll number"
              value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input required type="password" placeholder="Create a password (min 6 chars)"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input required type="password" placeholder="Confirm your password"
              value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white py-3 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50">
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-500">
          Already have an account?{' '}
          <span onClick={() => navigate('/student/login')} className="text-[#0ea5e9] cursor-pointer hover:underline font-medium">
            Login
          </span>
        </p>
        <p className="text-sm text-center mt-2 text-gray-500">
          <span onClick={() => navigate('/home')} className="text-gray-400 cursor-pointer hover:underline">
            ← Back to Home
          </span>
        </p>
      </div>
    </div>
  )
}
