'use client'
import { useEffect } from 'react'
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

export default function CustomerModal({ customerId, onClose }: CustomerModalProps) {
  const { customer, templates, selectedTemplate, setSelectedTemplate, handleAction } = useCustomerDetail(customerId)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!customer) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center', color: '#64748b' }}>Đang tải...</div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{customer.name}</h2>
          <button onClick={onClose} className="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg, #2563eb, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 28 }}>
                  {customer.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{customer.name}</h2>
                  <p style={{ color: '#64748b', fontSize: 15, marginBottom: 8 }}>{customer.phone}</p>
                  {customer.source && <span className="source-badge">{customer.source.name}</span>}
                </div>
                <span className={`status-badge status-${customer.status}`}>{STATUS_LABELS[customer.status as CustomerStatus] || customer.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
                {customer.email && <div><div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Email</div><div style={{ fontWeight: 500 }}>{customer.email}</div></div>}
                {customer.address && <div><div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Địa chỉ</div><div style={{ fontWeight: 500 }}>{customer.address}</div></div>}
                <div><div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Ngày tạo</div><div style={{ fontWeight: 500 }}>{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</div></div>
                {customer.zaloSentAt && <div><div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Đã gửi KB Zalo</div><div style={{ fontWeight: 500 }}>{new Date(customer.zaloSentAt).toLocaleString('vi-VN')}</div></div>}
              </div>

              {customer.note && (
                <div style={{ marginTop: 20, padding: 16, background: '#f8fafc', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Ghi chú</div>
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
              onMarkSent={(templateId) => handleAction('MESSAGE_SENT', undefined, templateId)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
