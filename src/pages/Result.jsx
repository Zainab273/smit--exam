import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Result() {
  const navigate = useNavigate()
  const [rollNumber, setRollNumber] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!rollNumber.trim()) return
    
    setSearchLoading(true)
    // Simulate search
    setTimeout(() => {
      setSearchLoading(false)
      alert('Result feature coming soon!')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" alt="SMIT" style={{ height: '52px', width: 'auto' }} />
        </div>
        <div className="hidden md:flex items-center gap-7 text-base text-gray-600 font-medium">
          <span onClick={() => navigate('/home')} className="cursor-pointer hover:text-blue-600 transition">Home</span>
          <span onClick={() => navigate('/about')} className="cursor-pointer hover:text-blue-600 transition">About</span>
          <span onClick={() => navigate('/courses')} className="cursor-pointer hover:text-blue-600 transition flex items-center gap-1">
            Courses <span className="text-xs">▾</span>
          </span>
          <span className="cursor-pointer hover:text-blue-600 transition">Campuses</span>
          <span onClick={() => navigate('/result')} className="cursor-pointer text-blue-600 transition">Check Result</span>
        </div>
        <button onClick={() => navigate('/student/register')}
          className="text-white px-5 py-2 rounded-full text-sm font-bold transition flex items-center gap-1"
          style={{ background: '#0ea5e9' }}>
          Enroll Now ↗
        </button>
      </nav>

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
            <h1 className="font-black text-white leading-tight mb-3"
              style={{ fontSize: '3.5rem', lineHeight: 1.2 }}>
              Check Your Result
            </h1>
            <p className="text-white text-lg opacity-90">
              Enter your roll number to view your exam results
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="py-20 px-6 bg-gray-50">
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
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter your roll number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={searchLoading}
                className="w-full py-3 rounded-lg text-white font-bold text-base transition disabled:opacity-50"
                style={{ background: '#0ea5e9' }}>
                {searchLoading ? 'Searching...' : 'Search Result'}
              </button>
            </form>

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
