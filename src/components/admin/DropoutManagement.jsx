import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function DropoutManagement() {
  const [dropouts, setDropouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('All')
  const [selected, setSelected] = useState(null)

  const fetchDropouts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('status', 'dropout')
      .order('name')
    if (data) setDropouts(data)
    setLoading(false)
  }

  useEffect(() => { fetchDropouts() }, [])

  const handleReactivate = async (student) => {
    if (!confirm(`Reactivate ${student.name}?`)) return
    const { error } = await supabase
      .from('students')
      .update({ status: 'active', is_active: true })
      .eq('id', student.id)
    if (error) return toast.error('Failed: ' + error.message)
    toast.success(`${student.name} reactivated!`)
    fetchDropouts()
    setSelected(null)
  }

  const handlePermanentDelete = async (student) => {
    if (!confirm(`Permanently delete ${student.name}? This cannot be undone.`)) return
    const { error } = await supabase.from('students').delete().eq('id', student.id)
    if (error) return toast.error('Failed: ' + error.message)
    toast.success('Student permanently removed')
    fetchDropouts()
    setSelected(null)
  }

  const courses = ['All', ...new Set(dropouts.map(s => s.course || 'Unassigned').sort())]

  const filtered = dropouts.filter(s =>
    (selectedCourse === 'All' || (s.course || 'Unassigned') === selectedCourse) &&
    (s.name?.toLowerCase().includes(search.toLowerCase()) ||
     s.roll_number?.toLowerCase().includes(search.toLowerCase()) ||
     s.cnic?.includes(search))
  )

  // Group by course
  const grouped = filtered.reduce((acc, s) => {
    const key = s.course || 'Unassigned'
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Dropout Students</h3>
          <p className="text-sm text-gray-500 mt-1">
            {dropouts.length} student{dropouts.length !== 1 ? 's' : ''} dropped out
          </p>
        </div>
        {dropouts.length > 0 && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {dropouts.length} Dropout{dropouts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-4 mb-5 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {courses.map(c => (
            <button key={c} onClick={() => setSelectedCourse(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCourse === c
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {c} {c !== 'All' && `(${dropouts.filter(s => (s.course || 'Unassigned') === c).length})`}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Search by name, CNIC, or roll number..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-100 text-center py-16">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-semibold text-lg">No Dropouts</p>
          <p className="text-gray-400 text-sm mt-1">All students are currently active</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.keys(grouped).sort().map(course => (
            <div key={course} className="bg-white rounded-2xl shadow-sm border-2 border-red-100 overflow-hidden">
              {/* Course Header */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 px-5 py-4 flex items-center justify-between border-b border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center text-white font-bold">
                    {course.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{course}</h4>
                    <p className="text-xs text-red-500">{grouped[course].length} dropout{grouped[course].length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-3 py-1 rounded-full font-medium">
                  {grouped[course].length} students
                </span>
              </div>

              {/* Students */}
              <div className="divide-y divide-gray-100">
                {grouped[course].map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between px-5 py-4 hover:bg-red-50/30 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {s.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{s.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500 font-mono">{s.roll_number}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400">{s.cnic}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-full font-medium">
                        Dropout
                      </span>
                      <button onClick={() => setSelected(s)}
                        className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition font-medium">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {selected.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selected.name}</h3>
                    <p className="text-sm text-white/80">Dropout Student</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-6 space-y-3">
              <Row label="Roll Number" value={selected.roll_number} mono />
              <Row label="CNIC" value={selected.cnic} mono />
              <Row label="Course" value={selected.course || 'N/A'} />
              <Row label="Account Status" value={
                <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded-full font-medium">Dropout</span>
              } />
              <Row label="Joined" value={new Date(selected.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-50 space-y-3">
              <button onClick={() => handleReactivate(selected)}
                className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white rounded-lg py-3 font-medium hover:shadow-lg transition flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reactivate Student
              </button>
              <button onClick={() => handlePermanentDelete(selected)}
                className="w-full border-2 border-red-300 text-red-600 rounded-lg py-3 font-medium hover:bg-red-50 transition flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Permanently Remove
              </button>
              <button onClick={() => setSelected(null)}
                className="w-full border-2 border-gray-200 text-gray-600 rounded-lg py-2.5 font-medium hover:bg-gray-50 transition text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}
