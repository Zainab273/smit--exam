import { useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

export default function IDCard({ student, onClose }) {
  const cardRef = useRef(null)

  const handleDownload = async () => {
    const toastId = toast.loading('Generating ID Card...')
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] })
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54)
      pdf.save(`SMIT_ID_${student.roll_number}.pdf`)
      toast.success('ID Card downloaded!', { id: toastId })
    } catch {
      toast.error('Download failed. Try again.', { id: toastId })
    }
  }

  const handlePrint = () => {
    const printContent = cardRef.current.outerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>SMIT ID Card</title>
      <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; }
        @media print { body { background: white; } }
      </style>
      </head><body>${printContent}<script>window.onload=()=>{window.print();window.close()}<\/script></body></html>
    `)
    win.document.close()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Student ID Card</h3>
            <p className="text-sm text-white/80">Ready to download or print</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ID Card Preview */}
        <div className="p-8 flex justify-center bg-gray-100">
          <div ref={cardRef} style={{
            width: '342px', height: '216px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            {/* Background pattern */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(14,165,233,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(90,184,125,0.15) 0%, transparent 50%)',
            }} />

            {/* Top stripe */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
              background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)',
            }} />

            {/* Left section - Photo */}
            <div style={{ position: 'absolute', left: '16px', top: '20px', bottom: '20px', width: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              {/* Photo */}
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                border: '2px solid #0ea5e9',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0ea5e9, #5ab87d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {student.picture_url ? (
                  <img src={student.picture_url} alt={student.full_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                    {student.full_name?.charAt(0)}
                  </span>
                )}
              </div>
              {/* SMIT Logo text */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#0ea5e9', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>SMIT</div>
                <div style={{ color: '#5ab87d', fontSize: '7px', letterSpacing: '0.5px' }}>SAYLANI MIT</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{
              position: 'absolute', left: '96px', top: '16px', bottom: '16px',
              width: '1px', background: 'linear-gradient(to bottom, transparent, #0ea5e9, #5ab87d, transparent)',
            }} />

            {/* Right section - Info */}
            <div style={{ position: 'absolute', left: '108px', top: '16px', right: '12px' }}>
              {/* Title */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#0ea5e9', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Student Identity Card
                </div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', lineHeight: 1.2 }}>
                  {student.full_name}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '9px', marginTop: '2px' }}>
                  S/O {student.father_name}
                </div>
              </div>

              {/* Details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
                <InfoItem label="Roll No" value={student.roll_number} highlight />
                <InfoItem label="Course" value={student.course} />
                <InfoItem label="CNIC" value={student.id_number} />
                <InfoItem label="City" value={student.city} />
                <InfoItem label="Batch" value={new Date(student.created_at).getFullYear()} />
                <InfoItem label="Status" value="Enrolled" green />
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(90deg, #0ea5e9, #5ab87d)',
              padding: '4px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: 'white', fontSize: '7px', opacity: 0.9 }}>
                saylanimit.com
              </span>
              <span style={{ color: 'white', fontSize: '7px', opacity: 0.9 }}>
                Saylani Welfare International Trust
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 bg-white flex gap-3">
          <button onClick={handlePrint}
            className="flex-1 border-2 border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#5ab87d] text-white rounded-lg py-3 font-medium hover:shadow-lg transition flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value, highlight, green }) {
  return (
    <div>
      <div style={{ color: '#64748b', fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{
        color: highlight ? '#0ea5e9' : green ? '#5ab87d' : '#e2e8f0',
        fontSize: '9px', fontWeight: 'bold', marginTop: '1px',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{value || 'N/A'}</div>
    </div>
  )
}
