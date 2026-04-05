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

  return (
    <div className="min-h-screen bg-white" ref={heroRef}>

      {/* NAVBAR */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" alt="SMIT" style={{ height: '52px', width: 'auto' }} />
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
          <span className="cursor-pointer hover:text-blue-600 transition">Campuses</span>
          <span onClick={() => navigate('/result')} className="cursor-pointer hover:text-blue-600 transition">Check Result</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/student/login')}
            className="border-2 border-[#0ea5e9] text-[#0ea5e9] px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition">
            Login
          </button>
          <button onClick={() => navigate('/student/register')}
            className="text-white px-5 py-2 rounded-full text-sm font-bold transition flex items-center gap-1"
            style={{ background: '#0ea5e9' }}>
            Enroll Now ↗
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16 relative overflow-hidden"
        style={{ background: '#eef2f7', minHeight: '85vh' }}>

        {/* Laptop - left of "Building" text */}
        <div className="laptop-icon absolute w-28" style={{ left: '24%', top: '25%' }}>
          <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Flaptop_icon.png&w=128&q=75" alt="laptop" className="w-full" />
        </div>

        {/* Up arrow - right of "Pakistan's", top right */}
        <div className="arrow-top absolute w-32" style={{ top: '28%', right: '28%' }}>
          <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fup_arrow.png&w=256&q=75" alt="" className="w-full" />
        </div>

        {/* Globe - right side, middle */}
        <div className="globe-icon absolute w-28" style={{ right: '26%', top: '60%' }}>
          <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fglobe_icon.png&w=128&q=75" alt="globe" className="w-full" />
        </div>

        {/* Down arrow - left of enroll button, bottom */}
        <div className="arrow-left absolute w-40" style={{ bottom: '25%', left: '28%' }}>
          <img src="https://www.saylanimit.com/_next/image?url=%2Fassets%2Fdown_arrow.png&w=256&q=75" alt="" className="w-full" />
        </div>

        {/* Center text */}
        <div className="flex items-center justify-center" style={{ minHeight: '85vh', marginTop: '-110px' }}>
          <div className="text-center px-4 relative z-10" style={{ maxWidth: 520 }}>
            <h1 className="hero-title font-black text-gray-900 leading-tight mb-3 text-center"
              style={{ fontSize: '3.2rem', lineHeight: 1.2 }}>
              Building Pakistan's<br />
              <span style={{ color: '#0ea5e9' }}>Tech Future</span>
            </h1>
            <p className="hero-sub text-gray-500 mb-3 leading-relaxed"
              style={{ fontSize: '1.45rem' }}>
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
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} start={statsVisible} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section ref={whyRef} className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
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
        </div>
      </section>

      {/* SMIT VISION */}
      <section ref={visionRef} className="py-20 px-6 bg-gray-50">
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
      <section className="py-20 px-6 bg-white">
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

      {/* BE A PART OF THIS VISION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-12 text-center text-white"
            style={{ background: 'linear-gradient(90deg, #1e5ba8 0%, #2b7a9e 25%, #3a9b8f 50%, #5ab87d 75%, #8fd66f 100%)' }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Be a Part of This Vision
            </h2>
            <p className="text-base md:text-lg mb-8 opacity-95">
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
