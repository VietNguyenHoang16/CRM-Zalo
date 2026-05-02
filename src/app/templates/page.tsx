'use client'
import { useEffect, useState } from 'react'
import { apiFetch, getErrorMessage } from '@/lib/api'

interface Template { id: string; title: string; content: string; categoryId: string; category: { id: string; name: string } | null; createdAt: string }
interface Category { id: string; code: string; name: string; _count: { templates: number } }

export default function TemplatesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [categoryForm, setCategoryForm] = useState({ code: '', name: '' })
  const [categoryError, setCategoryError] = useState('')
  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const [templateForm, setTemplateForm] = useState({ title: '', content: '' })
  const [templateError, setTemplateError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState(false)

  const fetchCategories = () => apiFetch<Category[]>('/api/template-categories').then(setCategories).catch(() => {})

  const fetchTemplates = () => {
    const params = selectedCategoryId ? `?categoryId=${selectedCategoryId}` : ''
    apiFetch<Template[]>(`/api/templates${params}`).then(setTemplates).catch(() => {})
  }

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { fetchTemplates() }, [selectedCategoryId])

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setCategoryError('')
    try {
      await apiFetch('/api/template-categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(categoryForm)
      })
      setCategoryForm({ code: '', name: '' })
      setShowAddCategory(false)
      fetchCategories()
    } catch (e: unknown) { setCategoryError(getErrorMessage(e)) }
  }

  const confirmDeleteCategory = async () => {
    if (!deleteCategoryTarget) return
    setDeletingCategory(true)
    try {
      await apiFetch(`/api/template-categories/${deleteCategoryTarget.id}`, { method: 'DELETE' })
      setDeleteCategoryTarget(null)
      setDeletingCategory(false)
      if (selectedCategoryId === deleteCategoryTarget.id) setSelectedCategoryId('')
      fetchCategories()
    } catch { setDeletingCategory(false) }
  }

  const addTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    setTemplateError('')
    try {
      await apiFetch('/api/templates', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...templateForm, categoryId: selectedCategoryId })
      })
      setTemplateForm({ title: '', content: '' })
      setShowAddTemplate(false)
      fetchTemplates()
      fetchCategories()
    } catch (e: unknown) { setTemplateError(getErrorMessage(e)) }
  }

  const deleteTemplate = async (id: string) => {
    await apiFetch(`/api/templates/${id}`, { method: 'DELETE' })
    fetchTemplates()
    fetchCategories()
  }

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const selectedCategory = categories.find(c => c.id === selectedCategoryId)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mẫu tin nhắn</h1>
        <p className="page-subtitle">Quản lý danh mục và mẫu tin nhắn có sẵn</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>Danh mục</h3>
            <button onClick={() => setShowAddCategory(!showAddCategory)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 13 }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="14" height="14">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Thêm
            </button>
          </div>

          {showAddCategory && (
            <form onSubmit={addCategory} style={{ marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 10 }}>
              {categoryError && <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, marginBottom: 8, fontSize: 13 }}>{categoryError}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input className="input" placeholder="Mã danh mục (VD: CHAO_MOI)" value={categoryForm.code} onChange={e => setCategoryForm({...categoryForm, code: e.target.value})} required style={{ padding: '8px 12px', fontSize: 13 }} />
                <input className="input" placeholder="Tên danh mục (VD: Chào mời)" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} required style={{ padding: '8px 12px', fontSize: 13 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13, flex: 1 }}>Lưu</button>
                  <button type="button" onClick={() => { setShowAddCategory(false); setCategoryError('') }} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>Hủy</button>
                </div>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {categories.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCategoryId(c.id)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                  background: selectedCategoryId === c.id ? '#eff6ff' : 'transparent',
                  border: selectedCategoryId === c.id ? '1px solid #2563eb' : '1px solid transparent',
                  fontWeight: selectedCategoryId === c.id ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: 14 }}>
                  {c.name}
                  <span style={{ color: '#94a3b8', marginLeft: 6, fontSize: 12, fontWeight: 400 }}>({c._count.templates})</span>
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteCategoryTarget(c) }}
                  style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Xóa danh mục"
                >✕</button>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Chưa có danh mục nào</p>
          )}
        </div>

        <div>
          {!selectedCategoryId ? (
            <div className="card" style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 56, height: 56, margin: '0 auto 16px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" width="28" height="28">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </div>
              <p style={{ color: '#64748b', fontSize: 15 }}>Chọn một danh mục bên trái để xem mẫu tin nhắn</p>
              <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>Hoặc tạo danh mục mới để bắt đầu</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>{selectedCategory?.name} <span style={{ fontWeight: 400, color: '#94a3b8' }}>({templates.length})</span></h3>
                <button onClick={() => setShowAddTemplate(!showAddTemplate)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="14" height="14">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Thêm mẫu
                </button>
              </div>

              {showAddTemplate && (
                <div className="card" style={{ marginBottom: 20, padding: 20 }}>
                  <h4 style={{ fontWeight: 600, marginBottom: 16, fontSize: 15 }}>Thêm mẫu tin nhắn mới</h4>
                  {templateError && <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 10, marginBottom: 14, fontSize: 13 }}>{templateError}</div>}
                  <form onSubmit={addTemplate}>
                    <div style={{ display: 'grid', gap: 14 }}>
                      <div>
                        <label className="label">Tiêu đề</label>
                        <input className="input" placeholder="VD: Chào mời sản phẩm" value={templateForm.title} onChange={e => setTemplateForm({...templateForm, title: e.target.value})} required />
                      </div>
                      <div>
                        <label className="label">Nội dung <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 12 }}>(Biến: {'{ten}'}, {'{sdt}'}, {'{nguon}'})</span></label>
                        <textarea className="input" style={{ height: 100, resize: 'vertical' }} placeholder="Nhập nội dung mẫu tin nhắn..." value={templateForm.content} onChange={e => setTemplateForm({...templateForm, content: e.target.value})} required />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                      <button type="submit" className="btn btn-primary">Lưu mẫu</button>
                      <button type="button" onClick={() => { setShowAddTemplate(false); setTemplateError('') }} className="btn btn-secondary">Hủy</button>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
                {templates.map(t => (
                  <div key={t.id} className="template-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <h4 style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{t.title}</h4>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => copyToClipboard(t.content, t.id)}
                          className="btn btn-primary"
                          style={{ padding: '5px 12px', fontSize: 12 }}
                        >
                          {copiedId === t.id ? 'Đã copy!' : 'Copy'}
                        </button>
                        <button
                          onClick={() => deleteTemplate(t.id)}
                          style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Xóa mẫu"
                        >✕</button>
                      </div>
                    </div>
                    <div className="template-content" style={{ fontSize: 13 }}>{t.content}</div>
                  </div>
                ))}
              </div>

              {templates.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ color: '#64748b', fontSize: 14 }}>Chưa có mẫu tin nhắn nào trong danh mục này</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {deleteCategoryTarget && (
        <div onClick={() => { if (!deletingCategory) setDeleteCategoryTarget(null) }} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 16, padding: 28, maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#ef4444" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', margin: 0 }}>Xác nhận xóa danh mục</h3>
            </div>
            <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6, margin: '0 0 8px 0' }}>
              Bạn có chắc chắn muốn xóa danh mục <strong>{deleteCategoryTarget.name}</strong> không?
            </p>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 24px 0' }}>Tất cả mẫu tin nhắn trong danh mục này cũng sẽ bị xóa. Hành động này không thể hoàn tác.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteCategoryTarget(null)} disabled={deletingCategory} className="btn btn-secondary">Hủy</button>
              <button onClick={confirmDeleteCategory} disabled={deletingCategory} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                {deletingCategory ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
