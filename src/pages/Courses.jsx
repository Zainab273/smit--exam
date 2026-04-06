import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ApplyModal from '../components/ApplyModal'

const categories = ['All', 'Development', 'Designing', 'Networking', 'Vocational', 'Entrepreneurship']
// Sample courses data
const sampleCourses = [
  { id: 1, name: 'AI & Chatbot', category: 'Development', description: 'Learn to build intelligent chatbots using AI and machine learning', duration: '5 months', status: 'open', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&q=80' },
  { id: 2, name: 'Python Programming', category: 'Development', description: 'Master Python programming from basics to advanced concepts', duration: '3 months', status: 'open', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=640&q=80' },
  { id: 3, name: 'Flutter App Development', category: 'Development', description: 'Build cross-platform mobile apps with Flutter', duration: '6 months', status: 'open', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&q=80' },
  { id: 4, name: 'Generative AI', category: 'Development', description: 'Explore the world of generative AI and create amazing applications', duration: '4 months', status: 'open', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=640&q=80' },
  { id: 5, name: '3D Animation', category: 'Designing', description: 'Create stunning 3D animations and visual effects', duration: '6 months', status: 'open', image: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=640&q=80' },
  { id: 6, name: 'Video Animation', category: 'Designing', description: 'Learn professional video animation techniques', duration: '4 months', status: 'open', image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=640&q=80' },
  { id: 7, name: 'Graphic Designing', category: 'Designing', description: 'Master graphic design tools and principles', duration: '3 months', status: 'open', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=640&q=80' },
  { id: 8, name: '3D Visualization', category: 'Designing', description: 'Create realistic 3D visualizations and renderings', duration: '5 months', status: 'open', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&q=80' },
  { id: 9, name: 'IT Professional', category: 'Networking', description: 'Comprehensive IT professional certification program', duration: '6 months', status: 'open', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80' },
  { id: 10, name: 'Cyber Security', category: 'Networking', description: 'Learn to protect systems and networks from cyber threats', duration: '5 months', status: 'open', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=640&q=80' },
  { id: 11, name: 'Cisco Certified', category: 'Networking', description: 'Get Cisco certified and advance your networking career', duration: '4 months', status: 'open', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=640&q=80' },
  { id: 12, name: 'IT Essentials', category: 'Networking', description: 'Learn fundamental IT skills and concepts', duration: '3 months', status: 'open', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=640&q=80' },
  { id: 13, name: 'CCTV Camera Installation', category: 'Vocational', description: 'Learn to install and maintain CCTV camera systems', duration: '2 months', status: 'open', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=640&q=80' },
  { id: 14, name: 'Laptop Repairing', category: 'Vocational', description: 'Master laptop hardware repair and troubleshooting', duration: '3 months', status: 'open', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=640&q=80' },
  { id: 15, name: 'Solar System Installation', category: 'Vocational', description: 'Learn to install and maintain solar power systems', duration: '3 months', status: 'open', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=640&q=80' },
  { id: 16, name: 'R/O Plant Operator', category: 'Vocational', description: 'Become a certified RO plant operator', duration: '2 months', status: 'open', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=640&q=80' },
  { id: 17, name: 'Mobile Repairing', category: 'Entrepreneurship', description: 'Learn mobile phone repair and start your business', duration: '3 months', status: 'open', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=640&q=80' },
  { id: 18, name: 'Amazon FBA Master', category: 'Entrepreneurship', description: 'Master Amazon FBA and start selling online', duration: '4 months', status: 'open', image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=640&q=80' },
  { id: 19, name: 'Freelancing', category: 'Entrepreneurship', description: 'Learn how to succeed as a freelancer', duration: '2 months', status: 'open', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=640&q=80' },
  { id: 20, name: 'Shopify E-Commerce', category: 'Entrepreneurship', description: 'Build and manage successful Shopify stores', duration: '3 months', status: 'open', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80' },
]

export default function Courses() {
  const [courses, setCourses] = useState(sampleCourses)
  const [selected, setSelected] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Try to fetch from database, fallback to sample data
    supabase.from('courses').select('*').then(({ data }) => {
      if (data && data.length > 0) setCourses(data)
    })
  }, [])

  const filtered = courses.filter((c) => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" alt="SMIT" style={{ height: '44px', width: 'auto' }} />
        </div>
        <div className="hidden md:flex items-center gap-7 text-base text-gray-600 font-medium">
          <span onClick={() => navigate('/home')} className="cursor-pointer hover:text-blue-600 transition">Home</span>
          <span onClick={() => navigate('/about')} className="cursor-pointer hover:text-blue-600 transition">About</span>
          <span onClick={() => navigate('/courses')} className="cursor-pointer text-blue-600 transition flex items-center gap-1">
            Courses <span className="text-xs">▾</span>
          </span>
          <span onClick={() => navigate(`/campuses`)} className="cursor-pointer hover:text-blue-600 transition">Campuses</span>
          <span onClick={() => navigate('/result')} className="cursor-pointer hover:text-blue-600 transition">Check Result</span>
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
            <span onClick={() => { navigate('/courses'); setMobileMenu(false) }} className="cursor-pointer text-blue-600 py-2 border-b border-gray-100">Courses</span>
            <span className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">Campuses</span>
            <span onClick={() => { navigate('/result'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">Check Result</span>
            <span onClick={() => { navigate('/student/login'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2">Login</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-white py-16 md:py-20 px-4 md:px-6 text-center mt-16"
        style={{ background: 'linear-gradient(90deg, #1e5ba8 0%, #2b7a9e 25%, #3a9b8f 50%, #5ab87d 75%, #8fd66f 100%)' }}>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4">Explore Our Courses</h1>
        <p className="text-lg mb-6 opacity-90">Discover world-class IT training programs designed for your success</p>
        <div className="max-w-md mx-auto">
          <input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-full text-gray-800 text-sm focus:outline-none shadow-lg"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-16 bg-white shadow-sm z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={activeCategory === cat ? { background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' } : {}}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <p>No courses found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} onApply={() => setSelected(course)} />
            ))}
          </div>
        )}
      </div>

      {selected && <ApplyModal course={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function CourseCard({ course, onApply }) {
  const isOpen = course.status === 'open'
  
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden group border border-gray-100">
      <div className="h-48 relative overflow-hidden">
        <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        {isOpen && (
          <div className="absolute top-3 right-3">
            <img 
              src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fadmission_open.png&w=1200&q=75" 
              alt="Admission Open" 
              className="h-12 w-auto"
            />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition text-base">{course.name}</h3>
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{course.description}</p>
        {course.duration && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500">Duration:</span>
            <span className="text-xs font-semibold text-gray-700">{course.duration}</span>
          </div>
        )}
        <button disabled={!isOpen} onClick={onApply}
          className="w-full py-2.5 rounded-full text-sm font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          style={{ background: isOpen ? 'linear-gradient(90deg, #0ea5e9, #5ab87d)' : '#e5e7eb', color: isOpen ? 'white' : '#9ca3af' }}>
          {isOpen ? 'Enroll Now' : 'Admissions Closed'}
        </button>
      </div>
    </div>
  )
}
