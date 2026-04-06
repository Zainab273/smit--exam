import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/authSlice'
import toast from 'react-hot-toast'

export default function StudentLogin() {
  const [form, setForm] = useState({ cnic: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data: student } = await supabase.from('students').select('*').eq('cnic', form.cnic).single()
    setLoading(false)
    if (!student) return toast.error('CNIC not found. Please register first or contact admin.')
    if (!student.password) return toast.error('Account not activated yet. Please sign up first to set your password.')
    if (student.password !== form.password) return toast.error('Incorrect password. Please try again.')
    if (student.status === 'dropout') return toast.error('Your account has been deactivated. Please contact admin.')
    dispatch(setUser({ user: student, role: 'student' }))
    toast.success(`Welcome back, ${student.name}!`)
    navigate('/student/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #0ea5e920 0%, transparent 50%), radial-gradient(circle at 80% 80%, #5ab87d20 0%, transparent 50%)' }} />

      <div className="bg-white rounded-3xl w-full max-w-md relative overflow-hidden"
        style={{ boxShadow: '0 25px 60px rgba(14,165,233,0.15)' }}>
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }} />

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png"
              alt="SMIT" className="h-12 mx-auto mb-5" />
            <h2 className="text-2xl font-black text-gray-800 mb-1">Student Login</h2>
            <p className="text-sm text-gray-400">Enter your CNIC and password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">CNIC (without dashes)</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <input required placeholder="e.g. 4210112345671"
                  value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition bg-gray-50 focus:bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input required type="password" placeholder="Enter your password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition bg-gray-50 focus:bg-white" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ boxShadow: loading ? 'none' : '0 8px 25px rgba(14,165,233,0.35)' }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Logging in...</>
              ) : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 space-y-2 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <span onClick={() => navigate('/student/signup')} className="text-[#0ea5e9] cursor-pointer hover:underline font-semibold">Sign up</span>
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
