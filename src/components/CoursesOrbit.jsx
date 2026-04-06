import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'

const COURSES = [
  { name: 'AI & Chatbot',   icon: '🤖', color: '#0ea5e9', students: '2.4k' },
  { name: 'Generative AI',  icon: '✨', color: '#f97316', students: '3.1k' },
  { name: 'Flutter Dev',    icon: '📱', color: '#5ab87d', students: '1.8k' },
  { name: 'Web Dev',        icon: '💻', color: '#0ea5e9', students: '4.2k' },
  { name: 'Cyber Security', icon: '🔐', color: '#8b5cf6', students: '1.2k' },
  { name: 'Graphic Design', icon: '🎨', color: '#ec4899', students: '1.5k' },
  { name: 'Python',         icon: '🐍', color: '#5ab87d', students: '2.8k' },
  { name: 'Freelancing',    icon: '💼', color: '#f97316', students: '2.1k' },
  { name: 'Networking',     icon: '🌐', color: '#0ea5e9', students: '900'  },
]

export default function CoursesOrbit() {
  const navigate = useNavigate()
  const gridRef  = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hexagons pop in with stagger
      gsap.fromTo('.hex-cell',
        { scale: 0, opacity: 0, rotation: -30 },
        {
          scale: 1, opacity: 1, rotation: 0,
          duration: 0.6, stagger: { amount: 0.8, from: 'center' },
          ease: 'back.out(1.8)', delay: 0.2,
        }
      )
      // Subtle float on each hex
      gsap.to('.hex-cell', {
        y: -6, duration: 2,
        repeat: -1, yoyo: true,
        ease: 'sine.inOut',
        stagger: { amount: 1.5, from: 'random' },
        delay: 1,
      })
      // Center hex pulse
      gsap.to('.hex-center-glow', {
        scale: 1.15, opacity: 0.6,
        duration: 1.5, repeat: -1, yoyo: true,
        ease: 'sine.inOut',
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={gridRef} className="w-full">

      {/* Hexagonal grid */}
      <div className="flex flex-col items-center gap-0" style={{ lineHeight: 0 }}>

        {/* Row 1 - 2 hexes */}
        <div className="flex gap-3 mb-[-18px]" style={{ marginLeft: '110px' }}>
          {COURSES.slice(0, 2).map((c, i) => <HexCard key={i} course={c} navigate={navigate} />)}
        </div>

        {/* Row 2 - 3 hexes (center row with SMIT) */}
        <div className="flex gap-3 mb-[-18px]">
          {COURSES.slice(2, 4).map((c, i) => <HexCard key={i} course={c} navigate={navigate} />)}
          {/* Center SMIT hex */}
          <HexCenter navigate={navigate} />
          {COURSES.slice(4, 6).map((c, i) => <HexCard key={i} course={c} navigate={navigate} />)}
        </div>

        {/* Row 3 - 3 hexes */}
        <div className="flex gap-3" style={{ marginLeft: '110px' }}>
          {COURSES.slice(6, 9).map((c, i) => <HexCard key={i} course={c} navigate={navigate} />)}
        </div>
      </div>

    </div>
  )
}

function HexCard({ course, navigate }) {
  const ref = useRef(null)

  const onEnter = () => {
    gsap.to(ref.current, { scale: 1.08, duration: 0.25, ease: 'power2.out' })
  }
  const onLeave = () => {
    gsap.to(ref.current, { scale: 1, duration: 0.25, ease: 'power2.out' })
  }

  return (
    <div ref={ref} className="hex-cell cursor-pointer flex-shrink-0"
      style={{ width: 130, height: 150 }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}
      onClick={() => navigate('/courses')}>
      <svg viewBox="0 0 130 150" className="absolute w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <linearGradient id={`hg-${course.name.replace(/\s/g,'')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={course.color} stopOpacity="0.12"/>
            <stop offset="100%" stopColor={course.color} stopOpacity="0.04"/>
          </linearGradient>
        </defs>
        <polygon
          points="65,5 125,37.5 125,112.5 65,145 5,112.5 5,37.5"
          fill={`url(#hg-${course.name.replace(/\s/g,'')})`}
          stroke={course.color}
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
      </svg>
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-2 z-10">
        <div className="text-4xl">{course.icon}</div>
        <p className="text-xs font-black text-gray-800 text-center leading-tight px-2">{course.name}</p>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: course.color }} />
          <span className="text-xs font-semibold" style={{ color: course.color }}>{course.students}</span>
        </div>
      </div>
    </div>
  )
}

function HexCenter({ navigate }) {
  return (
    <div className="hex-cell cursor-pointer flex-shrink-0 relative"
      style={{ width: 150, height: 173 }}
      onClick={() => navigate('/courses')}>
      {/* Glow */}
      <div className="hex-center-glow absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)', filter: 'blur(15px)' }} />
      <svg viewBox="0 0 150 173" className="absolute w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <linearGradient id="hg-center" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9"/>
            <stop offset="50%" stopColor="#3a9b8f"/>
            <stop offset="100%" stopColor="#5ab87d"/>
          </linearGradient>
        </defs>
        <polygon
          points="75,5 145,43 145,130 75,168 5,130 5,43"
          fill="url(#hg-center)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
      </svg>
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-1.5 z-10">
        <svg width="44" height="26" viewBox="0 0 80 44" fill="none">
          <polygon points="40,2 78,18 40,34 2,18" fill="white" opacity="0.95"/>
          <polygon points="40,34 78,18 78,30 40,44" fill="rgba(255,255,255,0.45)"/>
          <circle cx="40" cy="18" r="6" fill="rgba(255,255,255,0.95)"/>
          <line x1="72" y1="18" x2="72" y2="33" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="72" cy="35" r="4" fill="white"/>
        </svg>
        <span className="text-white font-black tracking-widest" style={{ fontSize: '16px' }}>SMIT</span>
        <span className="text-white/70 font-semibold" style={{ fontSize: '9px', letterSpacing: '2px' }}>45+ COURSES</span>
      </div>
    </div>
  )
}
