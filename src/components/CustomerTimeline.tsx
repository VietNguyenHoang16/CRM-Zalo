import { ACTION_LABELS } from '@/lib/utils'
import type { ActionType } from '@/lib/utils'

interface Log {
  id: string; action: string; note: string | null; createdAt: string
  template: { title: string; content: string } | null
}

interface CustomerTimelineProps {
  logs: Log[]
}

export default function CustomerTimeline({ logs }: CustomerTimelineProps) {
  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-title">Lịch sử hoạt động</div>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {logs.map((log) => (
          <div key={log.id} className="timeline-item">
            <div className="timeline-dot"></div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{ACTION_LABELS[log.action as ActionType] || log.action}</div>
            {log.template && <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Mẫu: {log.template.title}</div>}
            {log.note && <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{log.note}</div>}
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(log.createdAt).toLocaleString('vi-VN')}</div>
          </div>
        ))}
        {logs.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>Chưa có lịch sử</p>}
      </div>
    </div>
  )
}
