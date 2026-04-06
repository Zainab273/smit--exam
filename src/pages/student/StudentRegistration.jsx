import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'
import Footer from '../../components/Footer'
import IDCard from '../../components/IDCard'

export default function StudentRegistration() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('registration')
  const [cnic, setCnic] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [idCardData, setIdCardData] = useState(null)
  const [registrationStatus, setRegistrationStatus] = useState(null)
  const contentRef = useRef(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [form, setForm] = useState({
    country: '', gender: '', course: '', class_preference: '', city: '', campus: '',
    full_name: '', father_name: '', dob: '', email: '', phone: '', father_phone: '',
    id_number: '', father_id_number: '', address: '',
    computer_proficiency: '', last_qualification: '', hear_about: '', has_laptop: '',
    picture: null,
    terms1: false, terms2: false, terms3: false, terms4: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
    }
  }, [activeTab])

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.terms1 || !form.terms2 || !form.terms3 || !form.terms4) {
      return toast.error('Please accept all terms and conditions')
    }
    if (!form.country || !form.gender || !form.course || !form.class_preference || !form.city) {
      return toast.error('Please fill all required fields in Location & Course Details')
    }
    if (!form.full_name || !form.father_name || !form.dob || !form.email || !form.phone) {
      return toast.error('Please fill all required fields in Personal Information')
    }
    if (!form.id_number || !form.father_id_number || !form.address) {
      return toast.error('Please fill all required fields in Personal Information')
    }

    setLoading(true)

    try {
      // Upload picture if provided
      let picture_url = null
      if (form.picture) {
        const fileName = `students/${Date.now()}_${form.picture.name}`
        const { error: uploadError } = await supabase.storage
          .from('student-pictures')
          .upload(fileName, form.picture)
        if (!uploadError) {
          const { data } = supabase.storage.from('student-pictures').getPublicUrl(fileName)
          picture_url = data.publicUrl
        }
      }

      // Generate roll number immediately
      const year = new Date().getFullYear()
      const rollNumber = `SMIT-${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`

      // Insert registration as approved with roll number
      const { data: regData, error: regError } = await supabase
        .from('student_registrations')
        .insert({
          country: form.country,
          gender: form.gender,
          course: form.course,
          class_preference: form.class_preference,
          city: form.city,
          campus: form.campus,
          full_name: form.full_name,
          father_name: form.father_name,
          dob: form.dob,
          email: form.email,
          phone: form.phone,
          father_phone: form.father_phone,
          id_number: form.id_number,
          father_id_number: form.father_id_number,
          address: form.address,
          computer_proficiency: form.computer_proficiency,
          last_qualification: form.last_qualification,
          hear_about: form.hear_about,
          has_laptop: form.has_laptop,
          picture_url,
          status: 'approved',
          roll_number: rollNumber,
        })
        .select()
        .single()

      if (regError) {
        setLoading(false)
        toast.error('Registration failed: ' + regError.message)
        return
      }

      // Add to students table so they can login
      const { error: studentError } = await supabase.from('students').insert({
        name: form.full_name,
        cnic: form.id_number,
        roll_number: rollNumber,
        course: form.course,
        password: null,
        is_active: false,
      })

      setLoading(false)

      if (studentError && !studentError.message.includes('duplicate')) {
        // Registration saved but student insert failed - not critical
        console.warn('Student insert warning:', studentError.message)
      }

      toast.success(`🎉 Registration successful! Your Roll Number: ${rollNumber}`)

      const submittedCnic = form.id_number

      // Reset form
      setForm({
        country: '', gender: '', course: '', class_preference: '', city: '', campus: '',
        full_name: '', father_name: '', dob: '', email: '', phone: '', father_phone: '',
        id_number: '', father_id_number: '', address: '',
        computer_proficiency: '', last_qualification: '', hear_about: '', has_laptop: '',
        picture: null,
        terms1: false, terms2: false, terms3: false, terms4: false,
      })

      // Go to Download ID Card tab with CNIC pre-filled
      setTimeout(() => {
        setCnic(submittedCnic)
        setActiveTab('download')
        // Auto-search after tab switch
        setTimeout(async () => {
          const { data: reg } = await supabase
            .from('student_registrations')
            .select('*')
            .eq('id_number', submittedCnic)
            .single()
          if (reg && reg.status === 'approved') {
            const { data: student } = await supabase
              .from('students')
              .select('*')
              .eq('cnic', submittedCnic)
              .single()
            if (student) {
              setIdCardData({ ...reg, roll_number: student.roll_number, is_active: student.is_active })
            }
          }
        }, 500)
      }, 1000)

    } catch (err) {
      setLoading(false)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  const handleSearchIDCard = async (e) => {
    e.preventDefault()
    setSearchLoading(true)
    setIdCardData(null)
    setRegistrationStatus(null)

    // First check in student_registrations
    const { data: reg } = await supabase
      .from('student_registrations')
      .select('*')
      .eq('id_number', cnic)
      .single()

    if (!reg) {
      setSearchLoading(false)
      return toast.error('No registration found with this CNIC. Please register first.')
    }

    // Check registration status
    if (reg.status === 'pending') {
      setSearchLoading(false)
      setRegistrationStatus({ status: 'pending', name: reg.full_name, course: reg.course })
      return
    }

    if (reg.status === 'rejected') {
      setSearchLoading(false)
      setRegistrationStatus({ status: 'rejected', name: reg.full_name })
      return
    }

    // Approved - get roll number from students table
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('cnic', cnic)
      .single()

    setSearchLoading(false)

    if (!student) {
      setRegistrationStatus({ status: 'approved_no_student', name: reg.full_name })
      return
    }

    // Merge registration + student data for ID card
    setIdCardData({
      ...reg,
      roll_number: student.roll_number,
      is_active: student.is_active,
    })
  }

  const handleSearchResult = async (e) => {
    e.preventDefault()
    setSearchLoading(true)
    // Simulate search
    setTimeout(() => {
      setSearchLoading(false)
      toast.error('No results found. Please check your roll number.')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" alt="SMIT" style={{ height: '44px', width: 'auto' }} />
        </div>
        <div className="hidden md:flex items-center gap-7 text-base text-gray-600 font-medium">
          <span onClick={() => navigate('/home')} className="cursor-pointer hover:text-blue-600 transition">Home</span>
          <span onClick={() => navigate('/about')} className="cursor-pointer hover:text-blue-600 transition">About</span>
          <span onClick={() => navigate('/courses')} className="cursor-pointer hover:text-blue-600 transition flex items-center gap-1">
            Courses <span className="text-xs">▾</span>
          </span>
          <span className="cursor-pointer hover:text-blue-600 transition">Campuses</span>
          <span onClick={() => navigate('/result')} className="cursor-pointer hover:text-blue-600 transition">Check Result</span>
        </div>
        <div className="flex items-center gap-2">
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
        <div className="bg-white border-b border-gray-200 shadow-lg md:hidden">
          <div className="flex flex-col px-4 py-3 gap-3 text-base text-gray-700 font-medium">
            <span onClick={() => { navigate('/home'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">Home</span>
            <span onClick={() => { navigate('/about'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">About</span>
            <span onClick={() => { navigate('/courses'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">Courses</span>
            <span className="cursor-pointer hover:text-blue-600 py-2 border-b border-gray-100">Campuses</span>
            <span onClick={() => { navigate('/result'); setMobileMenu(false) }} className="cursor-pointer hover:text-blue-600 py-2">Check Result</span>
          </div>
        </div>
      )}

      {/* HERO HEADER */}
      <div className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(90deg, #1e5ba8 0%, #2b7a9e 25%, #3a9b8f 50%, #5ab87d 75%, #8fd66f 100%)',
          minHeight: '160px' 
        }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
          <div className="flex items-center gap-2 text-white text-sm mb-3">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/home')}>🏠</span>
            <span>›</span>
            <span>{activeTab === 'registration' ? 'Enroll Now' : activeTab === 'download' ? 'Download ID Card' : 'Result'}</span>
          </div>
          <h1 className="text-white text-2xl md:text-4xl font-black mb-2">
            {activeTab === 'registration' ? 'Registration Form' : activeTab === 'download' ? 'Download Your ID Card' : 'Check Your Result'}
          </h1>
          <p className="text-white text-sm opacity-90">
            {activeTab === 'registration' 
              ? 'Start your journey towards excellence. Fill out the form to apply for our courses'
              : activeTab === 'download'
              ? 'Enter your CNIC to download your student ID Card'
              : 'Enter your roll number to view your examination results'}
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex gap-2 md:gap-4 justify-start md:justify-center overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('registration')}
            className={`px-4 md:px-8 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-semibold transition flex items-center gap-2 shadow-md whitespace-nowrap ${
              activeTab === 'registration' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            style={activeTab === 'registration' ? { background: '#0ea5e9' } : {}}>
            📋 Registration Form
          </button>
          <button onClick={() => setActiveTab('download')}
            className={`px-4 md:px-8 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-semibold transition flex items-center gap-2 shadow-md whitespace-nowrap ${
              activeTab === 'download' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            style={activeTab === 'download' ? { background: '#0ea5e9' } : {}}>
            💳 Download ID Card
          </button>
          <button onClick={() => setActiveTab('result')}
            className={`px-4 md:px-8 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-semibold transition flex items-center gap-2 shadow-md whitespace-nowrap ${
              activeTab === 'result' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            style={activeTab === 'result' ? { background: '#0ea5e9' } : {}}>
            📊 Result
          </button>
        </div>
      </div>

      {/* FORM */}
      {activeTab === 'registration' && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
          <div className="bg-white rounded-xl p-4 md:p-10 border-2 border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Location & Course Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  Location & Course Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Select Country*</label>
                    <select required value={form.country} onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">Select country</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="UAE">UAE</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Select class preference*</label>
                    <select required value={form.class_preference} onChange={(e) => handleChange('class_preference', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">Select class preference</option>
                      <option value="Onsite">Onsite</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Select Gender*</label>
                    <select required value={form.gender} onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Select City*</label>
                    <select required value={form.city} onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">Select country first</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Select Course*</label>
                    <select required value={form.course} onChange={(e) => handleChange('course', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">No course available</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="Graphic Design">Graphic Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Select Campus</label>
                    <select value={form.campus} onChange={(e) => handleChange('campus', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">Select course first</option>
                      <option value="Main Campus">Main Campus</option>
                      <option value="North Campus">North Campus</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Full Name*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                      <input required type="text" placeholder="Enter your full name"
                        value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Father Name*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                      <input required type="text" placeholder="Enter father's name"
                        value={form.father_name} onChange={(e) => handleChange('father_name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Date of Birth*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📅</span>
                      <input required type="date"
                        value={form.dob} onChange={(e) => handleChange('dob', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Email*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                      <input required type="email" placeholder="your.email@example.com"
                        value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Phone*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
                      <input required type="tel" placeholder="Enter phone number"
                        value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Father's Phone*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
                      <input required type="tel" placeholder="Enter phone number"
                        value={form.father_phone} onChange={(e) => handleChange('father_phone', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">ID Number*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🆔</span>
                      <input required type="text" placeholder="Enter ID number"
                        value={form.id_number} onChange={(e) => handleChange('id_number', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Father's ID Number*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🆔</span>
                      <input required type="text" placeholder="Enter ID number"
                        value={form.father_id_number} onChange={(e) => handleChange('father_id_number', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-900 mb-2 block">
                      Address* <span className="text-gray-400 font-normal">(0/20 characters)</span>
                    </label>
                    <textarea required rows={3} placeholder="Enter your complete address (minimum 10 characters)"
                      value={form.address} onChange={(e) => handleChange('address', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                  </div>
                </div>
              </div>

              {/* Education & Technical Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                  Education & Technical Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Computer Proficiency*</label>
                    <select required value={form.computer_proficiency} onChange={(e) => handleChange('computer_proficiency', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">Select your computer proficiency</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Last Qualification*</label>
                    <select required value={form.last_qualification} onChange={(e) => handleChange('last_qualification', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">Last qualification</option>
                      <option value="Matric">Matric</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Masters">Masters</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Where did you hear about us?*</label>
                    <select required value={form.hear_about} onChange={(e) => handleChange('hear_about', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">Where did you hear about us?</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Friend/Family">Friend/Family</option>
                      <option value="Website">Website</option>
                      <option value="Advertisement">Advertisement</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Do you have a Laptop?*</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input required type="radio" name="laptop" value="Yes"
                          checked={form.has_laptop === 'Yes'}
                          onChange={(e) => handleChange('has_laptop', e.target.value)}
                          className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input required type="radio" name="laptop" value="No"
                          checked={form.has_laptop === 'No'}
                          onChange={(e) => handleChange('has_laptop', e.target.value)}
                          className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Picture */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                  </svg>
                  Upload Picture
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-3xl">📤</span>
                    </div>
                    <button type="button" onClick={() => document.getElementById('picture-upload').click()}
                      className="px-6 py-2.5 text-white rounded-full text-sm font-semibold transition shadow-md"
                      style={{ background: '#0ea5e9' }}>
                      + Upload Picture
                    </button>
                    <input id="picture-upload" type="file" accept="image/*" className="hidden"
                      onChange={(e) => handleChange('picture', e.target.files[0])} />
                    <div className="text-xs text-gray-500 space-y-1 mt-2">
                      <p>- With white or blue background</p>
                      <p>- File size must be less than 1MB</p>
                      <p>- File type: jpg, jpeg, png</p>
                      <p>- Upload your recent passport size picture</p>
                      <p>- Your Face should be clearly visible without any Glasses</p>
                    </div>
                    {form.picture && (
                      <p className="text-sm text-green-600 font-semibold mt-2">✓ {form.picture.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Terms and Conditions
                </h3>
                <div className="space-y-4 bg-gray-50 rounded-xl p-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.terms1}
                      onChange={(e) => handleChange('terms1', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                      I hereby solemnly declare that all information provided in this application is true and accurate to the best of my knowledge. Furthermore, I agree to abide by all current and future rules, regulations, and policies established by SMIT.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.terms2}
                      onChange={(e) => handleChange('terms2', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                      I accept the responsibility to maintain good conduct throughout the program and commit to focusing solely on learning. I will not engage in any political, unethical, or unrelated activities during my enrollment. Any violation may result in immediate cancellation of my admission.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.terms3}
                      onChange={(e) => handleChange('terms3', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                      Upon completion of the course, I agree to successfully complete any project assigned by SMIT as part of the program requirements.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.terms4}
                      onChange={(e) => handleChange('terms4', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                      Female students are required to wear an abaya or hijab while attending classes.
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  By submitting this form, you agree to our{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span> and{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span>.
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xl">ℹ️</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900 mb-1">Important Notice:</p>
                  <p className="text-sm text-blue-800">
                    Please ensure all information provided is accurate. Incomplete or false information may result in rejection of your application.
                  </p>
                </div>
              </div>

              {/* reCAPTCHA placeholder */}
              <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50 w-fit">
                <input type="checkbox" className="w-6 h-6" />
                <span className="text-sm text-gray-700">I'm not a robot</span>
                <div className="ml-4">
                  <div className="text-xs text-gray-400">reCAPTCHA</div>
                  <div className="flex gap-1 text-xs text-gray-400">
                    <span>Privacy</span>
                    <span>-</span>
                    <span>Terms</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading}
                className="w-full py-4 text-white rounded-lg font-bold text-base transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }}>
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing Registration...</>
                ) : (
                  <><span>📋</span> Submit Registration & Get Roll Number</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'download' && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12" ref={contentRef}>
          <div className="bg-white rounded-xl p-6 md:p-10 border-2 border-gray-200 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Download ID Card</h2>
              <p className="text-gray-500 text-sm">Enter your CNIC to check status and download your ID card</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-2">
              <svg className="w-4 h-4 text-[#0ea5e9] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-700">Enter the CNIC you used during registration. Do not use dashes (-).</p>
            </div>

            <form onSubmit={handleSearchIDCard} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">CNIC Number*</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 4220109966883"
                  value={cnic}
                  onChange={(e) => { setCnic(e.target.value); setIdCardData(null); setRegistrationStatus(null) }}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0ea5e9] transition bg-gray-50"
                />
              </div>
              <button type="submit" disabled={searchLoading}
                className="w-full py-3 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }}>
                {searchLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Searching...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> Search</>
                )}
              </button>
            </form>

            {/* Status Results */}
            {registrationStatus && (
              <div className="mt-6">
                {registrationStatus.status === 'pending' && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                    <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-yellow-800 text-lg mb-1">Application Under Review</h3>
                    <p className="text-yellow-700 text-sm mb-2">Hello <strong>{registrationStatus.name}</strong>!</p>
                    <p className="text-yellow-600 text-sm">Your registration for <strong>{registrationStatus.course}</strong> is currently being reviewed by admin. You will receive your Roll Number once approved.</p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                {registrationStatus.status === 'rejected' && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-red-700 text-lg mb-1">Application Rejected</h3>
                    <p className="text-red-600 text-sm">Sorry <strong>{registrationStatus.name}</strong>, your application was not approved. Please contact SMIT for more information.</p>
                  </div>
                )}
                {registrationStatus.status === 'approved_no_student' && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                    <p className="text-blue-700 text-sm">Your registration is approved but Roll Number is being assigned. Please check back shortly or contact admin.</p>
                  </div>
                )}
              </div>
            )}

            {/* ID Card Ready */}
            {idCardData && (
              <div className="mt-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800">Registration Approved!</h3>
                    <p className="text-green-700 text-sm">Roll Number: <strong className="text-lg">{idCardData.roll_number}</strong></p>
                    <p className="text-green-600 text-xs mt-1">Your ID card is ready to download</p>
                  </div>
                </div>
                <button
                  onClick={() => setIdCardData({ ...idCardData, showCard: true })}
                  className="w-full py-3 text-white rounded-lg font-bold transition flex items-center justify-center gap-2 hover:shadow-lg"
                  style={{ background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  View & Download ID Card
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ID Card Modal */}
      {idCardData?.showCard && (
        <IDCard
          student={idCardData}
          onClose={() => setIdCardData({ ...idCardData, showCard: false })}
        />
      )}

      {activeTab === 'result' && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12" ref={contentRef}>
          <div className="bg-white rounded-xl p-6 md:p-10 border-2 border-gray-200 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Check Your Result</h2>
            <p className="text-center text-gray-600 mb-6">Enter your roll number to view your results</p>
            <form onSubmit={handleSearchResult} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">Roll Number*</label>
                <input
                  required
                  type="text"
                  placeholder="ENTER YOUR ROLL NUMBER"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="w-full py-3 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: '#0ea5e9' }}>
                <span>🔍</span>
                {searchLoading ? 'Searching Result...' : 'Search Result'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
