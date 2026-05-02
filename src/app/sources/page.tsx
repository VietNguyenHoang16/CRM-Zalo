'use client'
import { useState } from 'react'
import { getErrorMessage } from '@/lib/api'
import { useSources, useCreateSource } from '@/hooks/queries'

export default function SourcesPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', name: '' })
  const [error, setError] = useState('')

  const { data: sources = [], isLoading } = useSources()
  const createSource = useCreateSource()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await createSource.mutateAsync(form)
      setForm({ code: '', name: '' }); setShowForm(false)
    } catch (e: unknown) {
      setError(getErrorMessage(e))
    }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Nguồn khách hàng</h1>
            <p className="page-subtitle">Quản lý danh sách nguồn khách</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm nguồn
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 20 }}>Thêm nguồn khách mới</h3>
          {error && <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 10, marginBottom: 16 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div>
                <label className="label">Mã nguồn</label>
                <input className="input" placeholder="VD: FACEBOOK" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required />
              </div>
              <div>
                <label className="label">Tên nguồn</label>
                <input className="input" placeholder="VD: Facebook" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="submit" className="btn btn-primary" disabled={createSource.isPending}>
                {createSource.isPending ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#64748b', fontSize: 15 }}>Đang tải...</p>
          </div>
        ) : sources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 64, height: 64, margin: '0 auto 16px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" width="32" height="32">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <p style={{ color: '#64748b', fontSize: 15 }}>Chưa có nguồn khách nào</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Mã nguồn</th>
                <th>Tên nguồn</th>
              </tr>
            </thead>
            <tbody>
              {sources.map(s => (
                <tr key={s.id}>
                  <td><code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 6, fontSize: 13 }}>{s.code}</code></td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
