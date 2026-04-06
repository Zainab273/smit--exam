import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'

export default function Result() {
  const navigate = useNavigate()
  const [rollNumber, setRollNumber] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!rollNumber.trim()) return
    setSearchLoading(true)
    setResult(null)
    setNotFound(false)

    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('roll_number', rollNumber.trim())
      .single()

    setSearchLoading(false)
    if (!data) return setNotFound(true)
    setResult(data)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" alt="SMIT" style={{ height: '44px', width: 'auto' }} />
        </div>
        <div className="hidden md:flex items-center gap-7 text-base text-gray-600 font-medium">
          <span onClick={() => navigate('/home')} className="cursor-pointer hover:text-blue-600 transition">Home</span>
          <span onClick={() => navigate('/about')} className="cursor-pointer hover:text-blue-600 transition">About</span>
          <span onClick={() => navigate('/courses')} className="cursor-pointer hover:text-blue-600 transition flex items-center gap-1">
            Courses <span className="text-xs">▾</span>
          </span>
          <span onClick={() => navigate(`/campuses`)} className="cursor-pointer hover:text-blue-600 transition">Campuses</span>
          <span onClick={() => navigate('/result')} className="cursor-pointer text-blue-600 transition">Check Result</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/student/login')}
            className="hidden sm:block border-2 border-[#0ea5e9] text-[#0ea5e9] px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition">
            Login
          </button>
          <button onClick={() => navigate('/student/register')}
            className="text-white px-4 md:px-5 py-2 rounded-full text-sm font-bold transition flex items-center gap-1"
            style={{ background: '#0ea5e9' }}>
            Enroll Now ↗
          </button>
          <button className="md:hidden ml-1 p-2 rounded-lg hover:bg-gray-100 transition" onClick={() => setMobileMenu(!mobileMenu)}>
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenu
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="fixed top-[60px] left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg md:hidden">
          <div className="flex flex-col px-4 py-3 gap-3 text-base text-gray-700 font-medium">
            <span onClick={() => { navigate('/home'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">Home</span>
            <span onClick={() => { navigate('/about'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">About</span>
            <span onClick={() => { navigate('/courses'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">Courses</span>
            <span className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">Campuses</span>
            <span onClick={() => { navigate('/result'); setMobileMenu(false) }} className="cursor-pointer text-blue-600 py-2 border-b border-gray-100">Check Result</span>
            <span onClick={() => { navigate('/student/login'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2">Login</span>
          </div>
        </div>
      )}

      {/* HERO HEADER */}
      <section className="pt-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(90deg, #1e5ba8 0%, #2b7a9e 25%, #3a9b8f 50%, #5ab87d 75%, #8fd66f 100%)', minHeight: '40vh' }}>
        <div className="flex items-center justify-center" style={{ minHeight: '40vh' }}>
          <div className="text-center px-4 relative z-10 max-w-3xl">
            <div className="flex items-center justify-center gap-2 text-white text-sm mb-4">
              <span onClick={() => navigate('/home')} className="cursor-pointer hover:underline">🏠</span>
              <span>›</span>
              <span>Check Result</span>
            </div>
            <h1 className="font-black text-white leading-tight mb-3 text-2xl md:text-4xl lg:text-5xl">
              Check Your Result
            </h1>
            <p className="text-white text-lg opacity-90">
              Enter your roll number to view your exam results
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: '#0ea5e9' }}>
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Search Your Result</h2>
              <p className="text-gray-500 text-sm">Enter your roll number to check your exam results</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => { setRollNumber(e.target.value); setResult(null); setNotFound(false) }}
                  placeholder="e.g. SMIT-2026-4823"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={searchLoading}
                className="w-full py-3 rounded-lg text-white font-bold text-base transition disabled:opacity-50"
                style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }}>
                {searchLoading ? 'Searching...' : 'Search Result'}
              </button>
            </form>

            {/* Not Found */}
            {notFound && (
              <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200 text-center">
                <svg className="w-10 h-10 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-semibold">No record found</p>
                <p className="text-red-500 text-sm mt-1">Please check your roll number and try again</p>
              </div>
            )}

            {/* Result Card */}
            {result && (
              <div className="mt-6 border-2 border-green-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
                    {result.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{result.name}</p>
                    <p className="text-sm text-white/80">Roll No: {result.roll_number}</p>
                  </div>
                </div>
                <div className="p-5 bg-white space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Course</span>
                    <span className="font-semibold text-gray-800 text-sm">{result.course || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Status</span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${result.status === 'dropout' ? 'bg-red-100 text-red-600' : result.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {result.status === 'dropout' ? 'Dropout' : result.is_active ? 'Active' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 text-sm">Enrolled Since</span>
                    <span className="font-semibold text-gray-800 text-sm">{new Date(result.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> If you don't have your roll number, please contact the administration office.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
