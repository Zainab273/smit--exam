import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

export default function RegistrationManagement() {
  const [registrations, setRegistrations] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchRegistrations = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('student_registrations')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setRegistrations(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const updateStatus = async (id, status) => {
    // Find the registration
    const reg = registrations.find((r) => r.id === id)
    if (!reg) return

    // Update registration status
    const { error } = await supabase
      .from('student_registrations')
      .update({ status })
      .eq('id', id)

    if (error) return toast.error('Failed to update status')

    // If approved → add to students table so they can login
    if (status === 'approved') {
      const year = new Date().getFullYear()
      const rollNumber = `SMIT-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`

      // Check if student already exists
      const { data: existing } = await supabase
        .from('students')
        .select('id, roll_number')
        .eq('cnic', reg.id_number)
        .single()

      if (!existing) {
        const { error: studentError } = await supabase.from('students').insert({
          name: reg.full_name,
          cnic: reg.id_number,
          roll_number: rollNumber,
          course: reg.course,
          password: null,
          is_active: false,
        })

        if (studentError) {
          toast.error('Approved but failed to add student: ' + studentError.message)
        } else {
          // Also save roll_number back to registration record
          await supabase
            .from('student_registrations')
            .update({ roll_number: rollNumber })
            .eq('id', id)
          toast.success(`✅ Approved! Roll No: ${rollNumber}`)
        }
      } else {
        // Already exists, just update registration with existing roll number
        await supabase
          .from('student_registrations')
          .update({ roll_number: existing.roll_number })
          .eq('id', id)
        toast.success(`✅ Approved! Roll No: ${existing.roll_number}`)
      }
    } else {
      toast.success(`Registration ${status}!`)
    }

    setSelected(null)
    fetchRegistrations()
  }

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesFilter = filter === 'all' || reg.status === filter
    const matchesSearch = 
      reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone?.includes(searchTerm) ||
      reg.id_number?.includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Student Registrations</h3>
          <p className="text-sm text-gray-500 mt-1">Manage and review student registration applications</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map((status) => {
            const count = status === 'all' ? registrations.length : registrations.filter(r => r.status === status).length
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition flex items-center gap-2 ${
                  filter === status
                    ? 'bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#0ea5e9]'
                }`}
              >
                {status}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  filter === status ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-600'
                }`}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 mb-4 p-4">
        <input
          type="text"
          placeholder="Search by name, email, phone, or ID number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0ea5e9] transition"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-green-50 text-gray-700">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Student Info</th>
                <th className="px-4 py-4 text-left font-semibold">Course</th>
                <th className="px-4 py-4 text-left font-semibold">Contact</th>
                <th className="px-4 py-4 text-left font-semibold">Location</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {reg.picture_url ? (
                        <img src={reg.picture_url} alt={reg.full_name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] flex items-center justify-center text-white font-bold">
                          {reg.full_name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{reg.full_name}</p>
                        <p className="text-xs text-gray-500">{reg.id_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-700">{reg.course}</p>
                    <p className="text-xs text-gray-500">{reg.class_preference}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-700">{reg.phone}</p>
                    <p className="text-xs text-gray-500">{reg.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-700">{reg.city}</p>
                    <p className="text-xs text-gray-500">{reg.country}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${statusColors[reg.status]}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelected(reg)}
                      className="text-[#0ea5e9] hover:text-[#5ab87d] font-medium text-sm transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400 text-sm">No registrations found</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
            <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selected.picture_url ? (
                    <img src={selected.picture_url} alt={selected.full_name} className="w-16 h-16 rounded-full border-4 border-white object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {selected.full_name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold">{selected.full_name}</h3>
                    <p className="text-sm text-white/80">Registration Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-lg border-b-2 border-[#0ea5e9] pb-2">Personal Information</h4>
                  <InfoRow label="Full Name" value={selected.full_name} />
                  <InfoRow label="Father's Name" value={selected.father_name} />
                  <InfoRow label="Date of Birth" value={selected.dob} />
                  <InfoRow label="Gender" value={selected.gender} />
                  <InfoRow label="ID Number" value={selected.id_number} />
                  <InfoRow label="Father's ID" value={selected.father_id_number} />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-lg border-b-2 border-[#5ab87d] pb-2">Contact Information</h4>
                  <InfoRow label="Email" value={selected.email} />
                  <InfoRow label="Phone" value={selected.phone} />
                  <InfoRow label="Father's Phone" value={selected.father_phone} />
                  <InfoRow label="Address" value={selected.address} />
                  <InfoRow label="City" value={selected.city} />
                  <InfoRow label="Country" value={selected.country} />
                </div>

                {/* Course Details */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-lg border-b-2 border-[#0ea5e9] pb-2">Course Details</h4>
                  <InfoRow label="Course" value={selected.course} />
                  <InfoRow label="Class Preference" value={selected.class_preference} />
                  <InfoRow label="Campus" value={selected.campus} />
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 text-lg border-b-2 border-[#5ab87d] pb-2">Additional Information</h4>
                  <InfoRow label="Computer Proficiency" value={selected.computer_proficiency} />
                  <InfoRow label="Last Qualification" value={selected.last_qualification} />
                  <InfoRow label="Has Laptop" value={selected.has_laptop} />
                  <InfoRow label="Heard About" value={selected.hear_about} />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t-2 border-gray-100">
                <InfoRow label="Registration Date" value={new Date(selected.created_at).toLocaleString()} />
                {selected.roll_number && (
                  <InfoRow label="Roll Number" value={
                    <span className="font-mono text-[#0ea5e9] font-bold">{selected.roll_number}</span>
                  } />
                )}
                <InfoRow label="Current Status" value={
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${statusColors[selected.status]}`}>
                    {selected.status}
                  </span>
                } />
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-2xl">
              {selected.status === 'pending' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-blue-700">
                    Approving will automatically add <strong>{selected.full_name}</strong> to the Students list with a generated Roll Number. They can then sign up using their CNIC.
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-100 transition"
                >
                  Close
                </button>
                {selected.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(selected.id, 'rejected')}
                      className="flex-1 bg-red-500 text-white rounded-lg py-3 font-medium hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateStatus(selected.id, 'approved')}
                      className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white rounded-lg py-3 font-medium hover:shadow-lg transition"
                    >
                      ✅ Approve & Add Student
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-gray-500 font-medium">{label}:</span>
      <span className="text-sm text-gray-800 font-semibold text-right">{value || 'N/A'}</span>
    </div>
  )
}
