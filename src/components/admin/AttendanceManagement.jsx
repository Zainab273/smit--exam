import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

// Get all days in a month
function getDaysInMonth(year, month) {
  const days = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function AttendanceManagement() {
  const today = new Date()
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])       // current month (for mark view)
  const [allAttendance, setAllAttendance] = useState([]) // all time (for report/overall %)
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('All')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('mark')
  const [localAttendance, setLocalAttendance] = useState({})
  const [dirty, setDirty] = useState(false)

  const days = getDaysInMonth(year, month)

  const fetchStudents = useCallback(async () => {
    const { data } = await supabase.from('students').select('*').order('name')
    if (data) setStudents(data)
  }, [])

  const fetchAllAttendance = useCallback(async () => {
    const { data } = await supabase.from('attendance').select('*')
    if (data) setAllAttendance(data)
  }, [])

  const fetchMonthAttendance = useCallback(async () => {
    setLoading(true)
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(days.length).padStart(2, '0')}`
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .gte('date', from)
      .lte('date', to)
    if (data) {
      setAttendance(data)
      const map = {}
      data.forEach(a => { map[`${a.student_id}_${a.date}`] = a.status })
      setLocalAttendance(map)
    }
    setDirty(false)
    setLoading(false)
  }, [year, month, days.length])

  useEffect(() => { fetchStudents(); fetchAllAttendance() }, [])
  useEffect(() => { fetchMonthAttendance() }, [year, month])

  const toggleCell = (studentId, dateStr) => {
    const key = `${studentId}_${dateStr}`
    const current = localAttendance[key]
    const next = current === 'present' ? 'absent' : 'present'
    setLocalAttendance(prev => ({ ...prev, [key]: next }))
    setDirty(true)
  }

  const markAllForDate = (dateStr, status) => {
    const updates = {}
    filteredStudents.forEach(s => { updates[`${s.id}_${dateStr}`] = status })
    setLocalAttendance(prev => ({ ...prev, ...updates }))
    setDirty(true)
  }

  const saveAttendance = async () => {
    if (!dirty) return toast('No changes to save')
    setSaving(true)
    const records = []
    filteredStudents.forEach(s => {
      days.forEach(d => {
        const dateStr = d.toISOString().split('T')[0]
        const key = `${s.id}_${dateStr}`
        if (localAttendance[key]) {
          records.push({ student_id: s.id, date: dateStr, status: localAttendance[key] })
        }
      })
    })
    const { error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,date' })
    setSaving(false)
    if (error) return toast.error('Save failed: ' + error.message)
    toast.success('Attendance saved!')
    setDirty(false)
    fetchMonthAttendance()
    fetchAllAttendance()
  }

  const handleDropout = async (student, percentage) => {
    if (!confirm(`Mark ${student.name} as DROPOUT?\nAttendance: ${percentage}%`)) return
    const { error } = await supabase
      .from('students')
      .update({ status: 'dropout', is_active: false })
      .eq('id', student.id)
    if (error) return toast.error('Failed: ' + error.message)
    toast.success(`${student.name} marked as dropout`)
    fetchStudents()
  }

  const handleReactivate = async (student) => {
    const { error } = await supabase
      .from('students')
      .update({ status: 'active' })
      .eq('id', student.id)
    if (error) return toast.error('Failed')
    toast.success('Reactivated')
    fetchStudents()
  }

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const courses = ['All', ...new Set(students.map(s => s.course || 'Unassigned').sort())]

  const filteredStudents = students.filter(s =>
    (selectedCourse === 'All' || (s.course || 'Unassigned') === selectedCourse) &&
    (s.name?.toLowerCase().includes(search.toLowerCase()) ||
     s.roll_number?.toLowerCase().includes(search.toLowerCase()))
  )

  // Overall stats (all time) - for report/dropout decision
  const getOverallStats = (studentId) => {
    const recs = allAttendance.filter(a => a.student_id === studentId)
    const present = recs.filter(a => a.status === 'present').length
    const total = recs.length
    const pct = total === 0 ? null : Math.round((present / total) * 100)
    return { present, absent: total - present, total, pct }
  }

  // Monthly stats - for mark view summary column
  const getMonthStats = (studentId) => {
    const recs = attendance.filter(a => a.student_id === studentId)
    const present = recs.filter(a => a.status === 'present').length
    const total = recs.length
    const pct = total === 0 ? null : Math.round((present / total) * 100)
    return { present, total, pct }
  }

  const lowCount = students.filter(s => {
    const { pct } = getOverallStats(s.id)
    return pct !== null && pct < 75 && s.status !== 'dropout'
  }).length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Attendance Management</h3>
          <p className="text-sm text-gray-500 mt-1">Monthly attendance sheet with dropout management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('mark')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${view === 'mark' ? 'bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#0ea5e9]'}`}>
            Mark Attendance
          </button>
          <button onClick={() => setView('report')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${view === 'report' ? 'bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#0ea5e9]'}`}>
            Report
            {lowCount > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${view === 'report' ? 'bg-white/30' : 'bg-red-100 text-red-600'}`}>
                {lowCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Low attendance warning */}
      {lowCount > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-semibold text-red-700">{lowCount} student(s) below 75% attendance this month</p>
        </div>
      )}

      {/* Month Navigator + Course Filter */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-4 mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="w-9 h-9 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-[#0ea5e9] transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-lg font-bold text-gray-800">{MONTH_NAMES[month]} {year}</h4>
          <button onClick={nextMonth} disabled={year === today.getFullYear() && month === today.getMonth()}
            className="w-9 h-9 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-[#0ea5e9] transition disabled:opacity-40">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Course tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {courses.map(c => (
            <button key={c} onClick={() => setSelectedCourse(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCourse === c
                  ? 'bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {c} {c !== 'All' && `(${students.filter(s => (s.course || 'Unassigned') === c).length})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <input type="text" placeholder="Search student..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
      </div>

      {/* ── MARK VIEW ── */}
      {view === 'mark' && (
        <div>
          {/* Save bar */}
          <div className="flex items-center justify-between bg-white rounded-xl border-2 border-gray-100 px-5 py-3 mb-4">
            <p className="text-sm text-gray-500">
              Click a cell to toggle <span className="text-green-600 font-semibold">P</span>resent / <span className="text-red-500 font-semibold">A</span>bsent
            </p>
            <button onClick={saveAttendance} disabled={saving || !dirty}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${dirty ? 'bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              {saving ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : '💾 Save Changes'}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl border-2 border-gray-100">No students found</div>
          ) : (
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="text-xs border-collapse" style={{ minWidth: `${180 + days.length * 38}px` }}>
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-green-50">
                      <th className="sticky left-0 z-10 bg-gradient-to-r from-blue-50 to-green-50 px-4 py-3 text-left font-semibold text-gray-700 min-w-[180px] border-r-2 border-gray-200">
                        Student
                      </th>
                      {days.map(d => {
                        const dateStr = d.toISOString().split('T')[0]
                        const dayNum = d.getDate()
                        const dayName = DAY_LABELS[d.getDay()]
                        const isToday = dateStr === today.toISOString().split('T')[0]
                        const isSun = d.getDay() === 0
                        return (
                          <th key={dateStr} className={`w-9 py-2 text-center border-r border-gray-100 ${isToday ? 'bg-blue-100' : isSun ? 'bg-red-50' : ''}`}>
                            <div className={`font-bold ${isToday ? 'text-[#0ea5e9]' : isSun ? 'text-red-400' : 'text-gray-600'}`}>{dayNum}</div>
                            <div className={`text-gray-400 font-normal ${isSun ? 'text-red-300' : ''}`}>{dayName}</div>
                          </th>
                        )
                      })}
                      <th className="px-3 py-3 text-center font-semibold text-gray-700 min-w-[80px]">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((s) => {
                      const isDropout = s.status === 'dropout'
                      const monthStats = getMonthStats(s.id)
                      const overallStats = getOverallStats(s.id)

                      return (
                        <tr key={s.id} className={`hover:bg-gray-50 ${isDropout ? 'opacity-50' : ''}`}>
                          <td className="sticky left-0 z-10 bg-white px-4 py-2.5 border-r-2 border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {s.name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-xs leading-tight">{s.name}</p>
                                <p className="text-gray-400 text-xs">{s.roll_number}</p>
                              </div>
                            </div>
                          </td>
                          {days.map(d => {
                            const dateStr = d.toISOString().split('T')[0]
                            const key = `${s.id}_${dateStr}`
                            const status = localAttendance[key]
                            const isSun = d.getDay() === 0
                            const isToday = dateStr === today.toISOString().split('T')[0]
                            return (
                              <td key={dateStr}
                                onClick={() => !isDropout && toggleCell(s.id, dateStr)}
                                className={`w-9 h-9 text-center border-r border-gray-100 cursor-pointer select-none transition
                                  ${isDropout ? 'cursor-not-allowed' : 'hover:opacity-80'}
                                  ${isToday ? 'ring-1 ring-inset ring-blue-300' : ''}
                                  ${status === 'present' ? 'bg-green-100' : status === 'absent' ? 'bg-red-100' : isSun ? 'bg-red-50/40' : 'bg-white'}`}>
                                {status === 'present' && <span className="text-green-600 font-bold">P</span>}
                                {status === 'absent' && <span className="text-red-500 font-bold">A</span>}
                                {!status && <span className="text-gray-200">·</span>}
                              </td>
                            )
                          })}
                          <td className="px-3 py-2 text-center">
                            <div className="space-y-1">
                              {/* Monthly */}
                              {monthStats.pct === null ? (
                                <span className="text-gray-300 text-xs">—</span>
                              ) : (
                                <div>
                                  <div className="text-xs text-gray-400">This month</div>
                                  <span className={`font-bold text-sm ${monthStats.pct < 75 ? 'text-red-500' : monthStats.pct < 85 ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {monthStats.pct}%
                                  </span>
                                </div>
                              )}
                              {/* Overall */}
                              {overallStats.total > 0 && (
                                <div>
                                  <div className="text-xs text-gray-400">Overall</div>
                                  <span className={`font-bold text-sm ${overallStats.pct < 75 ? 'text-red-500' : overallStats.pct < 85 ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {overallStats.pct}%
                                  </span>
                                  {overallStats.pct < 75 && (
                                    <div className="text-xs text-red-500 font-medium">⚠ Low</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REPORT VIEW ── */}
      {view === 'report' && (
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-blue-50 to-green-50 text-gray-700">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">Student</th>
                  <th className="px-4 py-4 text-left font-semibold">Course</th>
                  <th className="px-4 py-4 text-center font-semibold">Present</th>
                  <th className="px-4 py-4 text-center font-semibold">Absent</th>
                  <th className="px-4 py-4 text-center font-semibold">
                    Overall %
                    <div className="text-xs font-normal text-gray-400">Full course duration</div>
                  </th>
                  <th className="px-4 py-4 text-center font-semibold">Status</th>
                  <th className="px-4 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map(s => {
                  const { present, absent, total, pct } = getOverallStats(s.id)
                  const isLow = pct !== null && pct < 75
                  const isDropout = s.status === 'dropout'
                  return (
                    <tr key={s.id} className={`hover:bg-gray-50 transition ${isLow && !isDropout ? 'bg-red-50/40' : ''}`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${isDropout ? 'bg-gray-400' : isLow ? 'bg-red-400' : 'bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d]'}`}>
                            {s.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.roll_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">{s.course || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-green-600">{present}</td>
                      <td className="px-4 py-4 text-center font-bold text-red-500">{absent}</td>
                      <td className="px-4 py-4 text-center">
                        {pct === null ? (
                          <span className="text-gray-400 text-xs">No data</span>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5">
                            <span className={`font-bold text-base ${pct < 75 ? 'text-red-600' : pct < 85 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {pct}%
                            </span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${pct < 75 ? 'bg-red-500' : pct < 85 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-400">{present}/{total} total days</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isDropout ? (
                          <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">Dropout</span>
                        ) : isLow ? (
                          <span className="text-xs px-3 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200">⚠ Low</span>
                        ) : (
                          <span className="text-xs px-3 py-1.5 rounded-full bg-green-100 text-green-700 border border-green-200">✓ Good</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {isDropout ? (
                          <button onClick={() => handleReactivate(s)}
                            className="text-xs text-[#0ea5e9] border border-[#0ea5e9] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition font-medium">
                            Reactivate
                          </button>
                        ) : isLow ? (
                          <button onClick={() => handleDropout(s, pct)}
                            className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition font-medium">
                            Dropout
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No students found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
