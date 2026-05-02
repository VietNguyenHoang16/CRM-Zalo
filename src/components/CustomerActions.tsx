import { memo } from 'react'

interface CustomerActionsProps {
  status: string
  onAction: (action: string, note?: string, templateId?: string) => void
  showIcons?: boolean
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  zaloText: { background: '#fef3c7', color: '#b45309' },
  accept: { background: '#dbeafe', color: '#1d4ed8' },
  callMade: { background: '#dcfce7', color: '#15803d' },
  callMissed: { background: '#ffedd5', color: '#c2410c' },
  msgSent: { background: '#f3e8ff', color: '#7c3aed' },
}

function CustomerActions({ status, onAction, showIcons = false }: CustomerActionsProps) {
  return (
    <div className="card">
      <div className="card-title">Hành động</div>
      <div style={s.wrap}>
        {status === 'NEW' && (
          <button onClick={() => onAction('ZALO_SENT')} className="btn" style={s.zaloText}>
            {showIcons && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3v12" />
              </svg>
            )}
            Đã gửi KB Zalo
          </button>
        )}
        {status === 'PENDING_ZALO' && (
          <button onClick={() => onAction('ZALO_ACCEPTED')} className="btn" style={s.accept}>
            {showIcons && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            )}
            Đã kết bạn
          </button>
        )}
        <button onClick={() => onAction('CALL_MADE')} className="btn" style={s.callMade}>
          {showIcons && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          )}
          Đã gọi
        </button>
        <button onClick={() => onAction('CALL_MISSED')} className="btn" style={s.callMissed}>
          {showIcons && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.440-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          )}
          Gọi không được
        </button>
        <button onClick={() => onAction('MESSAGE_SENT')} className="btn" style={s.msgSent}>
          {showIcons && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          )}
          Đã nhắn tin
        </button>
      </div>
    </div>
  )
}

export default memo(CustomerActions)
