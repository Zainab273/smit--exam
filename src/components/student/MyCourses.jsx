import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ApplyModal from '../ApplyModal'

export default function MyCourses() {
  const [courses, setCourses] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('courses').select('*').order('name').then(({ data }) => {
      if (data) setCourses(data)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Available Courses</h3>
        <p className="text-sm text-gray-500 mt-1">Browse and apply for available courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const isOpen = course.status === 'open'
          return (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden hover:border-[#0ea5e9] transition group">
              {course.image && (
                <div className="h-40 overflow-hidden relative">
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  {isOpen && (
                    <div className="absolute top-2 right-2">
                      <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fadmission_open.png&w=1200&q=75"
                        alt="Admission Open" className="h-10 w-auto" />
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-gray-800 text-sm">{course.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium border flex-shrink-0 ${isOpen ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                {course.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                )}
                {course.duration && (
                  <p className="text-xs text-gray-400 mb-3">⏱ {course.duration}</p>
                )}
                <button disabled={!isOpen} onClick={() => setSelected(course)}
                  className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: isOpen ? 'linear-gradient(90deg, #0ea5e9, #5ab87d)' : '#e5e7eb', color: isOpen ? 'white' : '#9ca3af' }}>
                  {isOpen ? 'Apply Now' : 'Admissions Closed'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selected && <ApplyModal course={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
