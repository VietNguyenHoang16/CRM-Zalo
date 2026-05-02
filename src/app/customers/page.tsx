'use client'
import { useEffect, useState } from 'react'
import CustomerModal from '@/components/CustomerModal'
import { apiFetch, getErrorMessage } from '@/lib/api'
import { STATUS_LABELS } from '@/lib/utils'

interface Customer {
  id: string; name: string; phone: string; email: string | null; address: string | null; note: string | null
  status: string; source: { name: string } | null; createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [sources, setSources] = useState<Array<{id: string, name: string}>>([])
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', note: '', sourceId: '' })
  const [error, setError] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchSources = () => apiFetch<Array<{id: string, name: string}>>('/api/sources').then(setSources).catch(() => {})
  const fetchCustomers = () => {
    const params = new URLSearchParams()
    if (filterStatus) params.set('status', filterStatus)
    if (filterSource) params.set('sourceId', filterSource)
    apiFetch<Customer[]>(`/api/customers${params.toString() ? '?' + params.toString() : ''}`).then(setCustomers).catch(() => {})
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiFetch(`/api/customers/${deleteTarget.id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      setDeleting(false)
      fetchCustomers()
    } catch { setDeleting(false) }
  }

  useEffect(() => { fetchSources() }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchCustomers() }, [filterStatus, filterSource])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await apiFetch('/api/customers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      setForm({ name: '', phone: '', email: '', address: '', note: '', sourceId: '' })
      setShowForm(false)
      fetchCustomers()
    } catch (e: unknown) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Khách hàng</h1>
            <p className="page-subtitle">Quản lý danh sách khách hàng tiềm năng</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm khách hàng
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 20 }}>Thêm khách hàng mới</h3>
          {error && <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 10, marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div>
                <label className="label">Tên Shop</label>
                <input className="input" placeholder="Nhập tên shop" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="label">Số điện thoại <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="input" placeholder="Nhập số điện thoại" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="Nhập email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="label">Địa chỉ</label>
                <input className="input" placeholder="Nhập địa chỉ" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <div>
                <label className="label">Nguồn khách <span style={{ color: '#ef4444' }}>*</span></label>
                <select className="input" value={form.sourceId} onChange={e => setForm({...form, sourceId: e.target.value})} required>
                  <option value="">Chọn nguồn</option>
                  {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="label">Ghi chú</label>
                <textarea className="input" style={{ height: 80, resize: 'vertical' }} placeholder="Ghi chú thêm..." value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="submit" className="btn btn-primary">Lưu khách hàng</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select className="input" style={{ width: 200 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className="input" style={{ width: 200 }} value={filterSource} onChange={e => setFilterSource(e.target.value)}>
            <option value="">Tất cả nguồn</option>
            {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {(filterStatus || filterSource) && (
            <button onClick={() => { setFilterStatus(''); setFilterSource('') }} className="btn btn-secondary">Xóa lọc</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {customers.map(c => (
          <div key={c.id} style={{ position: 'relative' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setDeleteTarget(c) }}
              title="Xóa khách hàng"
              style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, width: 28, height: 28, borderRadius: 6, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}
            >
              ✕
            </button>
            <div onClick={() => setSelectedCustomerId(c.id)} style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="customer-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18 }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 15 }}>{c.name}</div>
                    <div style={{ color: '#64748b', fontSize: 13 }}>{c.phone}</div>
                  </div>
                </div>
                <span className={`status-badge status-${c.status}`}>{STATUS_LABELS[c.status as keyof typeof STATUS_LABELS] || c.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {c.source && <span className="source-badge">{c.source.name}</span>}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                Ngày tạo: {new Date(c.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 16px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <p style={{ color: '#64748b', fontSize: 15 }}>Chưa có khách hàng nào</p>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>Bắt đầu bằng cách thêm khách hàng đầu tiên</p>
        </div>
      )}

      {selectedCustomerId && (
        <CustomerModal customerId={selectedCustomerId} onClose={() => setSelectedCustomerId(null)} />
      )}

      {deleteTarget && (
        <div onClick={() => { if (!deleting) setDeleteTarget(null) }} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 16, padding: 28, maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#ef4444" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: 0 }}>Xác nhận xóa</h3>
            </div>
            <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6, margin: '0 0 8px 0' }}>
              Bạn có chắc chắn muốn xóa khách hàng <strong>{deleteTarget.name}</strong> ({deleteTarget.phone}) không?
            </p>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 24px 0' }}>Hành động này không thể hoàn tác. Tất cả lịch sử và lịch hẹn liên quan cũng sẽ bị xóa.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="btn btn-secondary">Hủy</button>
              <button onClick={confirmDelete} disabled={deleting} className="btn btn-danger" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
