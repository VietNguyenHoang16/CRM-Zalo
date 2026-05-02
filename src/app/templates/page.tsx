'use client'
import { useEffect, useState } from 'react'
import { apiFetch, getErrorMessage } from '@/lib/api'
import { TEMPLATE_GROUP_LABELS } from '@/lib/utils'

interface Template { id: string; title: string; content: string; group: string; createdAt: string }

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', group: 'CHAO_MOI' })
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchTemplates = () => apiFetch<Template[]>('/api/templates').then(setTemplates).catch(() => {})

  useEffect(() => { fetchTemplates() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await apiFetch('/api/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setForm({ title: '', content: '', group: 'CHAO_MOI' }); setShowForm(false); fetchTemplates()
    } catch (e: unknown) {
      setError(getErrorMessage(e))
    }
  }

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const groupedTemplates = templates.reduce((acc, t) => {
    if (!acc[t.group]) acc[t.group] = []
    acc[t.group].push(t)
    return acc
  }, {} as Record<string, Template[]>)

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Mẫu tin nhắn</h1>
            <p className="page-subtitle">Quản lý các mẫu tin nhắn có sẵn</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm mẫu
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 20 }}>Thêm mẫu tin nhắn mới</h3>
          {error && <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 10, marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label className="label">Tiêu đề</label>
                <input className="input" placeholder="VD: Chào mời sản phẩm" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div>
                <label className="label">Nhóm</label>
                <select className="input" value={form.group} onChange={e => setForm({...form, group: e.target.value})}>
                  {Object.entries(TEMPLATE_GROUP_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Nội dung <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Dùng biến: {'{ten}'}, {'{sdt}'}, {'{nguon}'})</span></label>
                <textarea className="input" style={{ height: 120, resize: 'vertical' }} placeholder="Nhập nội dung mẫu tin nhắn..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="submit" className="btn btn-primary">Lưu mẫu</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Hủy</button>
            </div>
          </form>
        </div>
      )}

      {Object.entries(groupedTemplates).map(([group, tmpls]) => (
        <div key={group} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`group-badge group-${group}`}>{TEMPLATE_GROUP_LABELS[group as keyof typeof TEMPLATE_GROUP_LABELS] || group}</span>
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>({tmpls.length})</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
            {tmpls.map(t => (
              <div key={t.id} className="template-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h4 style={{ fontWeight: 600, fontSize: 15 }}>{t.title}</h4>
                  <button onClick={() => copyToClipboard(t.content, t.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }}>
                    {copiedId === t.id ? 'Đã copy!' : 'Copy'}
                  </button>
                </div>
                <div className="template-content">{t.content}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {templates.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 16px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </div>
          <p style={{ color: '#64748b', fontSize: 15 }}>Chưa có mẫu tin nhắn nào</p>
        </div>
      )}
    </div>
  )
}
