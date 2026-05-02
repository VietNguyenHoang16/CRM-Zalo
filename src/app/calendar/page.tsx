'use client'
import { useState } from 'react'
import { useAppointments } from '@/hooks/queries'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const { data: appointments = [], isLoading } = useAppointments()

  const filtered = appointments.filter(a => a.scheduledAt.startsWith(selectedDate))

  const formatTime = (date: string) => new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Lịch hẹn</h1>
        <p className="page-subtitle">Xem và quản lý các lịch hẹn với khách hàng</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input" style={{ width: 200 }} />
          <span style={{ color: '#64748b' }}>{new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long' })}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Lịch hẹn ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}</div>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#64748b' }}>Đang tải...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 64, height: 64, margin: '0 auto 16px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" width="32" height="32">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <p style={{ color: '#64748b' }}>Không có lịch hẹn nào trong ngày này</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#f8fafc', borderRadius: 12, borderLeft: '4px solid #2563eb' }}>
                <div style={{ textAlign: 'center', minWidth: 60 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#2563eb' }}>{formatTime(a.scheduledAt)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{a.customer.name}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{a.customer.phone}</div>
                  {a.note && <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{a.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
