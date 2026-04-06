import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const SHAPES = [
  { top: '8%',  left: '3%',  size: 70,  color: '#0ea5e9', rotate: 15,  filled: false },
  { top: '20%', left: '8%',  size: 45,  color: '#5ab87d', rotate: -8,  filled: true  },
  { top: '55%', left: '2%',  size: 80,  color: '#38bdf8', rotate: 20,  filled: false },
  { top: '75%', left: '6%',  size: 55,  color: '#5ab87d', rotate: -12, filled: true  },
  { top: '88%', left: '2%',  size: 65,  color: '#0ea5e9', rotate: 5,   filled: false },
  { top: '5%',  right: '4%', size: 75,  color: '#5ab87d', rotate: -15, filled: false },
  { top: '25%', right: '6%', size: 50,  color: '#0ea5e9', rotate: 10,  filled: true  },
  { top: '50%', right: '3%', size: 85,  color: '#38bdf8', rotate: -20, filled: false },
  { top: '70%', right: '7%', size: 60,  color: '#5ab87d', rotate: 8,   filled: true  },
  { top: '85%', right: '2%', size: 70,  color: '#0ea5e9', rotate: -5,  filled: false },
  { top: '40%', left: '15%', size: 40,  color: '#38bdf8', rotate: 25,  filled: false },
  { top: '60%', right: '15%',size: 45,  color: '#5ab87d', rotate: -18, filled: true  },
]

const DOTS = [
  { top: '15%', left: '18%' }, { top: '35%', left: '14%' },
  { top: '65%', left: '17%' }, { top: '80%', left: '20%' },
  { top: '12%', right: '18%'}, { top: '40%', right: '15%'},
  { top: '68%', right: '18%'}, { top: '82%', right: '14%'},
]

export default function StudentSplash({ onDone }) {
  const containerRef = useRef(null)
  const shapesRef    = useRef([])
  const dotsRef      = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Shapes burst in
      gsap.from(shapesRef.current, {
        opacity: 0, scale: 0, rotation: '+=360',
        duration: 1.2, stagger: { amount: 0.8, from: 'random' },
        ease: 'back.out(1.8)',
      })

      // Shapes float continuously
      shapesRef.current.forEach((el, i) => {
        if (!el) return
        gsap.to(el, {
          y: i % 2 === 0 ? -18 : 18,
          x: i % 3 === 0 ? 8 : -8,
          rotation: `+=${i % 2 === 0 ? 20 : -20}`,
          duration: 2.5 + (i % 4) * 0.5,
          repeat: -1, yoyo: true,
          ease: 'sine.inOut', delay: i * 0.1,
        })
      })

      // Dots pulse
      dotsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.to(el, {
          scale: 2.5, opacity: 0.9,
          duration: 1.2 + i * 0.15,
          repeat: -1, yoyo: true,
          ease: 'sine.inOut', delay: i * 0.2,
        })
      })

      // Main timeline
      const tl = gsap.timeline({ delay: 0.4 })

      tl.fromTo('.splash-glow',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }
      )
      .fromTo('.splash-logo',
        { y: -60, opacity: 0, scale: 0.5, rotation: -15 },
        { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(2.5)' },
        '-=0.5'
      )
      .fromTo('.splash-letter',
        { y: -80, opacity: 0, rotationX: 90, scale: 0.4 },
        { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(2)' },
        '-=0.3'
      )
      .fromTo('.splash-line',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.1'
      )
      .fromTo('.splash-welcome',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      )
      .fromTo('.splash-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      )
      .fromTo('.splash-bar-fill',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.3, ease: 'power1.inOut' },
        '+=0.1'
      )
      .fromTo('.splash-dot',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, stagger: 0.12, ease: 'back.out(2)' },
        '-=1.1'
      )
      .to({}, { duration: 0.4 })
      .to(containerRef.current, {
        opacity: 0, scale: 1.04,
        duration: 0.55, ease: 'power2.in',
        onComplete: onDone,
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f0f4f8 0%, #e8f4fd 50%, #f0faf4 100%)' }}>

      {/* Soft center glow */}
      <div className="splash-glow absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0ea5e918 0%, #5ab87d10 40%, transparent 70%)' }} />

      {/* Mountain silhouettes at bottom - like 1st image */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: '200px' }}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
          <polygon points="0,200 220,65 440,200" fill="rgba(14,165,233,0.07)" />
          <polygon points="180,200 420,45 660,200" fill="rgba(14,165,233,0.06)" />
          <polygon points="400,200 650,70 900,200" fill="rgba(90,184,125,0.07)" />
          <polygon points="650,200 920,55 1180,200" fill="rgba(14,165,233,0.06)" />
          <polygon points="950,200 1200,68 1440,200" fill="rgba(90,184,125,0.07)" />
          <polygon points="1150,200 1320,85 1440,200" fill="rgba(14,165,233,0.05)" />
        </svg>
      </div>

      {/* Floating shapes */}
      {SHAPES.map((s, i) => (
        <div key={i}
          ref={el => shapesRef.current[i] = el}
          className="absolute rounded-xl pointer-events-none"
          style={{
            top: s.top, left: s.left, right: s.right,
            width: s.size, height: s.size,
            border: `2px solid ${s.color}55`,
            transform: `rotate(${s.rotate}deg)`,
            background: s.filled ? `${s.color}12` : 'transparent',
          }} />
      ))}

      {/* Dots */}
      {DOTS.map((d, i) => (
        <div key={i}
          ref={el => dotsRef.current[i] = el}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: d.top, left: d.left, right: d.right,
            width: 7, height: 7,
            background: i % 2 === 0 ? '#0ea5e9' : '#5ab87d',
            opacity: 0.35,
          }} />
      ))}

      {/* Extra geometric elements like 1st image */}
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '23%', opacity: 0.25 }}>
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 0v18M0 9h18" stroke="#1e40af" strokeWidth="2"/></svg>
      </div>
      <div className="absolute pointer-events-none" style={{ top: '22%', right: '24%', opacity: 0.2 }}>
        <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,1 15,15 1,15" fill="none" stroke="#1e40af" strokeWidth="1.5"/></svg>
      </div>
      <div className="absolute pointer-events-none" style={{ top: '62%', left: '21%', opacity: 0.2 }}>
        <svg width="14" height="14" viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" fill="none" stroke="#0ea5e9" strokeWidth="1.5" transform="rotate(45 7 7)"/></svg>
      </div>
      <div className="absolute pointer-events-none" style={{ top: '42%', right: '21%', opacity: 0.25 }}>
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 0v18M0 9h18" stroke="#5ab87d" strokeWidth="2"/></svg>
      </div>
      <div className="absolute pointer-events-none" style={{ top: '78%', right: '26%', opacity: 0.2 }}>
        <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,1 15,15 1,15" fill="none" stroke="#0ea5e9" strokeWidth="1.5"/></svg>
      </div>
      <div className="absolute pointer-events-none" style={{ top: '18%', left: '40%', opacity: 0.15 }}>
        <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" fill="none" stroke="#5ab87d" strokeWidth="1.5"/></svg>
      </div>
      <div className="absolute pointer-events-none" style={{ top: '72%', left: '38%', opacity: 0.15 }}>
        <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="none" stroke="#0ea5e9" strokeWidth="1.5"/></svg>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Graduation cap */}
        <div className="splash-logo mb-4">
          <svg width="64" height="36" viewBox="0 0 80 44" fill="none">
            <polygon points="40,2 78,18 40,34 2,18" fill="#5ab87d" opacity="0.95"/>
            <polygon points="40,34 78,18 78,30 40,44" fill="#3d9e62"/>
            <circle cx="40" cy="18" r="5" fill="#86efac"/>
            <line x1="72" y1="18" x2="72" y2="34" stroke="#5ab87d" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="72" cy="36" r="4" fill="#5ab87d"/>
          </svg>
        </div>

        {/* SMIT letters */}
        <div className="flex items-end gap-0.5 mb-1">
          {[{l:'S'},{l:'M'},{l:'i',small:true},{l:'T'}].map(({l, small}, i) => (
            <span key={i} className="splash-letter font-black leading-none select-none"
              style={{
                fontSize: small ? '4rem' : '5.5rem',
                color: '#0ea5e9',
                fontFamily: 'Arial Black, Impact, sans-serif',
                textShadow: '2px 2px 0px #0284c7, 0 0 30px #38bdf825',
                letterSpacing: '-2px',
                display: 'inline-block',
              }}>
              {l}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="splash-line flex items-center gap-3 mb-5" style={{ transformOrigin: 'center' }}>
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #0ea5e9)' }} />
          <span className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: '#64748b' }}>
            Student Portal
          </span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #5ab87d, transparent)' }} />
        </div>

        {/* Welcome */}
        <h2 className="splash-welcome text-2xl md:text-3xl font-black text-gray-800 mb-2 leading-tight">
          Welcome to{' '}
          <span style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SMIT Connect
          </span>
        </h2>

        {/* Sub */}
        <p className="splash-sub text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
          Your learning journey continues here. Manage courses, attendance &amp; more.
        </p>

        {/* Progress bar */}
        <div className="w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="splash-bar-fill h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }} />
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="splash-dot w-2 h-2 rounded-full"
              style={{ background: i === 1 ? '#5ab87d' : '#38bdf8', opacity: 0.8 }} />
          ))}
        </div>

      </div>
    </div>
  )
}
