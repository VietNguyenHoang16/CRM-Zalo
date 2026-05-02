import { memo } from 'react'
import { ACTION_LABELS } from '@/lib/utils'
import type { ActionType } from '@/lib/utils'

interface Log {
  id: string; action: string; note: string | null; createdAt: string
  template: { title: string; content: string } | null
}

interface CustomerTimelineProps {
  logs: Log[]
}

const s: Record<string, React.CSSProperties> = {
  action: { fontWeight: 600, fontSize: 14, marginBottom: 4 },
  sub: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  time: { fontSize: 12, color: '#94a3b8' },
  empty: { color: '#94a3b8', textAlign: 'center' as const, padding: '20px 0' },
  scroll: { maxHeight: 400, overflowY: 'auto' as const },
}

function CustomerTimeline({ logs }: CustomerTimelineProps) {
  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-title">Lịch sử hoạt động</div>
      <div style={s.scroll}>
        {logs.map((log) => (
          <div key={log.id} className="timeline-item">
            <div className="timeline-dot"></div>
            <div style={s.action}>{ACTION_LABELS[log.action as ActionType] || log.action}</div>
            {log.template && <div style={s.sub}>Mẫu: {log.template.title}</div>}
            {log.note && <div style={s.sub}>{log.note}</div>}
            <div style={s.time}>{new Date(log.createdAt).toLocaleString('vi-VN')}</div>
          </div>
        ))}
        {logs.length === 0 && <p style={s.empty}>Chưa có lịch sử</p>}
      </div>
    </div>
  )
}

export default memo(CustomerTimeline)
