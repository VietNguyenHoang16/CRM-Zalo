'use client'
import { useState, useCallback } from 'react'
import CustomerModal from '@/components/CustomerModal'
import { getErrorMessage } from '@/lib/api'
import { STATUS_LABELS } from '@/lib/utils'
import { useCustomers, useSources, useCreateCustomer, useDeleteCustomer } from '@/hooks/queries'

const statusOptions = Object.entries(STATUS_LABELS)

const s: Record<string, React.CSSProperties> = {
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  formCard: { marginBottom: 24 },
  formTitle: { fontWeight: 600, marginBottom: 20 },
  errorBox: { padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 10, marginBottom: 16 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 },
  noteArea: { gridColumn: 'span 2' },
  textarea: { height: 80, resize: 'vertical' as const },
  required: { color: '#ef4444' },
  btnRow: { display: 'flex', gap: 12, marginTop: 20 },
  filterCard: { marginBottom: 24 },
  filterWrap: { display: 'flex', gap: 12, flexWrap: 'wrap' as const },
  filterSelect: { width: 200 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },
  cardWrap: { position: 'relative' },
  delBtn: { position: 'absolute', top: 8, right: 8, zIndex: 2, width: 28, height: 28, borderRadius: 6, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 },
  clickable: { textDecoration: 'none', cursor: 'pointer' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  avatarRow: { display: 'flex', gap: 12, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #2563eb, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18 },
  cardName: { fontWeight: 600, color: '#1e293b', fontSize: 15 },
  cardPhone: { color: '#64748b', fontSize: 13 },
  sourceRow: { display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 12 },
  cardDate: { fontSize: 12, color: '#94a3b8' },
  emptyCard: { textAlign: 'center' as const, padding: '60px 0' },
  emptyIcon: { width: 64, height: 64, margin: '0 auto 16px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: '#64748b', fontSize: 15 },
  emptySubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  modalBackdrop: { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalBox: { background: 'white', borderRadius: 16, padding: 28, maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  warnIcon: { width: 40, height: 40, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 17, fontWeight: 700, color: '#1e293b', margin: 0 },
  modalBody: { color: '#475569', fontSize: 14, lineHeight: 1.6, margin: '0 0 8px 0' },
  modalSub: { color: '#94a3b8', fontSize: 13, margin: '0 0 24px 0' },
  modalBtns: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  delConfirm: { background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' },
}

export default function CustomersPage() {
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', note: '', sourceId: '' })
  const [error, setError] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; phone: string } | null>(null)

  const { data: customers = [], isLoading: customersLoading } = useCustomers(
    (filterStatus || filterSource) ? { status: filterStatus || undefined, sourceId: filterSource || undefined } : undefined
  )
  const { data: sources = [] } = useSources()
  const createCustomer = useCreateCustomer()
  const deleteCustomer = useDeleteCustomer()

  const closeModal = useCallback(() => setSelectedCustomerId(null), [])
  const cancelDelete = useCallback(() => setDeleteTarget(null), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await createCustomer.mutateAsync(form)
      setForm({ name: '', phone: '', email: '', address: '', note: '', sourceId: '' })
      setShowForm(false)
    } catch (e: unknown) {
      setError(getErrorMessage(e))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const targetId = deleteTarget.id
    setDeleteTarget(null)
    try {
      await deleteCustomer.mutateAsync(targetId)
    } catch {
      // query will auto-refetch on error since onError revalidates
    }
  }

  return (
    <div>
      <div className="page-header">
        <div style={s.headerRow}>
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
        <div className="card" style={s.formCard}>
          <h3 style={s.formTitle}>Thêm khách hàng mới</h3>
          {error && <div style={s.errorBox}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={s.formGrid}>
              <div>
                <label className="label">Tên Shop</label>
                <input className="input" placeholder="Nhập tên shop" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="label">Số điện thoại <span style={s.required}>*</span></label>
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
                <label className="label">Nguồn khách <span style={s.required}>*</span></label>
                <select className="input" value={form.sourceId} onChange={e => setForm({...form, sourceId: e.target.value})} required>
                  <option value="">Chọn nguồn</option>
                  {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={s.noteArea}>
                <label className="label">Ghi chú</label>
                <textarea className="input" style={s.textarea} placeholder="Ghi chú thêm..." value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
              </div>
            </div>
            <div style={s.btnRow}>
              <button type="submit" className="btn btn-primary" disabled={createCustomer.isPending}>
                {createCustomer.isPending ? 'Đang lưu...' : 'Lưu khách hàng'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={s.filterCard}>
        <div style={s.filterWrap}>
          <select className="input" style={s.filterSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className="input" style={s.filterSelect} value={filterSource} onChange={e => setFilterSource(e.target.value)}>
            <option value="">Tất cả nguồn</option>
            {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {(filterStatus || filterSource) && (
            <button onClick={() => { setFilterStatus(''); setFilterSource('') }} className="btn btn-secondary">Xóa lọc</button>
          )}
        </div>
      </div>

      {customersLoading ? (
        <div style={s.emptyCard}><p style={s.emptyTitle}>Đang tải...</p></div>
      ) : customers.length === 0 ? (
        <div className="card" style={s.emptyCard}>
          <div style={s.emptyIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <p style={s.emptyTitle}>Chưa có khách hàng nào</p>
          <p style={s.emptySubtitle}>Bắt đầu bằng cách thêm khách hàng đầu tiên</p>
        </div>
      ) : (
        <div style={s.grid}>
          {customers.map(c => (
            <div key={c.id} style={s.cardWrap}>
              <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(c) }} title="Xóa khách hàng" style={s.delBtn}>✕</button>
              <div onClick={() => setSelectedCustomerId(c.id)} style={s.clickable}>
              <div className="customer-card">
                <div style={s.cardTop}>
                  <div style={s.avatarRow}>
                    <div style={s.avatar}>{c.name.charAt(0)}</div>
                    <div>
                      <div style={s.cardName}>{c.name}</div>
                      <div style={s.cardPhone}>{c.phone}</div>
                    </div>
                  </div>
                  <span className={`status-badge status-${c.status}`}>{STATUS_LABELS[c.status as keyof typeof STATUS_LABELS] || c.status}</span>
                </div>
                <div style={s.sourceRow}>
                  {c.source && <span className="source-badge">{c.source.name}</span>}
                </div>
                <div style={s.cardDate}>
                  Ngày tạo: {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCustomerId && (
        <CustomerModal customerId={selectedCustomerId} onClose={closeModal} />
      )}

      {deleteTarget && (
        <div onClick={cancelDelete} style={s.modalBackdrop}>
          <div onClick={e => e.stopPropagation()} style={s.modalBox}>
            <div style={s.modalHeader}>
              <div style={s.warnIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#ef4444" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h3 style={s.modalTitle}>Xác nhận xóa</h3>
            </div>
            <p style={s.modalBody}>
              Bạn có chắc chắn muốn xóa khách hàng <strong>{deleteTarget.name}</strong> ({deleteTarget.phone}) không?
            </p>
            <p style={s.modalSub}>Hành động này không thể hoàn tác. Tất cả lịch sử và lịch hẹn liên quan cũng sẽ bị xóa.</p>
            <div style={s.modalBtns}>
              <button onClick={() => setDeleteTarget(null)} disabled={deleteCustomer.isPending} className="btn btn-secondary">Hủy</button>
              <button onClick={handleDelete} disabled={deleteCustomer.isPending} style={s.delConfirm}>
                {deleteCustomer.isPending ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
