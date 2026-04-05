import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const emptyForm = { name: '', description: '', status: 'open' }

export default function CourseManagement() {
  const [courses, setCourses] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
    if (data) setCourses(data)
  }

  useEffect(() => { fetchCourses() }, [])

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true) }
  const openEdit = (c) => { setForm({ name: c.name, description: c.description, status: c.status }); setEditId(c.id); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    let error
    if (editId) {
      const result = await supabase.from('courses').update({ name: form.name, status: form.status }).eq('id', editId).select()
      error = result.error
    } else {
      const result = await supabase.from('courses').insert(form).select()
      error = result.error
    }
    if (error) return toast.error('Failed to save course: ' + error.message)
    toast.success(editId ? 'Course updated!' : 'Course added!')
    setModal(false)
    fetchCourses()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Course Management</h3>
          <p className="text-sm text-gray-500 mt-1">Manage available courses and their status</p>
        </div>
        <button onClick={openAdd} className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition">
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Course
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-green-50 text-gray-700">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Course Name</th>
                <th className="px-4 py-4 text-left font-semibold">Category</th>
                <th className="px-4 py-4 text-left font-semibold">Duration</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-semibold text-gray-800">{c.name}</td>
                  <td className="px-4 py-4 text-gray-600">{c.category || 'N/A'}</td>
                  <td className="px-4 py-4 text-gray-600">{c.duration || 'N/A'}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${c.status === 'open' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => openEdit(c)} className="text-[#0ea5e9] hover:text-[#5ab87d] font-medium transition">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-gray-400 text-sm">No courses yet. Add your first course.</p>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold">{editId ? 'Edit Course' : 'Add New Course'}</h3>
              <p className="text-sm text-white/80 mt-1">Fill in the course details</p>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                <input required placeholder="Enter course name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
              </div>
              {!editId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea placeholder="Enter course description" rows={3} value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0ea5e9] transition" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0ea5e9] transition">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white rounded-lg py-3 font-medium hover:shadow-lg transition">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
