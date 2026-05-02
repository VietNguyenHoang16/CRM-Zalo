export default function Loading() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 32 }}>
        <div className="skeleton" style={{ width: 200, height: 32, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 300, height: 16 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card" style={{ padding: 24 }}>
            <div className="skeleton" style={{ width: '60%', height: 24 }} />
            <div className="skeleton" style={{ width: '40%', height: 16, marginTop: 8 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        <div className="card" style={{ height: 200 }}>
          <div className="skeleton" style={{ width: '50%', height: 20 }} />
        </div>
        <div className="card" style={{ height: 200 }}>
          <div className="skeleton" style={{ width: '50%', height: 20 }} />
        </div>
      </div>
    </div>
  )
}
