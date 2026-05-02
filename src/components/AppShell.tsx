'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="mobile-header">
        <button className="hamburger" type="button" onClick={() => setSidebarOpen(true)} aria-label="Mở menu" style={{ zIndex: 100 }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24" style={{ pointerEvents: 'none' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div className="mobile-header-title">CRM Zalo</div>
      </div>

      <main className="main-content">
        {children}
      </main>

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  )
}
