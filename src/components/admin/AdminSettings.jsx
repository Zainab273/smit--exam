import { useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const { user } = useSelector((s) => s.auth)
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm_password: '' })
  const [newAdmin, setNewAdmin] = useState({ name: '', username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false })

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.new_password.length < 6) return toast.error('New password must be at least 6 characters')
    if (pwForm.new_password !== pwForm.confirm_password) return toast.error('Passwords do not match')
    if (pwForm.old_password === pwForm.new_password) return toast.error('New password must be different from old password')

    setLoading(true)
    const { data } = await supabase
      .from('admins').select('id')
      .eq('id', user.id)
      .eq('password', pwForm.old_password)
      .single()

    if (!data) { setLoading(false); return toast.error('Old password is incorrect') }

    const { error } = await supabase
      .from('admins').update({ password: pwForm.new_password })
      .eq('id', user.id)

    setLoading(false)
    if (error) return toast.error('Failed to update password')
    toast.success('Password updated successfully!')
    setPwForm({ old_password: '', new_password: '', confirm_password: '' })
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    if (newAdmin.password.length < 6) return toast.error('Password must be at least 6 characters')

    setLoading(true)
    // Check if username already exists
    const { data: existing } = await supabase
      .from('admins').select('id')
      .eq('username', newAdmin.username)
      .single()

    if (existing) { setLoading(false); return toast.error('Username already exists') }

    const { error } = await supabase.from('admins').insert(newAdmin)
    setLoading(false)
    if (error) return toast.error('Failed to add admin: ' + error.message)
    toast.success(`Admin "${newAdmin.username}" added successfully!`)
    setNewAdmin({ name: '', username: '', password: '' })
  }

  const PasswordInput = ({ label, field, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          required
          type={showPw[field] ? 'text' : 'password'}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#0ea5e9] transition"
        />
        <button type="button"
          onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {showPw[field] ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Admin Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Manage your account and add new administrators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg">Change Password</h4>
                <p className="text-xs text-white/80">Logged in as: {user?.username}</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            <PasswordInput label="Old Password" field="old"
              value={pwForm.old_password}
              onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })} />
            <PasswordInput label="New Password" field="new"
              value={pwForm.new_password}
              onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} />
            <PasswordInput label="Confirm New Password" field="confirm"
              value={pwForm.confirm_password}
              onChange={(e) => setPwForm({ ...pwForm, confirm_password: e.target.value })} />
            {pwForm.new_password && pwForm.confirm_password && pwForm.new_password !== pwForm.confirm_password && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white py-3 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50">
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Add New Admin */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#5ab87d] to-[#0ea5e9] text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg">Add New Admin</h4>
                <p className="text-xs text-white/80">Create a new administrator account</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input required type="text" placeholder="Enter full name"
                value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input required type="text" placeholder="Enter username (must be unique)"
                value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input required type="password" placeholder="Min 6 characters"
                value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#5ab87d] to-[#0ea5e9] text-white py-3 rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
