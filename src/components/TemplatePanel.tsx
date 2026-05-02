'use client'
import { useState } from 'react'
import { replaceVariables } from '@/lib/utils'
import { TEMPLATE_GROUP_LABELS } from '@/lib/utils'
import type { TemplateGroup } from '@/lib/utils'

interface Template {
  id: string; title: string; content: string; group: string
}

interface Customer {
  name: string; phone: string
  source: { name: string } | null
}

interface TemplatePanelProps {
  templates: Template[]
  customer: Customer
  selectedTemplate: { id: string; title: string; content: string } | null
  onSelect: (t: { id: string; title: string; content: string }) => void
  onMarkSent: (templateId: string) => void
}

export default function TemplatePanel({ templates, customer, selectedTemplate, onSelect, onMarkSent }: TemplatePanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!selectedTemplate) return
    const content = replaceVariables(selectedTemplate.content, { ten: customer.name, sdt: customer.phone, nguon: customer.source?.name })
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {selectedTemplate && (
        <div className="card" style={{ marginBottom: 24, border: '2px solid #2563eb' }}>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>{selectedTemplate.title}</h3>
          <div className="template-content">
            {replaceVariables(selectedTemplate.content, { ten: customer.name, sdt: customer.phone, nguon: customer.source?.name })}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={handleCopy} className="btn btn-primary" style={{ flex: 1 }}>
              {copied ? 'Đã copy!' : 'Copy'}
            </button>
            <button onClick={() => onMarkSent(selectedTemplate.id)} className="btn" style={{ background: '#dcfce7', color: '#15803d' }}>
              Đánh dấu đã gửi
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">Mẫu tin nhắn</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {templates.map(t => (
            <button key={t.id} onClick={() => onSelect({ id: t.id, title: t.title, content: t.content })}
              style={{ textAlign: 'left', padding: '12px 16px', background: selectedTemplate?.id === t.id ? '#eff6ff' : '#f8fafc', border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t.title}</div>
              <span className={`group-badge group-${t.group}`}>{TEMPLATE_GROUP_LABELS[t.group as TemplateGroup] || t.group}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
