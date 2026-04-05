import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'
import Footer from '../../components/Footer'

export default function StudentRegistration() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('registration')
  const [cnic, setCnic] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const contentRef = useRef(null)
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
    
    // Validate required fields
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

      const { error } = await supabase.from('student_registrations').insert({
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
        status: 'pending',
      })

      setLoading(false)
      
      if (error) {
        console.error('Registration error:', error)
        toast.error('Registration failed: ' + error.message)
        return
      }
      
      toast.success('Registration submitted successfully! We will contact you soon.')
      
      // Reset form
      setForm({
        country: '', gender: '', course: '', class_preference: '', city: '', campus: '',
        full_name: '', father_name: '', dob: '', email: '', phone: '', father_phone: '',
        id_number: '', father_id_number: '', address: '',
        computer_proficiency: '', last_qualification: '', hear_about: '', has_laptop: '',
        picture: null,
        terms1: false, terms2: false, terms3: false, terms4: false,
      })
      
      // Optionally navigate to home or login
      setTimeout(() => {
        navigate('/home')
      }, 2000)
      
    } catch (err) {
      setLoading(false)
      console.error('Unexpected error:', err)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  const handleSearchIDCard = async (e) => {
    e.preventDefault()
    setSearchLoading(true)
    // Simulate search
    setTimeout(() => {
      setSearchLoading(false)
      toast.error('No ID card found. Please contact admin.')
    }, 1500)
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
      <nav className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/6e8e40210058827.Y3JvcCwxMDgwLDg0NCwwLDExNw.png" alt="SMIT" style={{ height: '52px', width: 'auto' }} />
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
        <button onClick={() => navigate('/student/register')}
          className="text-white px-5 py-2 rounded-full text-sm font-bold transition flex items-center gap-1"
          style={{ background: '#0ea5e9' }}>
          Enroll Now ↗
        </button>
      </nav>

      {/* HERO HEADER */}
      <div className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(90deg, #1e5ba8 0%, #2b7a9e 25%, #3a9b8f 50%, #5ab87d 75%, #8fd66f 100%)',
          minHeight: '180px' 
        }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-white text-sm mb-3">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/home')}>🏠</span>
            <span>›</span>
            <span>{activeTab === 'registration' ? 'Enroll Now' : activeTab === 'download' ? 'Download ID Card' : 'Result'}</span>
          </div>
          <h1 className="text-white text-4xl font-black mb-2">
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-4 justify-center">
          <button onClick={() => setActiveTab('registration')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition flex items-center gap-2 shadow-md ${
              activeTab === 'registration' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            style={activeTab === 'registration' ? { background: '#0ea5e9' } : {}}>
            📋 Registration Form
          </button>
          <button onClick={() => setActiveTab('download')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition flex items-center gap-2 shadow-md ${
              activeTab === 'download' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            style={activeTab === 'download' ? { background: '#0ea5e9' } : {}}>
            💳 Download ID Card
          </button>
          <button onClick={() => setActiveTab('result')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition flex items-center gap-2 shadow-md ${
              activeTab === 'result' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            style={activeTab === 'result' ? { background: '#0ea5e9' } : {}}>
            📊 Result
          </button>
        </div>
      </div>

      {/* FORM */}
      {activeTab === 'registration' && (
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="bg-white rounded-xl p-10 border-2 border-gray-200">
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
                style={{ background: '#0ea5e9' }}>
                <span>📋</span>
                {loading ? 'Submitting Registration...' : 'Submit Registration'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'download' && (
        <div className="max-w-6xl mx-auto px-6 pb-12" ref={contentRef}>
          <div className="bg-white rounded-xl p-10 border-2 border-gray-200 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Download ID Card</h2>
            <p className="text-center text-gray-600 mb-6">Enter the CNIC you provided during form submission.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-start gap-2">
              <span className="text-yellow-600 text-lg">⚠️</span>
              <p className="text-sm text-yellow-800">Don't use dashes (-) in CNIC number.</p>
            </div>
            <form onSubmit={handleSearchIDCard} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">CNIC Number*</label>
                <input
                  required
                  type="text"
                  placeholder="4220109966883"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="w-full py-3 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: '#0ea5e9' }}>
                <span>🔍</span>
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'result' && (
        <div className="max-w-6xl mx-auto px-6 pb-12" ref={contentRef}>
          <div className="bg-white rounded-xl p-10 border-2 border-gray-200 max-w-2xl mx-auto">
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
