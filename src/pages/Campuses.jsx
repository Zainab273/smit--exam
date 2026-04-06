import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const CITIES = [
  { name: 'Karachi',      campuses: 14, top: '78%', left: '38%' },
  { name: 'Hyderabad',    campuses: 3,  top: '70%', left: '44%' },
  { name: 'Sukkur',       campuses: 1,  top: '58%', left: '46%' },
  { name: 'Quetta',       campuses: 1,  top: '50%', left: '22%' },
  { name: 'Faisalabad',   campuses: 1,  top: '35%', left: '55%' },
  { name: 'Lahore',       campuses: 2,  top: '32%', left: '60%' },
  { name: 'Islamabad',    campuses: 1,  top: '25%', left: '54%' },
  { name: 'Rawalpindi',   campuses: 1,  top: '27%', left: '53%' },
  { name: 'Peshawar',     campuses: 1,  top: '22%', left: '46%' },
  { name: 'Gujranwala',   campuses: 1,  top: '30%', left: '58%' },
  { name: 'Multan',       campuses: 1,  top: '44%', left: '52%' },
  { name: 'Lakki Marwat', campuses: 1,  top: '28%', left: '48%' },
  { name: 'Ghotki',       campuses: 1,  top: '52%', left: '48%' },
  { name: 'Turbat',       campuses: 1,  top: '68%', left: '18%' },
]

const totalCities    = CITIES.length
const totalCampuses  = CITIES.reduce((s, c) => s + c.campuses, 0)

export default function Campuses() {
  const navigate       = useNavigate()
  const [selected, setSelected] = useState('')

  const filtered = selected
    ? CITIES.filter(c => c.name === selected)
    : CITIES

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-1">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png"
            alt="SMIT" style={{ height: '44px', width: 'auto' }} />
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm text-gray-600 font-medium">
          <span onClick={() => navigate('/home')} className="cursor-pointer hover:text-[#0ea5e9] transition">Home</span>
          <span onClick={() => navigate('/about')} className="cursor-pointer hover:text-[#0ea5e9] transition">About</span>
          <span onClick={() => navigate('/courses')} className="cursor-pointer hover:text-[#0ea5e9] transition">Courses</span>
          <span className="cursor-pointer text-[#0ea5e9] font-semibold">Campuses</span>
          <span onClick={() => navigate('/result')} className="cursor-pointer hover:text-[#0ea5e9] transition">Check Result</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/student/login')}
            className="border-2 border-[#0ea5e9] text-[#0ea5e9] px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition">
            Login
          </button>
          <button onClick={() => navigate('/student/register')}
            className="text-white px-5 py-2 rounded-full text-sm font-bold transition"
            style={{ background: '#0ea5e9' }}>
            Enroll Now ↗
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="pt-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(90deg, #1e5ba8 0%, #2b7a9e 25%, #3a9b8f 50%, #5ab87d 75%, #8fd66f 100%)', minHeight: '180px' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="cursor-pointer hover:text-white" onClick={() => navigate('/home')}>Home</span>
            <span>›</span>
            <span className="text-white font-medium">Campuses</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Our Campuses</h1>
          <p className="text-white/80 text-base max-w-md">
            Find SMIT training centers across Pakistan - bringing quality IT education closer to you
          </p>
        </div>
      </div>

      {/* CAMPUS IMAGES SECTION */}
      <div className="py-10 px-4 md:px-6" style={{ background: '#f0f4f8' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNKHsw5622-f2aoE1u-XdTsMP2bx4HoEQfKA&s',
                city: 'Karachi', campuses: 14, desc: 'Main Hub - Bahadurabad'
              },
              {
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ97-cRNPEZop55Vlt-cOICZ94s59DfgHvvRA&s',
                city: 'Lahore', campuses: 2, desc: 'Punjab Campus'
              },
              {
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5BbCzGCrvh5vNF3FqoOZMFesX9hk-vQUz0w&s',
                city: 'Islamabad', campuses: 1, desc: 'Federal Capital Campus'
              },
              {
                img: 'https://pbs.twimg.com/amplify_video_thumb/1926328976214990848/img/brg-7LMQ5ovnj5ji.jpg',
                city: 'Hyderabad', campuses: 3, desc: 'Sindh Campus'
              },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group">
                <div className="relative h-64 overflow-hidden">
                  <img src={c.img} alt={c.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-black text-xl">{c.city}</p>
                    <p className="text-sm text-white/80">{c.desc}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 text-[#0ea5e9] text-xs font-bold px-2.5 py-1 rounded-full">
                    {c.campuses} {c.campuses === 1 ? 'Campus' : 'Campuses'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CITY SELECTOR + GRID */}
      <div className="py-10 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Select a City to View Campuses</p>
              <div className="relative">
                <select
                  value={selected}
                  onChange={e => setSelected(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:border-[#0ea5e9] transition bg-white"
                  style={{ minWidth: '220px' }}>
                  <option value="">Choose a city...</option>
                  {CITIES.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Stats badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-[#0ea5e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-sm font-bold text-gray-700">{totalCities} Cities</span>
              </div>
              <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-[#5ab87d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-bold text-gray-700">{totalCampuses} Campuses</span>
              </div>
            </div>
          </div>

          {/* City grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filtered.map((city, i) => (
              <div key={i}
                className={`cursor-pointer p-4 rounded-xl border transition hover:border-[#0ea5e9] hover:shadow-sm ${selected === city.name ? 'border-[#0ea5e9] bg-blue-50' : 'border-gray-100 bg-white'}`}
                onClick={() => setSelected(city.name === selected ? '' : city.name)}>
                <div className="flex items-center gap-1.5 mb-2">
                  <svg className="w-4 h-4 text-[#0ea5e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">{city.name}</span>
                </div>
                <p className="text-3xl font-black text-gray-900">{city.campuses}</p>
                <p className="text-xs text-gray-400 mt-0.5">{city.campuses === 1 ? 'Campus' : 'Campuses'}</p>
              </div>
            ))}
          </div>

          {/* Selected city detail */}
          {selected && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-gray-800 text-lg">{selected}</h3>
                  <p className="text-sm text-gray-500">{CITIES.find(c => c.name === selected)?.campuses} Campus{CITIES.find(c => c.name === selected)?.campuses > 1 ? 'es' : ''} Available</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: CITIES.find(c => c.name === selected)?.campuses || 0 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#0ea5e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">SMIT {selected} Campus {i + 1}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Saylani Mass IT Training Center</p>
                      <p className="text-xs text-[#0ea5e9] font-medium mt-1">📞 +92 21 111 729 526</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
