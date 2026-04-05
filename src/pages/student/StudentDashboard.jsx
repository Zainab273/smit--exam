import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import MyCourses from '../../components/student/MyCourses'
import LeaveForm from '../../components/student/LeaveForm'
import MyLeaves from '../../components/student/MyLeaves'
import MyAttendance from '../../components/student/MyAttendance'

const tabs = [
  { id: 'Courses', label: 'My Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'Attendance', label: 'My Attendance', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'Submit Leave', label: 'Submit Leave', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'My Leaves', label: 'My Leaves', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
]

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Courses')
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logout = () => {
    dispatch(clearUser())
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png"
              alt="SMIT"
              className="h-10 brightness-0 invert"
            />
            <p className="text-xs text-white/70">Student Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-white/70">Roll No: {user?.roll_number}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <button onClick={logout} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-white/80 text-sm">Manage your courses and leave requests from here.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white shadow-md'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#0ea5e9]'
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'Courses' && <MyCourses />}
        {activeTab === 'Attendance' && <MyAttendance />}
        {activeTab === 'Submit Leave' && <LeaveForm />}
        {activeTab === 'My Leaves' && <MyLeaves />}
      </div>
    </div>
  )
}
