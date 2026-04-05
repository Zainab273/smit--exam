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
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('cnic', form.cnic)
      .eq('password', form.password)
      .single()
    setLoading(false)
    if (error || !data) return toast.error('Invalid CNIC or password')
    dispatch(setUser({ user: data, role: 'student' }))
    toast.success('Welcome back!')
    navigate('/student/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png"
            alt="SMIT" className="h-14 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Student Login</h2>
          <p className="text-sm text-gray-500">Enter your CNIC and password to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CNIC (without dashes)</label>
            <input required placeholder="e.g. 4210112345671"
              value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })}
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-500">
          Don't have an account?{' '}
          <span onClick={() => navigate('/student/signup')} className="text-[#0ea5e9] cursor-pointer hover:underline font-medium">
            Sign up
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
