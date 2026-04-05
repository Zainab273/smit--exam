import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ApplyModal({ course, onClose }) {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Apply for Course</h3>
              <p className="text-sm text-white/80 mt-1">{course.name}</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Course Info */}
        <div className="p-6">
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              {course.image && (
                <img src={course.image} alt={course.name} className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div>
                <h4 className="font-bold text-gray-800">{course.name}</h4>
                {course.duration && <p className="text-sm text-gray-500">⏱ Duration: {course.duration}</p>}
                {course.category && <p className="text-sm text-gray-500">📂 {course.category}</p>}
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-6 text-center">
            To apply for this course, please fill out the complete registration form.
          </p>

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button onClick={() => { onClose(); navigate('/student/register') }}
              className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white rounded-lg py-3 font-medium hover:shadow-lg transition">
              Go to Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
