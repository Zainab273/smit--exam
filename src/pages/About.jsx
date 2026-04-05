import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" alt="SMIT" style={{ height: '52px', width: 'auto' }} />
        </div>
        <div className="hidden md:flex items-center gap-7 text-base text-gray-600 font-medium">
          <span onClick={() => navigate('/home')} className="cursor-pointer hover:text-blue-600 transition">Home</span>
          <span onClick={() => navigate('/about')} className="cursor-pointer text-blue-600 transition">About</span>
          <span onClick={() => navigate('/courses')} className="cursor-pointer hover:text-blue-600 transition flex items-center gap-1">
            Courses <span className="text-xs">▾</span>
          </span>
          <span className="cursor-pointer hover:text-blue-600 transition">Campuses</span>
          <span onClick={() => navigate('/result')} className="cursor-pointer hover:text-blue-600 transition">Check Result</span>
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
              <span>About Us</span>
            </div>
            <h1 className="font-black text-white leading-tight mb-3"
              style={{ fontSize: '3.5rem', lineHeight: 1.2 }}>
              About SMIT
            </h1>
            <p className="text-white text-lg opacity-90">
              Empowering individuals through world-class IT education
            </p>
          </div>
        </div>
      </section>

      {/* OUR FOUNDATION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: '#5ab87d' }}>OUR FOUNDATION</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                Bridging the Digital Divide Through Education
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  SMIT, an initiative of Saylani Welfare International Trust, is dedicated to providing <span className="font-semibold text-gray-900">high-quality, modern IT training</span> to underprivileged and aspiring students across the globe. Our mission is simple: to equip the next generation with the coding and digital skills necessary to thrive in the 21st-century economy, irrespective of their financial background.
                </p>
                <p>
                  We believe access to top-tier technological education is a right, not a privilege. By focusing intensely on <span className="font-semibold text-gray-900">practical application and job readiness</span>, we ensure our graduates are prepared to compete in the global marketplace.
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
                  alt="SMIT Students" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-6"
        style={{ background: 'linear-gradient(90deg, #1e5ba8 0%, #2b7a9e 25%, #3a9b8f 50%, #5ab87d 75%, #8fd66f 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
            Join Pakistan's Tech Revolution – Enroll Today & Build Your Future!
          </h2>
          <button onClick={() => navigate('/student/register')}
            className="bg-white text-gray-700 px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition inline-flex items-center gap-2">
            Enroll Now →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
