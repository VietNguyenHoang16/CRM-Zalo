'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <div style={{ maxWidth: 480, margin: '80px auto 0' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 24px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#dc2626" width="40" height="40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Đã xảy ra lỗi</h1>
        <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>
          Hệ thống gặp sự cố không mong muốn. Vui lòng thử lại hoặc làm mới trang.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => reset()} className="btn btn-primary">
            Thử lại
          </button>
          <button onClick={() => window.location.reload()} className="btn btn-secondary">
            Làm mới trang
          </button>
        </div>
      </div>
    </div>
  )
}
