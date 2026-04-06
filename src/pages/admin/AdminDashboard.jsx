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
  { id: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'Registrations', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'Students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { id: 'Attendance', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'Dropouts', icon: 'M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6' },
  { id: 'Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'Leaves', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [counts, setCounts] = useState({ Registrations: 0, Students: 0, Courses: 0, Leaves: 0, Dropouts: 0 })
  const [overview, setOverview] = useState({ pending: 0, approved: 0, rejected: 0, activeStudents: 0, pendingLeaves: 0, openCourses: 0, courseBreakdown: [] })
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCounts = async () => {
      const [reg, stu, cou, lea, drop, pending, approved, rejected, activeS, pendingL, openC, courses] = await Promise.all([
        supabase.from('student_registrations').select('id', { count: 'exact', head: true }),
        supabase.from('students').select('id', { count: 'exact', head: true }).neq('status', 'dropout'),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('leaves').select('id', { count: 'exact', head: true }),
        supabase.from('students').select('id', { count: 'exact', head: true }).eq('status', 'dropout'),
        supabase.from('student_registrations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('student_registrations').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('student_registrations').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
        supabase.from('students').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('leaves').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('students').select('course').neq('status', 'dropout'),
      ])
      setCounts({ Registrations: reg.count || 0, Students: stu.count || 0, Courses: cou.count || 0, Leaves: lea.count || 0, Dropouts: drop.count || 0 })

      // Course breakdown
      const courseMap = {}
      if (courses.data) courses.data.forEach(s => { const c = s.course || 'Unassigned'; courseMap[c] = (courseMap[c] || 0) + 1 })
      const courseBreakdown = Object.entries(courseMap).sort((a, b) => b[1] - a[1]).slice(0, 6)

      setOverview({
        pending: pending.count || 0,
        approved: approved.count || 0,
        rejected: rejected.count || 0,
        activeStudents: activeS.count || 0,
        pendingLeaves: pendingL.count || 0,
        openCourses: openC.count || 0,
        courseBreakdown,
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
      <nav className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white px-4 md:px-6 py-4 shadow-lg">
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

      <div className="max-w-7xl mx-auto p-3 md:p-6">
        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition whitespace-nowrap ${
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

        {activeTab === 'Overview' && <AdminOverview counts={counts} overview={overview} user={user} onNavigate={setActiveTab} />}
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

function AdminOverview({ counts, overview, user, onNavigate }) {
  const today = new Date()
  const greeting = today.getHours() < 12 ? 'Good Morning' : today.getHours() < 17 ? 'Good Afternoon' : 'Good Evening'
  const maxCourse = overview.courseBreakdown[0]?.[1] || 1

  const statCards = [
    { label: 'Total Registrations', value: counts.Registrations, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'from-blue-500 to-blue-600', tab: 'Registrations', sub: `${overview.pending} pending` },
    { label: 'Active Students', value: counts.Students, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'from-green-500 to-green-600', tab: 'Students', sub: `${overview.activeStudents} logged in` },
    { label: 'Total Courses', value: counts.Courses, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'from-purple-500 to-purple-600', tab: 'Courses', sub: `${overview.openCourses} open` },
    { label: 'Leave Requests', value: counts.Leaves, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'from-orange-500 to-orange-600', tab: 'Leaves', sub: `${overview.pendingLeaves} pending` },
    { label: 'Dropouts', value: counts.Dropouts, icon: 'M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6', color: 'from-red-500 to-red-600', tab: 'Dropouts', sub: 'Below 75% attendance' },
    { label: 'Approved', value: overview.approved, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-teal-500 to-teal-600', tab: 'Registrations', sub: 'Registrations' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-white/70 text-sm">{greeting} 👋</p>
          <h2 className="text-2xl md:text-3xl font-black mt-1">{user?.name || user?.username}</h2>
          <p className="text-white/70 text-sm mt-1">Here's what's happening at SMIT today — {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(card => (
          <button key={card.label} onClick={() => onNavigate(card.tab)}
            className="bg-white rounded-2xl border-2 border-gray-100 p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
            </div>
            <p className="text-2xl font-black text-gray-800">{card.value}</p>
            <p className="text-xs font-semibold text-gray-600 mt-0.5">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Status Donut */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Registration Status</h3>
          <div className="flex items-center gap-6">
            {/* Simple visual bars */}
            <div className="flex-1 space-y-3">
              {[
                { label: 'Approved', value: overview.approved, total: counts.Registrations, color: 'bg-green-500' },
                { label: 'Pending', value: overview.pending, total: counts.Registrations, color: 'bg-yellow-400' },
                { label: 'Rejected', value: overview.rejected, total: counts.Registrations, color: 'bg-red-400' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-bold text-gray-800">{item.value}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: item.total > 0 ? `${Math.round((item.value / item.total) * 100)}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Circle stat */}
            <div className="text-center flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#5ab87d] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white font-black text-lg leading-none">{counts.Registrations > 0 ? Math.round((overview.approved / counts.Registrations) * 100) : 0}%</p>
                  <p className="text-white/70 text-xs">approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Popularity */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Students per Course</h3>
          {overview.courseBreakdown.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No data yet</p>
          ) : (
            <div className="space-y-3">
              {overview.courseBreakdown.map(([course, count]) => (
                <div key={course}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium truncate max-w-[70%]">{course}</span>
                    <span className="font-bold text-gray-800">{count}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((count / maxCourse) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Review Registrations', icon: '📋', tab: 'Registrations', badge: overview.pending, color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' },
            { label: 'Mark Attendance', icon: '✅', tab: 'Attendance', color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' },
            { label: 'Approve Leaves', icon: '🗓', tab: 'Leaves', badge: overview.pendingLeaves, color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200' },
            { label: 'Manage Courses', icon: '📚', tab: 'Courses', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200' },
          ].map(action => (
            <button key={action.tab} onClick={() => onNavigate(action.tab)}
              className={`${action.color} border-2 rounded-xl p-4 text-center transition relative`}>
              {action.badge > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {action.badge}
                </span>
              )}
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className="text-xs font-semibold">{action.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
