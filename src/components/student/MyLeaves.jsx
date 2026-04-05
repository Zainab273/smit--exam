import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../../lib/supabase'

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '⏳' },
  approved: { color: 'bg-green-100 text-green-700 border-green-200', icon: '✅' },
  rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: '❌' },
}

export default function MyLeaves() {
  const { user } = useSelector((s) => s.auth)
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leaves').select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setLeaves(data)
        setLoading(false)
      })
  }, [user.id])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">My Leave Requests</h3>
          <p className="text-sm text-gray-500 mt-1">Track the status of your leave applications</p>
        </div>
        <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white px-4 py-2 rounded-lg text-sm font-medium">
          Total: {leaves.length}
        </div>
      </div>

      {leaves.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-100 text-center py-16">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 font-medium">No leave requests yet</p>
          <p className="text-gray-300 text-sm mt-1">Submit a leave request from the "Submit Leave" tab</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => {
            const config = statusConfig[leave.status] || statusConfig.pending
            return (
              <div key={leave.id} className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-5 hover:border-[#0ea5e9] transition">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-2">{leave.reason}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{leave.from_date}</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <span>{leave.to_date}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs">{new Date(leave.created_at).toLocaleDateString()}</span>
                    </div>
                    {leave.image_url && (
                      <a href={leave.image_url} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#0ea5e9] hover:underline mt-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        View Attachment
                      </a>
                    )}
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium border whitespace-nowrap ${config.color}`}>
                    {config.icon} {leave.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
