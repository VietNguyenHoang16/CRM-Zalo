'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

interface DashboardStats {
  todayCustomers: number; pendingZalo: number; pendingCall: number; contactedCount: number; messagedCount: number; total: number; conversionRate: number
}

interface UrgentCustomer { id: string; name: string; phone: string; status: string }

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ todayCustomers: 0, pendingZalo: 0, pendingCall: 0, contactedCount: 0, messagedCount: 0, total: 0, conversionRate: 0 })
  const [urgentCustomers, setUrgentCustomers] = useState<UrgentCustomer[]>([])

  useEffect(() => {
    apiFetch<DashboardStats>('/api/dashboard').then(setStats).catch(() => {})
    apiFetch<UrgentCustomer[]>('/api/customers?status=PENDING_ZALO').then(data => setUrgentCustomers(data.slice(0, 6))).catch(() => {})
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Tổng quan hoạt động kinh doanh hôm nay</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card blue">
          <div className="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
          <div className="stat-value">{stats.todayCustomers}</div>
          <div className="stat-label">Khách mới hôm nay</div>
        </div>

        <div className="stat-card yellow">
          <div className="stat-icon yellow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="stat-value">{stats.pendingZalo}</div>
          <div className="stat-label">Chờ kết bạn Zalo</div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </div>
          <div className="stat-value">{stats.pendingCall}</div>
          <div className="stat-label">Cần gọi ngay</div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="stat-value">{stats.contactedCount}</div>
          <div className="stat-label">Đã liên hệ</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Khách cần xử lý ngay</div>
          {urgentCustomers.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>Không có khách cần xử lý</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {urgentCustomers.map(c => (
                <Link href={`/customers/${c.id}`} key={c.id} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#fef3c7', borderRadius: 10, border: '1px solid #fde68a' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                      {c.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.name}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{c.phone}</div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Tổng quan</div>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: 10 }}>
              <span style={{ color: '#64748b' }}>Tổng khách hàng</span>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>{stats.total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: 10 }}>
              <span style={{ color: '#64748b' }}>Tỷ lệ chuyển đổi</span>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>{stats.conversionRate}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: 10 }}>
              <span style={{ color: '#64748b' }}>Đã nhắn tin</span>
              <span style={{ fontWeight: 700, color: '#7c3aed' }}>{stats.messagedCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: 10 }}>
              <span style={{ color: '#64748b' }}>Khách hàng hôm nay</span>
              <span style={{ fontWeight: 700, color: '#2563eb' }}>{stats.todayCustomers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
