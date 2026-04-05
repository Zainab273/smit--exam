import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([])
  const [selected, setSelected] = useState(null)

  const fetchLeaves = async () => {
    const { data } = await supabase.from('leaves').select('*').order('created_at', { ascending: false })
    if (data) setLeaves(data)
  }

  useEffect(() => { fetchLeaves() }, [])

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('leaves').update({ status }).eq('id', id)
    if (error) return toast.error('Failed to update')
    toast.success(`Leave ${status}`)
    setSelected(null)
    fetchLeaves()
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Leave Requests</h3>
        <p className="text-sm text-gray-500 mt-1">Review and manage student leave applications</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-green-50 text-gray-700">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Student Name</th>
                <th className="px-4 py-4 text-left font-semibold">Leave Period</th>
                <th className="px-4 py-4 text-left font-semibold">Status</th>
                <th className="px-4 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-semibold text-gray-800">{l.student_name}</td>
                  <td className="px-4 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>{l.from_date}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span>{l.to_date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${statusColor[l.status]}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => setSelected(l)} className="text-[#0ea5e9] hover:text-[#5ab87d] font-medium transition">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaves.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-sm">No leave requests yet.</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold">{selected.student_name}</h3>
              <p className="text-sm text-white/80 mt-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {selected.from_date} to {selected.to_date}
              </p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Reason for Leave:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{selected.reason}</p>
              </div>
              {selected.image_url && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachment:</h4>
                  <img src={selected.image_url} alt="attachment" className="w-full rounded-lg border-2 border-gray-200 max-h-64 object-cover" />
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={`px-3 py-1.5 rounded-full font-medium border ${statusColor[selected.status]}`}>
                  {selected.status}
                </span>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
              <button onClick={() => setSelected(null)}
                className="flex-1 border-2 border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-100 transition">Close</button>
              {selected.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(selected.id, 'rejected')}
                    className="flex-1 bg-red-500 text-white rounded-lg py-3 font-medium hover:bg-red-600 transition">Reject</button>
                  <button onClick={() => updateStatus(selected.id, 'approved')}
                    className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white rounded-lg py-3 font-medium hover:shadow-lg transition">Approve</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
