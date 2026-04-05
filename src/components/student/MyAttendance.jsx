import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../../lib/supabase'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function getDaysInMonth(year, month) {
  const days = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export default function MyAttendance() {
  const { user } = useSelector(s => s.auth)
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [attendance, setAttendance] = useState([])
  const [allAttendance, setAllAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  const days = getDaysInMonth(year, month)

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', user.id)
      if (data) setAllAttendance(data)
    }
    fetchAll()
  }, [user.id])

  useEffect(() => {
    const fetchMonth = async () => {
      setLoading(true)
      const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
      const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(days.length).padStart(2, '0')}`
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', user.id)
        .gte('date', from)
        .lte('date', to)
      if (data) setAttendance(data)
      setLoading(false)
    }
    fetchMonth()
  }, [year, month, user.id])

  const attendanceMap = {}
  attendance.forEach(a => { attendanceMap[a.date] = a.status })

  // Monthly stats
  const monthPresent = attendance.filter(a => a.status === 'present').length
  const monthTotal = attendance.length
  const monthPct = monthTotal === 0 ? null : Math.round((monthPresent / monthTotal) * 100)

  // Overall stats
  const allPresent = allAttendance.filter(a => a.status === 'present').length
  const allTotal = allAttendance.length
  const allPct = allTotal === 0 ? null : Math.round((allPresent / allTotal) * 100)

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="max-w-3xl">
      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 text-center">
          <p className="text-3xl font-black text-gray-800">{allTotal}</p>
          <p className="text-xs text-gray-500 mt-1">Total Classes</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-green-100 p-5 text-center">
          <p className="text-3xl font-black text-green-600">{allPresent}</p>
          <p className="text-xs text-gray-500 mt-1">Present</p>
        </div>
        <div className={`rounded-2xl border-2 p-5 text-center ${allPct !== null && allPct < 75 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
          <p className={`text-3xl font-black ${allPct === null ? 'text-gray-400' : allPct < 75 ? 'text-red-600' : allPct < 85 ? 'text-yellow-600' : 'text-green-600'}`}>
            {allPct === null ? '—' : `${allPct}%`}
          </p>
          <p className="text-xs text-gray-500 mt-1">Overall</p>
          {allPct !== null && allPct < 75 && (
            <p className="text-xs text-red-500 font-semibold mt-1">⚠ Below 75%</p>
          )}
        </div>
      </div>

      {/* Warning */}
      {allPct !== null && allPct < 75 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-semibold text-red-700">
            Your attendance is below 75%. Please improve your attendance to avoid dropout.
          </p>
        </div>
      )}

      {/* Month Calendar */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
        {/* Month Nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-[#0ea5e9] transition">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <h4 className="font-bold text-gray-800">{MONTH_NAMES[month]} {year}</h4>
            {monthTotal > 0 && (
              <p className={`text-xs font-medium ${monthPct < 75 ? 'text-red-500' : 'text-green-600'}`}>
                {monthPresent}/{monthTotal} days present ({monthPct}%)
              </p>
            )}
          </div>
          <button onClick={nextMonth} disabled={year === today.getFullYear() && month === today.getMonth()}
            className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:border-[#0ea5e9] transition disabled:opacity-40">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="p-4">
            {/* Day labels */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_LABELS.map(d => (
                <div key={d} className={`text-center text-xs font-semibold py-1 ${d === 'Sun' ? 'text-red-400' : 'text-gray-400'}`}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for first day offset */}
              {Array.from({ length: days[0].getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(d => {
                const dateStr = d.toISOString().split('T')[0]
                const status = attendanceMap[dateStr]
                const isToday = dateStr === today.toISOString().split('T')[0]
                const isSun = d.getDay() === 0
                const isFuture = d > today

                return (
                  <div key={dateStr}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition
                      ${isToday ? 'ring-2 ring-[#0ea5e9]' : ''}
                      ${isFuture ? 'opacity-30' : ''}
                      ${status === 'present' ? 'bg-green-100 text-green-700' :
                        status === 'absent' ? 'bg-red-100 text-red-600' :
                        isSun ? 'bg-red-50 text-red-300' : 'bg-gray-50 text-gray-400'}`}>
                    <span>{d.getDate()}</span>
                    {status === 'present' && <span className="text-green-500 text-xs">P</span>}
                    {status === 'absent' && <span className="text-red-400 text-xs">A</span>}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-green-100" />
                <span className="text-xs text-gray-500">Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-red-100" />
                <span className="text-xs text-gray-500">Absent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200" />
                <span className="text-xs text-gray-500">Not marked</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
