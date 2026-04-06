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

    const { data: existing } = await supabase
      .from('students').select('id, password, status')
      .eq('cnic', form.cnic).eq('roll_number', form.roll_number).single()

    if (!existing) { setLoading(false); return toast.error('CNIC or Roll Number not found. Please contact admin.') }
    if (existing.status === 'dropout') { setLoading(false); return toast.error('Account has been deactivated. Please contact admin.') }
    if (existing.password) { setLoading(false); return toast.error('Account already activated. Please login with your password.') }

    const { error } = await supabase.from('students')
      .update({ password: form.password, is_active: true }).eq('id', existing.id)

    setLoading(false)
    if (error) return toast.error('Signup failed: ' + error.message)
    toast.success('Account activated! You can now login.')
    navigate('/student/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #0ea5e920 0%, transparent 50%), radial-gradient(circle at 80% 80%, #5ab87d20 0%, transparent 50%)' }} />

      <div className="bg-white rounded-3xl w-full max-w-md relative overflow-hidden"
        style={{ boxShadow: '0 25px 60px rgba(14,165,233,0.15)' }}>
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }} />

        <div className="p-8 md:p-10">
          <div className="text-center mb-6">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png"
              alt="SMIT" className="h-12 mx-auto mb-5" />
            <h2 className="text-2xl font-black text-gray-800 mb-1">Create Account</h2>
            <p className="text-sm text-gray-400">Activate your student account</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 mb-6 flex items-start gap-2.5">
            <svg className="w-4 h-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-blue-600 leading-relaxed">Your CNIC and Roll Number must be registered by admin. Roll Number is provided after registration approval.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {[
              { key: 'cnic', label: 'CNIC (without dashes)', placeholder: 'e.g. 4210112345671' },
              { key: 'roll_number', label: 'Roll Number', placeholder: 'e.g. SMIT-2026-4823' },
              { key: 'password', label: 'Password', placeholder: 'Min 6 characters', type: 'password' },
              { key: 'confirm', label: 'Confirm Password', placeholder: 'Confirm your password', type: 'password' },
            ].map(({ key, label, placeholder, type = 'text' }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-600 mb-2">{label}</label>
                <input required type={type} placeholder={placeholder}
                  value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition bg-gray-50 focus:bg-white" />
              </div>
            ))}

            {form.password && form.confirm && form.password !== form.confirm && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                Passwords do not match
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              style={{ boxShadow: loading ? 'none' : '0 8px 25px rgba(14,165,233,0.35)' }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 space-y-2 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <span onClick={() => navigate('/student/login')} className="text-[#0ea5e9] cursor-pointer hover:underline font-semibold">Login</span>
            </p>
            <p className="text-sm">
              <span onClick={() => navigate('/home')} className="text-gray-400 cursor-pointer hover:text-gray-600 transition">← Back to Home</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
