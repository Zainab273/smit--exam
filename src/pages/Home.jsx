import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { supabase } from '../lib/supabase'
import ApplyModal from '../components/ApplyModal'
import Footer from '../components/Footer'

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

const stats = [
  { label: 'STUDENTS TRAINED', value: 50000, suffix: '+' },
  { label: 'TRAINERS', value: 200, suffix: '+' },
  { label: 'EMPLOYMENT SUCCESS', value: 70, suffix: '%' },
  { label: 'STARTUPS LAUNCHED', value: 150, suffix: '+' },
]

const features = [
  { icon: '🛠️', title: 'Hands-On Training &', sub: 'Real-World Projects' },
  { icon: '👨‍💼', title: '70% Employment &', sub: 'Freelancing Success Rate' },
  { icon: '🌍', title: '150+ Startups Launched', sub: 'Globally' },
  { icon: '🎓', title: 'Affordable & Accessible', sub: 'Education for All' },
  { icon: '🏅', title: 'Recognized by Cisco &', sub: 'Global Tech Giants' },
  { icon: '💻', title: "Pakistan's Largest IT", sub: 'Training Provider' },
]

const reviews = [
  { name: 'Muhammad Saad', course: 'Web Development', text: 'SMIT changed my life. I got a job within 2 months of completing my course.' },
  { name: 'Kamran Ahmed', course: 'Flutter Dev', text: 'Best IT institute in Pakistan. Trainers are highly professional and supportive.' },
  { name: 'Wahaj Ahmed', course: 'Graphic Design', text: 'Affordable and world-class training. Highly recommend to everyone.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [selected, setSelected] = useState(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [whyVisible, setWhyVisible] = useState(false)
  const [visionVisible, setVisionVisible] = useState(false)
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const statsRef = useRef(null)
  const whyRef = useRef(null)
  const visionRef = useRef(null)
  const heroRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    supabase.from('courses').select('*').limit(6).then(({ data }) => {
      if (data) setCourses(data)
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWhyVisible(true) },
      { threshold: 0.2 }
    )
    if (whyRef.current) observer.observe(whyRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisionVisible(true) },
      { threshold: 0.2 }
    )
    if (visionRef.current) observer.observe(visionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar slide down
      gsap.from(navRef.current, {
        y: -80, opacity: 0, duration: 0.8, ease: 'power3.out'
      })

      // Hero text
      gsap.from('.hero-title', {
        x: -60, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.3
      })
      gsap.from('.hero-sub', {
        x: -40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5
      })
      gsap.from('.hero-logo', {
        y: 20, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.7
      })
      gsap.from('.hero-btns', {
        y: 30, opacity: 0, duration: 0.8, ease: 'back.out(1.5)', delay: 0.9
      })

      // Laptop icon
      gsap.from('.laptop-icon', {
        x: -80, opacity: 0, rotation: -20,
        duration: 1, ease: 'back.out(1.7)', delay: 0.4
      })
      gsap.to('.laptop-icon', {
        y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5
      })

      // Globe icon
      gsap.from('.globe-icon', {
        x: 80, opacity: 0, rotation: 20,
        duration: 1, ease: 'back.out(1.7)', delay: 0.6
      })
      gsap.to('.globe-icon', {
        y: 12, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5
      })

      // Dashed arrows draw
      gsap.from('.arrow-left', {
        opacity: 0, scaleX: 0, duration: 1.2, ease: 'power2.out', delay: 1.0, transformOrigin: 'left center'
      })
      gsap.from('.arrow-right', {
        opacity: 0, scaleX: 0, duration: 1.2, ease: 'power2.out', delay: 1.1, transformOrigin: 'right center'
      })
      gsap.from('.arrow-top', {
        opacity: 0, scaleX: 0, duration: 1, ease: 'power2.out', delay: 1.2, transformOrigin: 'right center'
      })

    }, heroRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!whyVisible) return
    const ctx = gsap.context(() => {
      // Center content fade in
      gsap.from('.why-center', {
        scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.7)'
      })

      // Features animate in circular pattern with stagger
      gsap.from('.why-feature-1', {
        x: -100, y: -100, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.3
      })
      gsap.from('.why-feature-2', {
        x: 100, y: -100, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.4
      })
      gsap.from('.why-feature-3', {
        x: -100, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.5
      })
      gsap.from('.why-feature-4', {
        x: 100, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.6
      })
      gsap.from('.why-feature-5', {
        x: -100, y: 100, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.7
      })
      gsap.from('.why-feature-6', {
        x: 100, y: 100, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.8
      })

      // Floating animation for icons
      gsap.to('.why-feature', {
        y: -10, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.2, delay: 1.5
      })
    }, whyRef)
    return () => ctx.revert()
  }, [whyVisible])

  useEffect(() => {
    if (!visionVisible) return
    const ctx = gsap.context(() => {
      // Set initial state to visible with opacity 0
      gsap.set('.vision-header', { opacity: 0, y: 20 })
      gsap.set('.vision-card-1', { opacity: 0, y: 40 })
      gsap.set('.vision-card-2', { opacity: 0, y: 40 })
      
      // Animate to visible state
      gsap.to('.vision-header', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
      })
      gsap.to('.vision-card-1', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3
      })
      gsap.to('.vision-card-2', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.5
      })
    }, visionRef)
    return () => ctx.revert()
  }, [visionVisible])

  // Portal section animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        // Header
        gsap.fromTo('.portal-header', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })

        // Rings
        gsap.fromTo('.portal-ring', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.3 })

        // Center
        gsap.fromTo('.portal-center', { scale: 0, opacity: 0, y: -30 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(2)', delay: 0.5 })
        gsap.to('.portal-center', { y: -10, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 })

        // Lines
        gsap.to('.portal-line', { strokeDashoffset: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.8 })

        // Cards
        gsap.fromTo('.portal-card', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.8)', delay: 0.9 })
        gsap.to('.portal-card-0', { y: -8, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.8 })
        gsap.to('.portal-card-1', { y: -10, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.0 })
        gsap.to('.portal-card-2', { y: 8, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.9 })
        gsap.to('.portal-card-3', { y: 9, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.1 })

        // Dots
        gsap.fromTo('.portal-dot', { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.5, duration: 0.4, stagger: 0.1, ease: 'back.out(2)', delay: 1.2 })
        gsap.to('.portal-dot', { y: -8, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.25, delay: 1.8 })

        // CTA
        gsap.fromTo('.portal-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.4 })
      }, { threshold: 0.2 })

      const section = document.querySelector('.portal-header')
      if (section) observer.observe(section.closest('section') || section)
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-white" ref={heroRef}>

      {/* NAVBAR */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" alt="SMIT" style={{ height: '44px', width: 'auto' }} />
        </div>
        <div className="hidden md:flex items-center gap-7 text-base text-gray-600 font-medium">
          <span onClick={() => navigate('/home')} className="cursor-pointer hover:text-blue-600 transition">Home</span>
          <span onClick={() => navigate('/about')} className="cursor-pointer hover:text-blue-600 transition">About</span>
          <div className="relative"
            onMouseEnter={() => setShowCoursesDropdown(true)}
            onMouseLeave={() => setShowCoursesDropdown(false)}>
            <span onClick={() => navigate('/courses')} className="cursor-pointer hover:text-blue-600 transition flex items-center gap-1">
              Courses <span className="text-xs">▾</span>
            </span>
            {showCoursesDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 w-[950px]">
                <div className="grid grid-cols-5 gap-6 mb-6">
                  {/* Development */}
                  <div>
                    <h3 className="text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2"
                      style={{ color: '#0ea5e9' }}>
                      <span>💻</span> Development
                    </h3>
                    <div className="space-y-2.5">
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Flutter App Development
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> AI & Chatbot
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Python Programming
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Generative AI
                      </div>
                    </div>
                  </div>

                  {/* Designing */}
                  <div>
                    <h3 className="text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2"
                      style={{ color: '#5ab87d' }}>
                      <span>🎨</span> Designing
                    </h3>
                    <div className="space-y-2.5">
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> 3D Animation
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> 3D Visualization
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Video Animation
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Graphic Designing
                      </div>
                    </div>
                  </div>

                  {/* Networking */}
                  <div>
                    <h3 className="text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2"
                      style={{ color: '#0ea5e9' }}>
                      <span>🌐</span> Networking
                    </h3>
                    <div className="space-y-2.5">
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> IT Professional
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Cyber Security
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Cisco Certified
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> IT Essentials
                      </div>
                    </div>
                  </div>

                  {/* Entrepreneurship */}
                  <div>
                    <h3 className="text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2"
                      style={{ color: '#5ab87d' }}>
                      <span>💼</span> Entrepreneurship
                    </h3>
                    <div className="space-y-2.5">
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Mobile Repairing
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Amazon FBA Master
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Freelancing
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Shopify E-Commerce
                      </div>
                    </div>
                  </div>

                  {/* Vocational Training */}
                  <div>
                    <h3 className="text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2"
                      style={{ color: '#0ea5e9' }}>
                      <span>🔧</span> Vocational
                    </h3>
                    <div className="space-y-2.5">
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> CCTV Camera Install
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Laptop Repairing
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> Solar System Install
                      </div>
                      <div onClick={() => navigate('/courses')} className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition">
                        <span className="text-xs">🎓</span> R/O Plant Operator
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Courses Section */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#5ab87d' }}>🎓 Top Courses</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div onClick={() => navigate('/courses')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 cursor-pointer transition">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: 'linear-gradient(135deg, #0ea5e9, #5ab87d)' }}>
                        AI
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">AI & Chatbot</p>
                        <p className="text-xs text-gray-500">5 months</p>
                      </div>
                    </div>
                    <div onClick={() => navigate('/courses')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 cursor-pointer transition">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: 'linear-gradient(135deg, #0ea5e9, #5ab87d)' }}>
                        PY
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Python Programming</p>
                        <p className="text-xs text-gray-500">3 months</p>
                      </div>
                    </div>
                    <div onClick={() => navigate('/courses')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 cursor-pointer transition">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: 'linear-gradient(135deg, #0ea5e9, #5ab87d)' }}>
                        3D
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">3D Animation</p>
                        <p className="text-xs text-gray-500">6 months</p>
                      </div>
                    </div>
                    <div onClick={() => navigate('/courses')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 cursor-pointer transition">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: 'linear-gradient(135deg, #0ea5e9, #5ab87d)' }}>
                        MB
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Mobile Repairing</p>
                        <p className="text-xs text-gray-500">3 months</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-5">
                    <button onClick={() => navigate('/courses')} className="text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg transition"
                      style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }}>
                      See All Courses →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
          {/* Hamburger */}
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
            <span onClick={() => { navigate('/result'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">Check Result</span>
            <span onClick={() => { navigate('/student/login'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2">Login</span>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="pt-16 relative overflow-hidden"
        style={{ background: '#eef2f7', minHeight: '85vh' }}>

        {/* Laptop - left of "Building" text */}
        <div className="laptop-icon absolute w-28 hidden md:block" style={{ left: '24%', top: '25%' }}>
          <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Flaptop_icon.png&w=128&q=75" alt="laptop" className="w-full" />
        </div>

        {/* Up arrow - right of "Pakistan's", top right */}
        <div className="arrow-top absolute w-32 hidden md:block" style={{ top: '28%', right: '28%' }}>
          <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fup_arrow.png&w=256&q=75" alt="" className="w-full" />
        </div>

        {/* Globe - right side, middle */}
        <div className="globe-icon absolute w-28 hidden md:block" style={{ right: '26%', top: '60%' }}>
          <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fglobe_icon.png&w=128&q=75" alt="globe" className="w-full" />
        </div>

        {/* Down arrow - left of enroll button, bottom */}
        <div className="arrow-left absolute w-40 hidden md:block" style={{ bottom: '25%', left: '28%' }}>
          <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fdown_arrow.png&w=256&q=75" alt="" className="w-full" />
        </div>

        {/* Center text */}
        <div className="flex items-center justify-center" style={{ minHeight: '85vh', marginTop: '-110px' }}>
          <div className="text-center px-4 relative z-10" style={{ maxWidth: 520 }}>
            <h1 className="hero-title font-black text-gray-900 leading-tight mb-3 text-center text-3xl md:text-5xl"
              style={{ lineHeight: 1.2 }}>
              Building Pakistan's<br />
              <span style={{ color: '#0ea5e9' }}>Tech Future</span>
            </h1>
            <p className="hero-sub text-gray-500 mb-3 leading-relaxed text-base md:text-2xl">
              Changing Lives. Building Careers. Shaping the<br />Future.
            </p>
            <div className="hero-logo flex items-center justify-center mb-6">
              <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fsaylani_logo.png&w=128&q=75" alt="Saylani" className="h-8" />
            </div>
            <div className="hero-btns flex gap-3 justify-center flex-wrap">
              <button onClick={() => navigate('/student/register')}
                className="text-white px-7 py-2.5 rounded-full font-bold text-sm transition tracking-wide"
                style={{ background: '#0ea5e9' }}>
                ENROLL NOW
              </button>
              <button onClick={() => navigate('/student/login')}
                className="border-2 border-gray-300 text-gray-700 px-7 py-2.5 rounded-full font-bold text-sm hover:border-gray-500 transition tracking-wide bg-white">
                STUDENT LOGIN
              </button>
              <button onClick={() => navigate('/student/signup')}
                className="border-2 text-white px-7 py-2.5 rounded-full font-bold text-sm transition tracking-wide"
                style={{ borderColor: '#5ab87d', background: '#5ab87d' }}>
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-14" 
        style={{ background: 'linear-gradient(90deg, #1e5ba8 0%, #2b7a9e 25%, #3a9b8f 50%, #5ab87d 75%, #8fd66f 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center text-white">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} start={statsVisible} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section ref={whyRef} className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: simple grid layout */}
          <div className="md:hidden">
            <div className="text-center mb-8">
              <button className="text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-md"
                style={{ background: '#0ea5e9' }}>
                Why Choose SMIT?
              </button>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">
                Empowering You with World-Class IT Training & Proven Success
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 text-xs mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: circular layout */}
          <div className="hidden md:block">
          <div className="relative min-h-[700px] flex items-center justify-center">
            
            {/* Center Content */}
            <div className="why-center text-center z-10 max-w-2xl px-4">
              <button className="text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-md"
                style={{ background: '#0ea5e9' }}>
                Why Choose SMIT?
              </button>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Empowering You with World-Class IT Training & Proven Success
              </h2>
            </div>

            {/* Top Left */}
            <div className="why-feature why-feature-1 absolute top-8 left-[30%] text-center max-w-[180px]">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center shadow-md">
                <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fonline_learning.png&w=64&q=75" alt="Hands-On Training" className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Hands-On Training &</h3>
              <p className="text-xs text-gray-500">Real-World Projects</p>
            </div>

            {/* Top Right */}
            <div className="why-feature why-feature-2 absolute top-8 right-[30%] text-center max-w-[180px]">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center shadow-md">
                <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fmale_freelancer.png&w=64&q=75" alt="Employment" className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">70% Employment &</h3>
              <p className="text-xs text-gray-500">Freelancing Success Rate</p>
            </div>

            {/* Left Side */}
            <div className="why-feature why-feature-3 absolute left-4 top-1/2 -translate-y-1/2 text-center max-w-[180px]">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center shadow-md">
                <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fgraduate_cap.png&w=64&q=75" alt="Affordable Education" className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Affordable & Accessible</h3>
              <p className="text-xs text-gray-500">Education for All</p>
            </div>

            {/* Right Side */}
            <div className="why-feature why-feature-4 absolute right-4 top-1/2 -translate-y-1/2 text-center max-w-[180px]">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center shadow-md">
                <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fearth_icon.png&w=64&q=75" alt="Startups" className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">150+ Startups Launched</h3>
              <p className="text-xs text-gray-500">Globally</p>
            </div>

            {/* Bottom Left */}
            <div className="why-feature why-feature-5 absolute bottom-8 left-[28%] text-center max-w-[180px]">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center shadow-md">
                <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fcisco_icon.png&w=64&q=75" alt="Cisco" className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Recognized by Cisco &</h3>
              <p className="text-xs text-gray-500">Global Tech Giants</p>
            </div>

            {/* Bottom Right */}
            <div className="why-feature why-feature-6 absolute bottom-8 right-[28%] text-center max-w-[180px]">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center shadow-md">
                <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fapprenticeship.png&w=64&q=75" alt="Largest IT" className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Pakistan's Largest IT</h3>
              <p className="text-xs text-gray-500">Training Provider</p>
            </div>

          </div>
          </div>{/* end desktop */}
        </div>
      </section>

      {/* SMIT VISION */}
      <section ref={visionRef} className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="vision-header text-center mb-12">
            <button className="text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-md"
              style={{ background: '#0ea5e9' }}>
              SMIT VISION
            </button>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              SMIT <span style={{ color: '#0ea5e9' }}>Vision</span>
            </h2>
            <p className="text-gray-600 text-base">
              Empowering <span className="font-bold" style={{ color: '#0ea5e9' }}>10 million IT experts</span> to drive Pakistan's <span className="font-bold" style={{ color: '#0ea5e9' }}>$100 billion</span><br />
              digital economy
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 10 Million+ IT Experts */}
            <div className="vision-card-1 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: '#0ea5e9' }}>
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-2" style={{ color: '#0ea5e9' }}>
                10 Million+
              </h3>
              <p className="text-base font-bold text-gray-800 mb-3">
                IT Experts <span style={{ color: '#0ea5e9' }}>●</span>
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Training the next generation of skilled IT professionals to compete globally and drive innovation
              </p>
            </div>

            {/* $100 Billion Digital Economy */}
            <div className="vision-card-2 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: '#0ea5e9' }}>
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-2" style={{ color: '#0ea5e9' }}>
                $100 Billion
              </h3>
              <p className="text-base font-bold text-gray-800 mb-3">
                Digital Economy <span style={{ color: '#0ea5e9' }}>●</span>
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Contributing to Pakistan's economic growth through technology, innovation, and digital transformation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FACEBOOK POSTS */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <button className="text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-md"
              style={{ background: '#1877F2' }}>
              📘 Facebook Updates
            </button>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Latest from <span style={{ color: '#1877F2' }}>SMIT</span>
            </h2>
            <p className="text-gray-500 text-base">Stay updated with our latest news, events and announcements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                date: 'April 2, 2026',
                text: '🎉 New batch starting soon! Admissions are now open for Web Development, Flutter, AI & Chatbot, and Graphic Designing courses. Limited seats available — register now at saylanimit.com',
                likes: 1243,
                comments: 87,
                shares: 312,
                img: 'https://www.saylanimit.com/_next/image?url=%2Fassets%2Fadmission_open.png&w=1200&q=75',
              },
              {
                date: 'March 28, 2026',
                text: '🏆 Congratulations to our students who secured top positions in the National IT Competition 2026! SMIT is proud of your achievements. Keep inspiring others!',
                likes: 2891,
                comments: 145,
                shares: 567,
                img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=640&q=80',
              },
              {
                date: 'March 20, 2026',
                text: '💼 Job Placement Drive: 50+ companies visiting SMIT campuses this month. Our students are getting hired by top tech companies. Your dream job is closer than you think!',
                likes: 3102,
                comments: 203,
                shares: 891,
                img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=640&q=80',
              },
            ].map((post, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition">
                <div className="h-44 overflow-hidden">
                  <img src={post.img} alt="post" className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: '#1877F2' }}>
                      f
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Saylani MIT</p>
                      <p className="text-xs text-gray-400">{post.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4">{post.text}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span>👍</span> {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>💬</span> {post.comments}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <span>↗</span> {post.shares} shares
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a href="https://www.facebook.com/saylanimit" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg transition"
              style={{ background: '#1877F2' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Follow SMIT on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* COURSE SHOWCASE - Marquee + Flip Cards */}
      <section className="py-16 px-4 md:px-6 overflow-hidden" style={{ background: '#f8faff' }}>
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-white px-5 py-1.5 rounded-full text-xs font-bold mb-4 shadow-md"
              style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }}>
              🔥 Most Popular
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Courses That{' '}
              <span style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Change Lives
              </span>
            </h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">
              Hover over any course to see details. Join thousands of students already enrolled.
            </p>
          </div>

          {/* Flip Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-12">
            {[
              { name: 'AI & Chatbot',   icon: '🤖', color: '#0ea5e9', students: '2,400', duration: '5 months', desc: 'Build intelligent chatbots using latest AI models' },
              { name: 'Generative AI',  icon: '✨', color: '#f97316', students: '3,100', duration: '4 months', desc: 'Create AI-powered apps with GPT & image generation' },
              { name: 'Flutter Dev',    icon: '📱', color: '#5ab87d', students: '1,800', duration: '6 months', desc: 'Build cross-platform mobile apps for iOS & Android' },
              { name: 'Web Dev',        icon: '💻', color: '#0ea5e9', students: '4,200', duration: '6 months', desc: 'Full-stack web development with modern frameworks' },
              { name: 'Cyber Security', icon: '🔐', color: '#8b5cf6', students: '1,200', duration: '5 months', desc: 'Protect systems and networks from cyber threats' },
              { name: 'Graphic Design', icon: '🎨', color: '#ec4899', students: '1,500', duration: '3 months', desc: 'Master design tools and create stunning visuals' },
              { name: 'Python',         icon: '🐍', color: '#5ab87d', students: '2,800', duration: '3 months', desc: 'From basics to advanced Python programming' },
              { name: 'Freelancing',    icon: '💼', color: '#f97316', students: '2,100', duration: '2 months', desc: 'Start earning online as a professional freelancer' },
            ].map((course, i) => (
              <div key={i} className="flip-card-container cursor-pointer"
                style={{ height: '180px', perspective: '1000px' }}
                onClick={() => navigate('/courses')}>
                <div className="flip-card-inner relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'rotateY(180deg)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'rotateY(0deg)'}>

                  {/* Front */}
                  <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 border border-gray-100"
                    style={{ backfaceVisibility: 'hidden', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div className="text-5xl">{course.icon}</div>
                    <p className="text-sm font-black text-gray-800 text-center px-3 leading-tight">{course.name}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: course.color }} />
                      <span className="text-xs font-semibold text-gray-500">{course.students} students</span>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-4 text-white"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)`,
                      boxShadow: `0 8px 30px ${course.color}50`,
                    }}>
                    <p className="text-sm font-black text-center leading-tight">{course.name}</p>
                    <p className="text-xs text-white/80 text-center leading-relaxed">{course.desc}</p>
                    <div className="flex items-center gap-3 text-xs text-white/70">
                      <span>⏱ {course.duration}</span>
                      <span>👥 {course.students}</span>
                    </div>
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                      Enroll Now →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scrolling ticker */}
          <div className="overflow-hidden rounded-2xl py-3.5"
            style={{ background: 'linear-gradient(90deg, #0ea5e9, #3a9b8f, #5ab87d)' }}>
            <div className="ticker-track flex gap-10 whitespace-nowrap"
              style={{ animation: 'ticker 18s linear infinite', width: 'max-content' }}>
              {['🤖 AI & Chatbot','📱 Flutter Dev','🔐 Cyber Security','✨ Generative AI','💻 Web Dev','🎨 Graphic Design','🐍 Python','💼 Freelancing','🌐 Networking','📊 Data Science','🎬 Video Animation','🔧 IT Essentials',
                '🤖 AI & Chatbot','📱 Flutter Dev','🔐 Cyber Security','✨ Generative AI','💻 Web Dev','🎨 Graphic Design','🐍 Python','💼 Freelancing','🌐 Networking','📊 Data Science','🎬 Video Animation','🔧 IT Essentials',
              ].map((item, i) => (
                <span key={i} className="text-white font-semibold text-sm">
                  {item} <span className="text-white/30 ml-6">•</span>
                </span>
              ))}
            </div>
          </div>
          <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

          {/* CTA */}
          <div className="text-center mt-10">
            <button onClick={() => navigate('/courses')}
              className="text-white px-10 py-3.5 rounded-full font-bold text-sm hover:shadow-xl transition mr-3"
              style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)', boxShadow: '0 8px 25px rgba(14,165,233,0.35)' }}>
              Explore All 45+ Courses →
            </button>
            <button onClick={() => navigate('/student/register')}
              className="border-2 border-[#0ea5e9] text-[#0ea5e9] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-blue-50 transition">
              Enroll Now
            </button>
          </div>
        </div>
      </section>

      {/* BE A PART OF THIS VISION */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-12 text-center text-white"
            style={{ background: 'linear-gradient(90deg, #1e5ba8 0%, #2b7a9e 25%, #3a9b8f 50%, #5ab87d 75%, #8fd66f 100%)' }}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4">
              Be a Part of This Vision
            </h2>
            <p className="text-sm md:text-base md:text-lg mb-8 opacity-95">
              Join thousands of students who are already transforming their careers and<br />
              contributing to Pakistan's digital future
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => navigate('/student/signup')}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-white hover:text-gray-700 transition">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {selected && <ApplyModal course={selected} onClose={() => setSelected(null)} />}

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/922111729526" target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition hover:scale-110 group">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="absolute right-16 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Chat on WhatsApp
        </span>
      </a>

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}

function StatCard({ label, value, suffix, start }) {
  const count = useCounter(value, 2000, start)
  return (
    <div>
      <p className="text-4xl font-black">{count.toLocaleString()}{suffix}</p>
      <p className="text-white text-xs mt-1 tracking-widest opacity-90">{label}</p>
    </div>
  )
}

function CourseCard({ course, onApply }) {
  const isOpen = course.status === 'open'
  
  // Map course names to images
  const courseImages = {
    'Video Animation': 'https://www.saylanimit.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fsaylani-welfare%2Fimage%2Fupload%2Fv1648469107%2FSMIT%2FCourses%2FVA.jpg&w=640&q=75',
    'Software Quality Assurance': 'https://www.saylanimit.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fsaylani-welfare%2Fimage%2Fupload%2Fv1721370989%2FSMIT%2FCourses%2FSQA.jpg&w=640&q=75',
    'RO Plant Operator': 'https://www.saylanimit.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fsaylani-welfare%2Fimage%2Fupload%2Fv1764062825%2FSMIT%2FCourses%2FRO%2520Plant.jpg&w=640&q=75',
    'SAB': 'https://www.saylanimit.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fsaylani-welfare%2Fimage%2Fupload%2Fv1764063900%2FSMIT%2FCourses%2FSAB.jpg&w=640&q=75'
  }
  
  const courseImage = courseImages[course.name] || 'https://www.saylanimit.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fsaylani-welfare%2Fimage%2Fupload%2Fv1648469107%2FSMIT%2FCourses%2FVA.jpg&w=640&q=75'
  
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group border border-gray-100">
      <div className="h-48 relative overflow-hidden">
        <img src={courseImage} alt={course.name} className="w-full h-full object-cover" />
        {isOpen && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
            <span className="text-sm">🔥</span> ADMISSION OPEN
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition text-base">{course.name}</h3>
        <p className="text-xs text-gray-400 mb-1 line-clamp-2">{course.description}</p>
        {course.duration && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-500">Duration</span>
            <span className="text-xs font-semibold text-gray-700">{course.duration}</span>
          </div>
        )}
        <button disabled={!isOpen} onClick={onApply}
          className="w-full py-2.5 rounded-full text-sm font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: isOpen ? '#0ea5e9' : '#e5e7eb', color: isOpen ? 'white' : '#9ca3af' }}>
          {isOpen ? 'Enroll Now' : 'Admissions Closed'}
        </button>
      </div>
    </div>
  )
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!visible) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-50 w-11 h-11 bg-white border-2 border-gray-200 hover:border-[#0ea5e9] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition hover:scale-110 group">
      <svg className="w-5 h-5 text-gray-500 group-hover:text-[#0ea5e9] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}
