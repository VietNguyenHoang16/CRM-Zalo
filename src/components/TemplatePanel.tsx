'use client'
import { memo, useState, useCallback } from 'react'
import { replaceVariables } from '@/lib/utils'

interface Template {
  id: string; title: string; content: string; category: { name: string } | null
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

const s: Record<string, React.CSSProperties> = {
  selectedCard: { marginBottom: 24, border: '2px solid #2563eb' },
  title: { fontWeight: 600, marginBottom: 12 },
  btnRow: { display: 'flex', gap: 10, marginTop: 16 },
  copyBtn: { flex: 1 },
  sentBtn: { background: '#dcfce7', color: '#15803d' },
  listWrap: { display: 'flex', flexDirection: 'column' as const, gap: 8 },
  tTitle: { fontWeight: 600, fontSize: 14, marginBottom: 4 },
}

function TemplatePanel({ templates, customer, selectedTemplate, onSelect, onMarkSent }: TemplatePanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    if (!selectedTemplate) return
    const content = replaceVariables(selectedTemplate.content, { ten: customer.name, sdt: customer.phone, nguon: customer.source?.name })
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [selectedTemplate, customer])

  return (
    <div>
      {selectedTemplate && (
        <div className="card" style={s.selectedCard}>
          <h3 style={s.title}>{selectedTemplate.title}</h3>
          <div className="template-content">
            {replaceVariables(selectedTemplate.content, { ten: customer.name, sdt: customer.phone, nguon: customer.source?.name })}
          </div>
          <div style={s.btnRow}>
            <button onClick={handleCopy} className="btn btn-primary" style={s.copyBtn}>
              {copied ? 'Đã copy!' : 'Copy'}
            </button>
            <button onClick={() => onMarkSent(selectedTemplate.id)} className="btn" style={s.sentBtn}>
              Đánh dấu đã gửi
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">Mẫu tin nhắn</div>
        <div style={s.listWrap}>
          {templates.map(t => (
            <button key={t.id} onClick={() => onSelect({ id: t.id, title: t.title, content: t.content })}
              style={{ textAlign: 'left', padding: '12px 16px', background: selectedTemplate?.id === t.id ? '#eff6ff' : '#f8fafc', border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={s.tTitle}>{t.title}</div>
              <span className="source-badge">{t.category?.name || 'Không danh mục'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(TemplatePanel)
