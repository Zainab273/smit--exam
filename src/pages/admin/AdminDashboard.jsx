import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import StudentManagement from '../../components/admin/StudentManagement'
import CourseManagement from '../../components/admin/CourseManagement'
import LeaveManagement from '../../components/admin/LeaveManagement'
import AdminSettings from '../../components/admin/AdminSettings'
import RegistrationManagement from '../../components/admin/RegistrationManagement'
import AttendanceManagement from '../../components/admin/AttendanceManagement'
import DropoutManagement from '../../components/admin/DropoutManagement'

const tabs = [
  { id: 'Registrations', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'Students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { id: 'Attendance', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'Dropouts', icon: 'M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6' },
  { id: 'Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'Leaves', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Registrations')
  const [counts, setCounts] = useState({ Registrations: 0, Students: 0, Courses: 0, Leaves: 0 })
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCounts = async () => {
      const [reg, stu, cou, lea, drop] = await Promise.all([
        supabase.from('student_registrations').select('id', { count: 'exact', head: true }),
        supabase.from('students').select('id', { count: 'exact', head: true }).neq('status', 'dropout'),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('leaves').select('id', { count: 'exact', head: true }),
        supabase.from('students').select('id', { count: 'exact', head: true }).eq('status', 'dropout'),
      ])
      setCounts({
        Registrations: reg.count || 0,
        Students: stu.count || 0,
        Courses: cou.count || 0,
        Leaves: lea.count || 0,
        Dropouts: drop.count || 0,
      })
    }
    fetchCounts()
  }, [activeTab])

  const logout = () => {
    dispatch(clearUser())
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png"
              alt="SMIT"
              className="h-10 brightness-0 invert"
            />
            <p className="text-xs text-white/80">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || user?.username}</p>
              <p className="text-xs text-white/70">Administrator</p>
            </div>
            <button onClick={logout} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white shadow-md'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#0ea5e9]'
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.id}
              {counts[tab.id] > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-white/30 text-white' :
                  tab.id === 'Dropouts' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'Registrations' && <RegistrationManagement />}
        {activeTab === 'Students' && <StudentManagement />}
        {activeTab === 'Attendance' && <AttendanceManagement />}
        {activeTab === 'Dropouts' && <DropoutManagement />}
        {activeTab === 'Courses' && <CourseManagement />}
        {activeTab === 'Leaves' && <LeaveManagement />}
        {activeTab === 'Settings' && <AdminSettings />}
      </div>
    </div>
  )
}
