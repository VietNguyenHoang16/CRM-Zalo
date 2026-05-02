import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <div style={{ maxWidth: 480, margin: '80px auto 0' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 24px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" width="40" height="40">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>Không tìm thấy trang</h1>
        <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
