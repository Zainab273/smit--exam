import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import StudentSplash from '../components/StudentSplash'

const shapes = [
  { top: '4%',  left: '1%',  size: 90,  color: '#38bdf8', rotate: 8,   filled: false },
  { top: '16%', left: '7%',  size: 55,  color: '#818cf8', rotate: -5,  filled: false },
  { top: '28%', left: '0%',  size: 110, color: '#34d399', rotate: 12,  filled: true  },
  { top: '42%', left: '5%',  size: 70,  color: '#f472b6', rotate: 3,   filled: true  },
  { top: '55%', left: '1%',  size: 85,  color: '#38bdf8', rotate: -8,  filled: false },
  { top: '67%', left: '8%',  size: 48,  color: '#a78bfa', rotate: 15,  filled: false },
  { top: '77%', left: '2%',  size: 95,  color: '#34d399', rotate: -3,  filled: true  },
  { top: '87%', left: '9%',  size: 62,  color: '#38bdf8', rotate: 6,   filled: false },
  { top: '8%',  left: '14%', size: 72,  color: '#818cf8', rotate: -10, filled: false },
  { top: '23%', left: '11%', size: 100, color: '#f472b6', rotate: 5,   filled: true  },
  { top: '46%', left: '14%', size: 50,  color: '#38bdf8', rotate: -12, filled: false },
  { top: '69%', left: '12%', size: 78,  color: '#34d399', rotate: 9,   filled: false },
  { top: '4%',  right: '1%', size: 88,  color: '#818cf8', rotate: -8,  filled: false },
  { top: '18%', right: '8%', size: 58,  color: '#38bdf8', rotate: 10,  filled: false },
  { top: '32%', right: '0%', size: 105, color: '#34d399', rotate: -12, filled: true  },
  { top: '48%', right: '6%', size: 68,  color: '#f472b6', rotate: 5,   filled: false },
  { top: '62%', right: '1%', size: 92,  color: '#818cf8', rotate: -6,  filled: true  },
  { top: '76%', right: '9%', size: 52,  color: '#38bdf8', rotate: 14,  filled: false },
  { top: '87%', right: '2%', size: 80,  color: '#34d399', rotate: -4,  filled: false },
  { top: '11%', right: '15%',size: 65,  color: '#f472b6', rotate: 7,   filled: true  },
]

const dots = [
  { top: '15%', left: '20%' }, { top: '35%', left: '17%' },
  { top: '60%', left: '21%' }, { top: '80%', left: '19%' },
  { top: '22%', left: '24%' }, { top: '50%', left: '22%' },
  { top: '15%', right: '20%' }, { top: '35%', right: '17%' },
  { top: '60%', right: '21%' }, { top: '80%', right: '19%' },
]

export default function Landing() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const subtitleRef = useRef(null)
  const cardsRef = useRef(null)
  const shapesRef = useRef([])
  const dotsRef = useRef([])
  const [showSplash, setShowSplash] = useState(false)

  const handleStudentClick = () => {
    setShowSplash(true)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(shapesRef.current, {
        opacity: 0, scale: 0.2, rotation: '+=200',
        duration: 1.4, stagger: 0.035, ease: 'back.out(1.6)',
      })

      shapesRef.current.forEach((el, i) => {
        if (!el) return
        gsap.to(el, {
          y: i % 2 === 0 ? -14 : 14,
          x: i % 3 === 0 ? 7 : -7,
          rotation: `+=${i % 2 === 0 ? 18 : -18}`,
          duration: 2.8 + (i % 5) * 0.4,
          repeat: -1, yoyo: true,
          ease: 'sine.inOut', delay: i * 0.08,
        })
      })

      dotsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.to(el, {
          scale: 2, opacity: 0.8,
          duration: 1.4 + i * 0.12,
          repeat: -1, yoyo: true,
          ease: 'sine.inOut', delay: i * 0.18,
        })
      })

      const letters = logoRef.current?.querySelectorAll('.logo-letter')
      if (letters) {
        gsap.from(letters, {
          y: -100, opacity: 0, rotationX: 90, scale: 0.5,
          duration: 0.9, stagger: 0.13,
          ease: 'back.out(2.2)', delay: 0.2,
        })
      }

      gsap.from(subtitleRef.current, {
        y: 25, opacity: 0, duration: 0.9,
        ease: 'power3.out', delay: 0.9,
      })

      const cards = cardsRef.current?.querySelectorAll('.portal-card')
      if (cards) {
        gsap.from(cards, {
          y: 100, opacity: 0, scale: 0.75,
          duration: 1, stagger: 0.22,
          ease: 'back.out(1.8)', delay: 1.2,
        })
      }

      gsap.from('.grad-cap', {
        rotation: -200, scale: 0, opacity: 0,
        duration: 1.1, ease: 'back.out(2.5)', delay: 0.1,
      })
      gsap.to('.grad-cap', {
        y: -10, duration: 2.2,
        repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: 1.4,
      })

      gsap.to('.logo-glow', {
        opacity: 0.25, scale: 1.08,
        duration: 2, repeat: -1, yoyo: true,
        ease: 'sine.inOut',
      })

    }, containerRef)
    return () => ctx.revert()
  }, [])

  const handleCardHover = (el, enter) => {
    gsap.to(el, {
      y: enter ? -14 : 0,
      scale: enter ? 1.05 : 1,
      duration: 0.35, ease: 'power2.out',
    })
  }

  return (
    <div ref={containerRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: '#f1f5f9' }}>

      {/* Splash screen */}
      {showSplash && <StudentSplash onDone={() => navigate('/home')} />}

      {/* Soft glow center */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="logo-glow w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #38bdf840 0%, #818cf820 50%, transparent 75%)' }} />
      </div>

      {/* Floating shapes */}
      {shapes.map((s, i) => (
        <div key={i}
          ref={el => shapesRef.current[i] = el}
          className="absolute rounded-xl"
          style={{
            top: s.top, left: s.left, right: s.right,
            width: s.size, height: s.size,
            border: `2.5px solid ${s.color}95`,
            transform: `rotate(${s.rotate}deg)`,
            background: s.filled ? `${s.color}28` : 'transparent',
            pointerEvents: 'none',
          }} />
      ))}

      {/* Dots */}
      {dots.map((d, i) => (
        <div key={i}
          ref={el => dotsRef.current[i] = el}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: d.top, left: d.left, right: d.right,
            width: 9, height: 9,
            background: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#818cf8' : '#34d399',
            opacity: 0.35,
          }} />
      ))}

      {/* Top right accents */}
      <div className="absolute top-8 right-12 pointer-events-none opacity-50">
        <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '20px solid #3b82f6' }} />
      </div>
      <div className="absolute top-6 right-6 pointer-events-none">
        <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #94a3b8', opacity: 0.45 }} />
      </div>
      <div className="absolute top-14 right-20 pointer-events-none">
        <div style={{ width: 16, height: 16, border: '2px solid #38bdf8', opacity: 0.45 }} />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center px-4">

        {/* Logo */}
        <div ref={logoRef} className="flex flex-col items-center mb-2">
          <div className="grad-cap mb-1">
            <svg width="72" height="40" viewBox="0 0 80 44" fill="none">
              <polygon points="40,2 78,18 40,34 2,18" fill="#22c55e" opacity="0.95"/>
              <polygon points="40,34 78,18 78,30 40,44" fill="#16a34a"/>
              <circle cx="40" cy="18" r="5" fill="#86efac"/>
              <line x1="72" y1="18" x2="72" y2="34" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="72" cy="36" r="4" fill="#22c55e"/>
            </svg>
          </div>

          <div className="flex items-end gap-0.5">
            {[
              { l: 'S' }, { l: 'M' }, { l: 'i', small: true }, { l: 'T' }
            ].map(({ l, small }, i) => (
              <span key={i} className="logo-letter font-black leading-none select-none"
                style={{
                  fontSize: small ? '5.5rem' : '7.5rem',
                  color: '#0ea5e9',
                  fontFamily: 'Arial Black, Impact, sans-serif',
                  textShadow: '3px 3px 0px #0284c7, 0 0 40px #38bdf830',
                  letterSpacing: '-2px',
                  display: 'inline-block',
                }}>
                {l}
              </span>
            ))}
          </div>
        </div>

        <p ref={subtitleRef}
          className="tracking-[0.4em] text-xs font-semibold mb-10 uppercase"
          style={{ color: '#64748b' }}>
          Saylani Mass IT Training
        </p>

        {/* Cards */}
        <div ref={cardsRef} className="flex flex-col sm:flex-row gap-6 justify-center">

          {/* Student */}
          <div className="portal-card cursor-pointer rounded-3xl p-8 flex flex-col items-center gap-5 w-56 bg-white group"
            style={{ boxShadow: '0 20px 60px rgba(14,165,233,0.15)', border: '1.5px solid #e0f2fe' }}
            onMouseEnter={e => handleCardHover(e.currentTarget, true)}
            onMouseLeave={e => handleCardHover(e.currentTarget, false)}
            onClick={handleStudentClick}>
            <div className="w-18 h-18 rounded-2xl flex items-center justify-center text-4xl p-4 transition-transform group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)', boxShadow: '0 8px 20px rgba(14,165,233,0.2)' }}>
              🎓
            </div>
            <div className="text-center">
              <p className="font-black text-gray-800 text-xl tracking-tight">Student</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">Enroll & manage courses</p>
            </div>
            <div className="w-full py-3 rounded-full text-sm font-bold text-white text-center transition-all group-hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', boxShadow: '0 4px 15px #0ea5e950' }}>
              Enter Portal →
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:flex items-center">
            <div className="w-px h-24 opacity-20"
              style={{ background: 'linear-gradient(to bottom, transparent, #94a3b8, transparent)' }} />
          </div>

          {/* Admin */}
          <div className="portal-card cursor-pointer rounded-3xl p-8 flex flex-col items-center gap-5 w-56 bg-white group"
            style={{ boxShadow: '0 20px 60px rgba(99,102,241,0.15)', border: '1.5px solid #ede9fe' }}
            onMouseEnter={e => handleCardHover(e.currentTarget, true)}
            onMouseLeave={e => handleCardHover(e.currentTarget, false)}
            onClick={() => navigate('/admin/login')}>
            <div className="w-18 h-18 rounded-2xl flex items-center justify-center text-4xl p-4 transition-transform group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', boxShadow: '0 8px 20px rgba(99,102,241,0.2)' }}>
              🛡️
            </div>
            <div className="text-center">
              <p className="font-black text-gray-800 text-xl tracking-tight">Admin</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">Manage system & students</p>
            </div>
            <div className="w-full py-3 rounded-full text-sm font-bold text-white text-center transition-all group-hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 15px #6366f150' }}>
              Enter Portal →
            </div>
          </div>

        </div>

        {/* Bottom stats */}
        <div className="mt-12 flex items-center gap-8 opacity-0 animate-[fadeIn_0.5s_ease_1.8s_forwards]"
          style={{ animation: 'fadeInUp 0.6s ease 1.8s forwards', opacity: 0 }}>
          {[
            { val: '50K+', label: 'Students' },
            { val: '200+', label: 'Trainers' },
            { val: '20+', label: 'Courses' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-black text-lg" style={{ color: '#0ea5e9' }}>{s.val}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
