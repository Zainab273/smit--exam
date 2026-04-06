import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const FEATURE_CARDS = [
  { label: 'My Courses',  icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: '#0ea5e9', x: '-52%', y: '-80%' },
  { label: 'Attendance',  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', color: '#5ab87d', x: '52%',  y: '-80%' },
  { label: 'Apply Leave', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: '#8b5cf6', x: '-60%', y: '60%'  },
  { label: 'My Leaves',   icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: '#f97316', x: '60%',  y: '60%'  },
]

export default function DashboardHero({ user, onNavigate }) {
  const heroRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Rings pulse in
      gsap.fromTo('.dh-ring', { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out' }
      )

      // Center platform drops in
      gsap.fromTo('.dh-platform',
        { y: -40, opacity: 0, scale: 0.6 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(2)', delay: 0.4 }
      )

      // Center platform continuous float
      gsap.to('.dh-platform', {
        y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5
      })

      // Feature cards fly in from center
      gsap.fromTo('.dh-card',
        { scale: 0, opacity: 0, x: 0, y: 0 },
        { scale: 1, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.8)', delay: 0.8,
          x: (i) => FEATURE_CARDS[i].x,
          y: (i) => FEATURE_CARDS[i].y,
        }
      )

      // Cards gentle float
      gsap.to('.dh-card-0', { y: '-=6', duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 })
      gsap.to('.dh-card-1', { y: '-=8', duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.8 })
      gsap.to('.dh-card-2', { y: '+=6', duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.0 })
      gsap.to('.dh-card-3', { y: '+=7', duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.6 })

      // Connection lines draw
      gsap.fromTo('.dh-line', { strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 1, stagger: 0.15, ease: 'power2.out', delay: 1.2 }
      )

      // Floating dots
      gsap.fromTo('.dh-dot',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)', delay: 1.0 }
      )
      gsap.to('.dh-dot', {
        y: -10, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.3, delay: 1.5
      })

      // Rings rotate slowly
      gsap.to('.dh-ring-outer', { rotation: 360, duration: 20, repeat: -1, ease: 'none', transformOrigin: 'center' })
      gsap.to('.dh-ring-mid',   { rotation: -360, duration: 15, repeat: -1, ease: 'none', transformOrigin: 'center' })

    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef}
      className="relative w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
      style={{ background: 'linear-gradient(160deg, #f8faff 0%, #f0fdf8 50%, #f8faff 100%)', height: '280px' }}>

      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#5ab87d" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        {/* Lines from center to cards */}
        <line className="dh-line" x1="50%" y1="50%" x2="30%" y2="22%" stroke="url(#lineGrad1)" strokeWidth="1" strokeDasharray="200" strokeDashoffset="200"/>
        <line className="dh-line" x1="50%" y1="50%" x2="70%" y2="22%" stroke="url(#lineGrad1)" strokeWidth="1" strokeDasharray="200" strokeDashoffset="200"/>
        <line className="dh-line" x1="50%" y1="50%" x2="27%" y2="78%" stroke="url(#lineGrad1)" strokeWidth="1" strokeDasharray="200" strokeDashoffset="200"/>
        <line className="dh-line" x1="50%" y1="50%" x2="73%" y2="78%" stroke="url(#lineGrad1)" strokeWidth="1" strokeDasharray="200" strokeDashoffset="200"/>
      </svg>

      {/* Floating background dots */}
      {[
        { top: '12%', left: '15%', size: 6, c: '#0ea5e9' },
        { top: '20%', right: '12%', size: 5, c: '#5ab87d' },
        { top: '70%', left: '10%', size: 7, c: '#5ab87d' },
        { top: '75%', right: '15%', size: 5, c: '#0ea5e9' },
        { top: '40%', left: '8%',  size: 4, c: '#8b5cf6' },
        { top: '35%', right: '8%', size: 6, c: '#f97316' },
      ].map((d, i) => (
        <div key={i} className="dh-dot absolute rounded-full pointer-events-none"
          style={{ top: d.top, left: d.left, right: d.right, width: d.size, height: d.size, background: d.c, opacity: 0.5 }} />
      ))}

      {/* Center area */}
      <div className="absolute inset-0 flex items-center justify-center">

        {/* Rings */}
        <div className="dh-ring absolute rounded-full"
          style={{ width: 220, height: 110, border: '1.5px solid rgba(14,165,233,0.12)', borderRadius: '50%', transform: 'rotateX(60deg)' }} />
        <div className="dh-ring absolute rounded-full"
          style={{ width: 160, height: 80, border: '1.5px solid rgba(90,184,125,0.15)', borderRadius: '50%', transform: 'rotateX(60deg)' }} />
        <div className="dh-ring absolute rounded-full"
          style={{ width: 280, height: 140, border: '1px solid rgba(14,165,233,0.07)', borderRadius: '50%', transform: 'rotateX(60deg)' }} />

        {/* Center platform */}
        <div className="dh-platform relative flex flex-col items-center justify-center cursor-pointer z-10"
          style={{ width: 90, height: 90 }}>
          {/* Shadow/base */}
          <div className="absolute bottom-0 rounded-full"
            style={{ width: 80, height: 20, background: 'radial-gradient(ellipse, rgba(14,165,233,0.2) 0%, transparent 70%)', filter: 'blur(6px)' }} />
          {/* Platform circle */}
          <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #3a9b8f, #5ab87d)', boxShadow: '0 8px 30px rgba(14,165,233,0.4), 0 0 0 4px rgba(14,165,233,0.1)' }}>
            <svg width="28" height="16" viewBox="0 0 80 44" fill="none">
              <polygon points="40,2 78,18 40,34 2,18" fill="white" opacity="0.95"/>
              <polygon points="40,34 78,18 78,30 40,44" fill="rgba(255,255,255,0.6)"/>
              <circle cx="40" cy="18" r="5" fill="rgba(255,255,255,0.9)"/>
            </svg>
            <span className="text-white text-xs font-black mt-0.5 leading-none" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>SMIT</span>
          </div>
        </div>

        {/* Feature cards */}
        {FEATURE_CARDS.map((card, i) => (
          <button key={i}
            className={`dh-card dh-card-${i} absolute flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer z-20`}
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${card.color}25`,
              boxShadow: `0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px ${card.color}15`,
              transform: `translate(${card.x}, ${card.y})`,
              minWidth: '80px',
            }}
            onClick={() => onNavigate(card.label === 'My Courses' ? 'Courses' : card.label === 'Apply Leave' ? 'Submit Leave' : card.label)}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${card.color}18` }}>
              <svg className="w-4 h-4" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{card.label}</span>
          </button>
        ))}
      </div>

      {/* Welcome text bottom left */}
      <div className="absolute bottom-4 left-5">
        <p className="text-xs text-gray-400 font-medium">Welcome back,</p>
        <p className="text-sm font-black text-gray-700">{user?.name?.split(' ')[0]} 👋</p>
      </div>

      {/* Course badge bottom right */}
      {user?.course && (
        <div className="absolute bottom-4 right-5">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ background: '#eff6ff', color: '#0ea5e9', borderColor: '#bfdbfe' }}>
            🎓 {user.course.split(' ').slice(0, 2).join(' ')}
          </span>
        </div>
      )}
    </div>
  )
}
