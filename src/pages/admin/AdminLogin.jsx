import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/authSlice'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', form.username)
      .eq('password', form.password)
      .single()
    setLoading(false)
    if (error || !data) return toast.error('Invalid credentials')
    dispatch(setUser({ user: data, role: 'admin' }))
    toast.success('Welcome, Admin!')
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #0ea5e920 0%, transparent 50%), radial-gradient(circle at 80% 80%, #5ab87d20 0%, transparent 50%)' }} />

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
        style={{ boxShadow: '0 25px 60px rgba(14,165,233,0.15)' }}>
        {/* Top gradient bar */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }} />

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
              style={{ boxShadow: '0 8px 25px rgba(14,165,233,0.35)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] bg-clip-text text-transparent mb-2">Admin Portal</h2>
            <p className="text-sm text-gray-400">SMIT Connect Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Username</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input required placeholder="Enter your username"
                  value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
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
              ) : 'Login to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-end">
            <span onClick={() => navigate('/')} className="text-xs text-gray-400 hover:text-[#0ea5e9] cursor-pointer transition">← Back</span>
          </div>
        </div>
      </div>
    </div>
  )
}
