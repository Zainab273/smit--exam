import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearUser } from "../../store/authSlice"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import MyCourses from "../../components/student/MyCourses"
import LeaveForm from "../../components/student/LeaveForm"
import MyLeaves from "../../components/student/MyLeaves"
import MyAttendance from "../../components/student/MyAttendance"
import DashboardHero from "../../components/student/DashboardHero"

const NAV_ITEMS = [
  { id: "Home",         label: "Dashboard",   icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "Courses",      label: "My Courses",  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { id: "Attendance",   label: "Attendance",  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { id: "Submit Leave", label: "Apply Leave", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "My Leaves",    label: "My Leaves",   icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
]

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const SCHEDULE_TABS = ["Assignments","Quizzes","Events"]

export default function StudentDashboard() {
  const [activeTab, setActiveTab]     = useState("Home")
  const [sidebarOpen, setSidebar]     = useState(true)
  const [scheduleTab, setScheduleTab] = useState("Assignments")
  const [stats, setStats]             = useState({ present: 0, total: 0, leaves: 0, pendingLeaves: 0, approvedLeaves: 0 })
  const { user } = useSelector(s => s.auth)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const [attRes, leavesRes] = await Promise.all([
        supabase.from("attendance").select("status").eq("student_id", user.id),
        supabase.from("leaves").select("status").eq("student_id", user.id),
      ])
      const att    = attRes.data    || []
      const leaves = leavesRes.data || []
      setStats({
        present:        att.filter(a => a.status === "present").length,
        total:          att.length,
        leaves:         leaves.length,
        pendingLeaves:  leaves.filter(l => l.status === "pending").length,
        approvedLeaves: leaves.filter(l => l.status === "approved").length,
      })
    }
    fetchData()
  }, [user.id])

  const logout = () => { dispatch(clearUser()); navigate("/") }

  const today    = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - today.getDay() + i)
    return d
  })
  const attPct     = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : null
  const courseAbbr = user?.course?.split(" ").map(w => w[0]).join("").slice(0, 4).toUpperCase() || ""
  const greeting   = new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening"

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f5f7fa" }}>

      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" alt="SMIT" className="h-9" />
          <button onClick={() => setSidebar(o => !o)} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400">
          <span>Home</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-700 font-semibold">{NAV_ITEMS.find(n => n.id === activeTab)?.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.roll_number}</p>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: "linear-gradient(135deg, #0ea5e9, #5ab87d)" }}>
            {user?.name?.charAt(0)}
          </div>
          <button onClick={logout} className="text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg shadow-sm hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #0ea5e9, #5ab87d)" }}>
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? "w-56" : "w-0 overflow-hidden"} transition-all duration-300 bg-white border-r border-gray-100 flex-shrink-0 shadow-sm`}>
          <div className="py-5 px-3">
            <div className="flex items-center gap-3 px-3 py-3 mb-5 rounded-2xl border border-blue-100" style={{ background: "linear-gradient(135deg, #eff6ff, #f0fdf4)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base shadow-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #0ea5e9, #5ab87d)" }}>
                {user?.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate leading-tight">{user?.name?.split(" ")[0]}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{courseAbbr || "Student"}</p>
              </div>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu</p>
            <nav className="space-y-1">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left group ${activeTab === item.id ? "text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
                  style={activeTab === item.id ? { background: "linear-gradient(135deg, #0ea5e9, #5ab87d)" } : {}}>
                  <svg className={`w-4 h-4 flex-shrink-0 ${activeTab === item.id ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="truncate">{item.label}</span>
                  {item.id === "My Leaves" && stats.pendingLeaves > 0 && (
                    <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === item.id ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600"}`}>{stats.pendingLeaves}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          {activeTab === "Home" && (
            <div className="max-w-5xl mx-auto space-y-5">

              {/* Isometric Hero */}
              <DashboardHero user={user} onNavigate={setActiveTab} />
              <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #3a9b8f 50%, #5ab87d 100%)" }}>
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />
                <div className="relative p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-medium">{greeting} 👋</p>
                    <h2 className="text-xl font-black text-white mt-0.5">{user?.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user?.course && <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium border border-white/20">🎓 {user.course}</span>}
                      <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium border border-white/20">🪪 {user?.roll_number}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer group" onClick={() => setActiveTab("Attendance")}>
                  <div className="flex-1">
                    <p className="text-3xl font-black text-gray-900 leading-none">{stats.total > 0 ? `${stats.present}/${stats.total}` : "—/—"}</p>
                    <p className="text-sm text-gray-400 mt-1.5 font-medium">Attendance</p>
                    {attPct !== null && (
                      <div className="mt-3 flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${attPct < 75 ? "bg-red-400" : "bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d]"}`} style={{ width: `${attPct}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${attPct < 75 ? "text-red-500" : "text-[#0ea5e9]"}`}>{attPct}%</span>
                      </div>
                    )}
                    {attPct !== null && attPct < 75 && <p className="text-xs text-red-500 mt-1.5 font-medium">⚠ Below 75% minimum</p>}
                  </div>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center ml-4 flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: attPct !== null && attPct < 75 ? "#fef2f2" : "#eff6ff" }}>
                    <svg className="w-6 h-6" style={{ color: attPct !== null && attPct < 75 ? "#ef4444" : "#0ea5e9" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer group" onClick={() => setActiveTab("My Leaves")}>
                  <div>
                    <p className="text-3xl font-black text-gray-900 leading-none">{stats.leaves}</p>
                    <p className="text-sm text-gray-400 mt-1.5 font-medium">Leave Requests</p>
                    <div className="flex items-center gap-2 mt-2">
                      {stats.approvedLeaves > 0 && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">{stats.approvedLeaves} approved</span>}
                      {stats.pendingLeaves > 0 && <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">{stats.pendingLeaves} pending</span>}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center ml-4 flex-shrink-0 transition-transform group-hover:scale-110">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Active Course */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700">Active Course</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user?.status === "dropout" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                    {user?.status === "dropout" ? "DROPOUT" : "ACTIVE"}
                  </span>
                </div>
                <div className="p-5">
                  {user?.course ? (
                    <>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm" style={{ background: "linear-gradient(135deg, #0ea5e9, #5ab87d)" }}>
                          {courseAbbr.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-base font-black text-gray-900">{user.course}</h4>
                          <span className="text-xs text-[#0ea5e9] font-semibold bg-blue-50 px-2 py-0.5 rounded mt-0.5 inline-block border border-blue-100">{courseAbbr}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { label: "Roll Number", value: user.roll_number },
                          { label: "CNIC", value: user.cnic },
                          { label: "Account", value: user.is_active ? "✓ Active" : "○ Pending" },
                          { label: "Enrolled", value: user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A" },
                        ].map(item => (
                          <div key={item.label} className="rounded-xl p-3 border border-gray-100" style={{ background: "#f8fafc" }}>
                            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-8">No active course found</p>
                  )}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Schedule */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0ea5e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-700">Class Schedule</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {weekDays.map((d, i) => {
                        const isToday = d.toDateString() === today.toDateString()
                        return (
                          <div key={i} className={`rounded-xl py-2 text-center ${isToday ? "text-white shadow-sm" : "bg-gray-50 text-gray-500"}`} style={isToday ? { background: "linear-gradient(135deg, #0ea5e9, #5ab87d)" } : {}}>
                            <p className="text-xs font-semibold">{DAYS[d.getDay()]}</p>
                            <p className="text-sm font-black mt-0.5">{d.getDate()}</p>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex gap-1.5 mb-4 bg-gray-100 p-1 rounded-xl">
                      {SCHEDULE_TABS.map(t => (
                        <button key={t} onClick={() => setScheduleTab(t)} className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition ${scheduleTab === t ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}>{t}</button>
                      ))}
                    </div>
                    <div className="text-center py-5">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-400">No upcoming {scheduleTab.toLowerCase()}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700">Quick Actions</h3>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-2.5">
                    {[
                      { label: "View Courses", desc: "Browse all", tab: "Courses", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", from: "#0ea5e9", to: "#38bdf8" },
                      { label: "Attendance", desc: "View record", tab: "Attendance", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", from: "#5ab87d", to: "#22c55e" },
                      { label: "Apply Leave", desc: "New request", tab: "Submit Leave", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", from: "#8b5cf6", to: "#a78bfa" },
                      { label: "Leave Status", desc: "Track status", tab: "My Leaves", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", from: "#f97316", to: "#fb923c" },
                    ].map(a => (
                      <button key={a.tab} onClick={() => setActiveTab(a.tab)} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition text-left group" style={{ background: "#f8fafc" }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-700">{a.label}</p>
                          <p className="text-xs text-gray-400">{a.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === "Courses"      && <div className="max-w-5xl mx-auto"><MyCourses /></div>}
          {activeTab === "Attendance"   && <div className="max-w-5xl mx-auto"><MyAttendance /></div>}
          {activeTab === "Submit Leave" && <div className="max-w-5xl mx-auto"><LeaveForm /></div>}
          {activeTab === "My Leaves"    && <div className="max-w-5xl mx-auto"><MyLeaves /></div>}

        </main>
      </div>
    </div>
  )
}
