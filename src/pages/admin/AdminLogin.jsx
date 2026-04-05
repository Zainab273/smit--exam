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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] bg-clip-text text-transparent mb-2">Admin Portal</h2>
          <p className="text-sm text-gray-500">SMIT Connect Management System</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input required placeholder="Enter your username"
              value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input required type="password" placeholder="Enter your password"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white py-3 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
