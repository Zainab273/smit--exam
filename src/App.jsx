import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'

import Landing from './pages/Landing'
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import Result from './pages/Result'
import StudentLogin from './pages/student/StudentLogin'
import StudentSignup from './pages/student/StudentSignup'
import StudentRegistration from './pages/student/StudentRegistration'
import StudentDashboard from './pages/student/StudentDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import Campuses from './pages/Campuses'

function ProtectedRoute({ children, allowedRole }) {
  const { user, role } = useSelector((s) => s.auth)
  if (!user) return <Navigate to="/" />
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/campuses" element={<Campuses />} />
        <Route path="/result" element={<Result />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/register" element={<StudentRegistration />} />
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
