'use client'
import { useState } from 'react'
import { useSettings, useUpdateSettings } from '@/hooks/queries'

export default function SettingsPage() {
  const { data: serverSettings, isLoading } = useSettings()
  const [localSettings, setLocalSettings] = useState<{ tgChoAloSauKB: number; tgChoNhantinSauGoiKhongNghe: number; tgLapLichNhantinLan2: number } | null>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const updateSettings = useUpdateSettings()

  const settings = localSettings ?? serverSettings ?? { tgChoAloSauKB: 60, tgChoNhantinSauGoiKhongNghe: 30, tgLapLichNhantinLan2: 2 }

  const handleSave = async () => {
    setError('')
    try {
      await updateSettings.mutateAsync(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi khi lưu')
    }
  }

  const update = (field: 'tgChoAloSauKB' | 'tgChoNhantinSauGoiKhongNghe' | 'tgLapLichNhantinLan2', value: number) => {
    setLocalSettings(prev => ({ ...(prev ?? settings), [field]: value }))
  }

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cài đặt</h1>
        <p className="page-subtitle">Cấu hình các thông số hệ thống</p>
      </div>

      <div className="card">
        <div className="card-title">Thời gian chờ</div>
        {error && <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: 10, marginBottom: 16 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label className="label">Thời gian chờ alo sau kết bạn Zalo (phút)</label>
            <input type="number" className="input" style={{ maxWidth: 200 }} value={settings.tgChoAloSauKB} onChange={e => update('tgChoAloSauKB', Number(e.target.value))} />
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Sau khi gửi lời mời KB Zalo, nếu khách chưa đồng ý sẽ nhắc gọi alo. Mặc định: 60 phút.</p>
          </div>

          <div>
            <label className="label">Thời gian chờ nhắn tin sau gọi không nghe (phút)</label>
            <input type="number" className="input" style={{ maxWidth: 200 }} value={settings.tgChoNhantinSauGoiKhongNghe} onChange={e => update('tgChoNhantinSauGoiKhongNghe', Number(e.target.value))} />
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Khi gọi không trả lời, sau bao lâu sẽ nhắc nhắn tin. Mặc định: 30 phút.</p>
          </div>

          <div>
            <label className="label">Thời gian lên lịch nhắn tin lần 2 (ngày)</label>
            <input type="number" className="input" style={{ maxWidth: 200 }} value={settings.tgLapLichNhantinLan2} onChange={e => update('tgLapLichNhantinLan2', Number(e.target.value))} />
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Sau khi nhắn tin lần 1 mà chưa phản hồi, nhắc nhắn lại sau. Mặc định: 2 ngày.</p>
          </div>
        </div>

        <button onClick={handleSave} className="btn btn-primary" style={{ marginTop: 32 }} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? (
            'Đang lưu...'
          ) : saved ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Đã lưu!
            </>
          ) : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  )
}
