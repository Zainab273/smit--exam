import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

export default function StudentManagement() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState('All')

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*').order('name')
    if (data) setStudents(data)
    setLoading(false)
  }

  useEffect(() => { fetchStudents() }, [])

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws)
      if (rows.length === 0) return toast.error('Excel file is empty')
      const newStudents = rows.map((r) => ({
        name: r.Name || r.name || '',
        cnic: String(r.CNIC || r.cnic || ''),
        roll_number: String(r.RollNumber || r.roll_number || r['Roll Number'] || ''),
        course: r.Course || r.course || null,
        password: null,
        is_active: false,
      })).filter(s => s.name && s.cnic && s.roll_number)
      if (newStudents.length === 0) return toast.error('No valid rows. Columns: Name, CNIC, Roll Number, Course')
      const { error } = await supabase.from('students').insert(newStudents)
      if (error) return toast.error('Upload failed: ' + error.message)
      toast.success(`${newStudents.length} students added!`)
      e.target.value = ''
      fetchStudents()
    }
    reader.readAsBinaryString(file)
  }

  const toggleActive = async (student) => {
    const { error } = await supabase
      .from('students')
      .update({ is_active: !student.is_active })
      .eq('id', student.id)
    if (error) return toast.error('Failed to update')
    toast.success(student.is_active ? 'Deactivated' : 'Activated')
    fetchStudents()
  }

  const deleteStudent = async (id) => {
    if (!confirm('Delete this student?')) return
    const { error } = await supabase.from('students').delete().eq('id', id)
    if (error) return toast.error('Failed to delete')
    toast.success('Student deleted')
    fetchStudents()
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  const courses = ['All', ...new Set(students.map(s => s.course || 'Unassigned').sort())]

  const filtered = students.filter(s =>
    (selectedCourse === 'All' || (s.course || 'Unassigned') === selectedCourse) &&
    (s.name?.toLowerCase().includes(search.toLowerCase()) ||
     s.cnic?.includes(search) ||
     s.roll_number?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Student Management</h3>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} of {students.length} students
            {selectedCourse !== 'All' && ` in ${selectedCourse}`}
          </p>
        </div>
        <label className="cursor-pointer bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Excel
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcelUpload} />
        </label>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-[#0ea5e9] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-blue-700">
          Students auto-added on registration approval. Excel columns: <strong>Name, CNIC, Roll Number, Course</strong>
        </p>
      </div>

      {/* Course Filter Tabs */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-4 mb-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
          {courses.map(c => {
            const count = c === 'All' ? students.length : students.filter(s => (s.course || 'Unassigned') === c).length
            return (
              <button key={c} onClick={() => setSelectedCourse(c)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCourse === c
                    ? 'bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {c}
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  selectedCourse === c ? 'bg-white/30 text-white' : 'bg-white text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <input type="text" placeholder="Search by name, CNIC, or roll number..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-green-50 text-gray-700">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">#</th>
                <th className="px-4 py-4 text-left font-semibold">Student</th>
                <th className="px-4 py-4 text-left font-semibold">Course</th>
                <th className="px-4 py-4 text-left font-semibold">CNIC</th>
                <th className="px-4 py-4 text-left font-semibold">Roll Number</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s, i) => {
                const isDropout = s.status === 'dropout'
                return (
                  <tr key={s.id} className={`hover:bg-gray-50 transition ${isDropout ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {s.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{s.name}</p>
                          {isDropout && <span className="text-xs text-red-500">Dropout</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full font-medium">
                        {s.course || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.cnic}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{s.roll_number}</span>
                        <button onClick={() => copyText(s.roll_number)}
                          className="text-gray-400 hover:text-[#0ea5e9] transition" title="Copy">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                        isDropout ? 'bg-red-100 text-red-600 border-red-200' :
                        s.is_active ? 'bg-green-100 text-green-700 border-green-200' :
                        'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {isDropout ? 'Dropout' : s.is_active ? '✓ Active' : '○ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {!isDropout && (
                          <button onClick={() => toggleActive(s)}
                            className={`text-xs font-medium transition ${s.is_active ? 'text-orange-500 hover:text-orange-700' : 'text-green-600 hover:text-green-800'}`}>
                            {s.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                        {!isDropout && <span className="text-gray-200">|</span>}
                        <button onClick={() => deleteStudent(s.id)}
                          className="text-xs text-red-400 hover:text-red-600 font-medium transition">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-400 text-sm font-medium">No students found</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
