'use client'
import { useEffect, useCallback, memo } from 'react'
import { useCustomerDetail } from '@/hooks/useCustomerDetail'
import { STATUS_LABELS } from '@/lib/utils'
import type { CustomerStatus } from '@/lib/utils'
import CustomerActions from '@/components/CustomerActions'
import CustomerTimeline from '@/components/CustomerTimeline'
import TemplatePanel from '@/components/TemplatePanel'

interface CustomerModalProps {
  customerId: string
  onClose: () => void
}

const s: Record<string, React.CSSProperties> = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  loadingWrap: { background: 'white', borderRadius: 16, padding: 40, textAlign: 'center', color: '#64748b' as const },
  header: { fontSize: 20, fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 },
  card: { marginBottom: 24 },
  avatar: { display: 'flex', gap: 20, alignItems: 'flex-start' },
  avatarIcon: { width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg, #2563eb, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 28 },
  avatarRight: { flex: 1 },
  nameTitle: { fontSize: 24, fontWeight: 700, marginBottom: 4 },
  phone: { color: '#64748b', fontSize: 15, marginBottom: 8 },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24, paddingTop: 24, borderTop: '1px solid #f1f5f9' as const },
  fieldLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 4 },
  fieldValue: { fontWeight: 500 },
  noteWrap: { marginTop: 20, padding: 16, background: '#f8fafc', borderRadius: 10 },
}

function CustomerModal({ customerId, onClose }: CustomerModalProps) {
  const { customer, templates, selectedTemplate, setSelectedTemplate, handleAction } = useCustomerDetail(customerId)

  const onMarkSent = useCallback((templateId: string) => handleAction('MESSAGE_SENT', undefined, templateId), [handleAction])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!customer) return (
    <div style={s.backdrop}>
      <div style={s.loadingWrap}>Đang tải...</div>
    </div>
  )

  return (
    <div style={s.backdrop} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={s.header}>{customer.name}</h2>
          <button onClick={onClose} className="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={s.grid}>
          <div>
            <div className="card" style={s.card}>
              <div style={s.avatar}>
                <div style={s.avatarIcon}>
                  {customer.name.charAt(0)}
                </div>
                <div style={s.avatarRight}>
                  <h2 style={s.nameTitle}>{customer.name}</h2>
                  <p style={s.phone}>{customer.phone}</p>
                  {customer.source && <span className="source-badge">{customer.source.name}</span>}
                </div>
                <span className={`status-badge status-${customer.status}`}>{STATUS_LABELS[customer.status as CustomerStatus] || customer.status}</span>
              </div>

              <div style={s.infoGrid}>
                {customer.email && <div><div style={s.fieldLabel}>Email</div><div style={s.fieldValue}>{customer.email}</div></div>}
                {customer.address && <div><div style={s.fieldLabel}>Địa chỉ</div><div style={s.fieldValue}>{customer.address}</div></div>}
                <div><div style={s.fieldLabel}>Ngày tạo</div><div style={s.fieldValue}>{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</div></div>
                {customer.zaloSentAt && <div><div style={s.fieldLabel}>Đã gửi KB Zalo</div><div style={s.fieldValue}>{new Date(customer.zaloSentAt).toLocaleString('vi-VN')}</div></div>}
              </div>

              {customer.note && (
                <div style={s.noteWrap}>
                  <div style={s.fieldLabel}>Ghi chú</div>
                  <div style={{ color: '#475569' }}>{customer.note}</div>
                </div>
              )}
            </div>

            <CustomerActions status={customer.status} onAction={handleAction} />
          </div>

          <div>
            <CustomerTimeline logs={customer.logs} />

            <TemplatePanel
              templates={templates}
              customer={customer}
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
              onMarkSent={onMarkSent}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CustomerModal)
