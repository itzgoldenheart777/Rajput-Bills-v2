import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV = [
  { label: 'New Bill', path: '/', icon: '✦' },
  { label: 'All Bills', path: '/bills', icon: '☰' },
  { label: 'Brand Assets', path: '/brand-assets', icon: '🖼' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: 70 }}>
        {/* Top Header Mobile */}
        <div style={{ background: 'var(--surface)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🚗</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
            Rajput Tour <span style={{ color: 'var(--accent)' }}>&amp; Travels</span>
          </div>
        </div>

        {/* Mobile Main */}
        <main style={{ flex: 1, padding: '20px 14px', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
          {children}
        </main>

        {/* Bottom Nav Mobile */}
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 65, background: 'var(--surface2)', borderTop: '1px solid var(--border)', display: 'flex', zIndex: 100, paddingBottom: window.navigator.standalone ? 20 : 0 }}>
          {NAV.map(item => {
            const active = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                  background: 'transparent', border: 'none',
                  color: active ? 'var(--accent2)' : 'var(--text3)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: 20 }}>{item.icon}</div>
                <div style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{item.label}</div>
              </button>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Desktop */}
      <aside style={{
        width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '32px 0',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        {/* Logo area */}
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 40, height: 40, background: 'var(--accent)', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, marginBottom: 12,
          }}>🚗</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
            Rajput Tour<br/><span style={{ color: 'var(--accent)' }}>&amp; Travels</span>
          </div>
          <div style={{ color: 'var(--text3)', fontSize: 11, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            BILL MANAGER
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ padding: '20px 12px', flex: 1 }}>
          {NAV.map(item => {
            const active = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '11px 16px', border: 'none', borderRadius: 10,
                  background: active ? 'rgba(200,153,58,0.12)' : 'transparent',
                  color: active ? 'var(--accent2)' : 'var(--text2)',
                  fontSize: 14, fontWeight: active ? 600 : 400, cursor: 'pointer',
                  marginBottom: 4, transition: 'all 0.15s', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0 24px', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div style={{ color: 'var(--text3)', fontSize: 11, lineHeight: 1.8 }}>
            PAN: CBHPS4753G<br />Mob: 7304315584
          </div>
        </div>
      </aside>

      {/* Main content Desktop */}
      <main style={{ marginLeft: 220, flex: 1, padding: '40px 48px', minHeight: '100vh', maxWidth: 'calc(100vw - 220px)' }}>
        {children}
      </main>
    </div>
  )
}
