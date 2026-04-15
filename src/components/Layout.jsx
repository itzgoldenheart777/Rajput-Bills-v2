import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const APPS = [
  {
    key: 'bills', label: 'Bill Generator', icon: '🧾', color: '#c8993a',
    nav: [
      { label: 'New Bill',      path: '/',             icon: '✦' },
      { label: 'All Bills',     path: '/bills',        icon: '☰' },
      { label: 'Brand Assets',  path: '/brand-assets', icon: '🖼' },
    ]
  },
  {
    key: 'tax', label: 'Road Tax', icon: '🚘', color: '#f5a623',
    nav: [
      { label: 'Dashboard', path: '/tax',          icon: '📊' },
      { label: 'Vehicles',  path: '/tax/vehicles', icon: '🚙' },
      { label: 'Payments',  path: '/tax/payments', icon: '💳' },
      { label: 'Automate',  path: '/tax/automate', icon: '⚡' },
    ]
  },
  {
    key: 'pagar', label: 'Driver Pagar', icon: '💰', color: '#4caf7d',
    nav: [
      { label: 'Calculate', path: '/pagar',          icon: '🧮' },
      { label: 'Records',   path: '/pagar/records',  icon: '📋' },
      { label: 'Drivers',   path: '/pagar/drivers',  icon: '🧑‍✈️' },
    ]
  }
]

function getActiveApp(pathname) {
  if (pathname.startsWith('/tax')) return 'tax'
  if (pathname.startsWith('/pagar')) return 'pagar'
  return 'bills'
}

export default function Layout({ children }) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const activeApp  = getActiveApp(location.pathname)
  const appDef     = APPS.find(a => a.key === activeApp)
  const navItems   = appDef.nav
  const accent     = appDef.color

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const MiniAppTabs = ({ vertical }) => (
    <>
      {APPS.map(app => {
        const isActive = activeApp === app.key
        return (
          <button key={app.key}
            onClick={() => navigate(app.nav[0].path)}
            style={{
              flex: vertical ? 'unset' : 1,
              display: 'flex', flexDirection: vertical ? 'row' : 'column',
              alignItems: 'center', justifyContent: vertical ? 'flex-start' : 'center',
              gap: vertical ? 10 : 3,
              padding: vertical ? '9px 12px' : '6px 4px',
              border: 'none', borderRadius: 8,
              background: isActive ? `${app.color}20` : 'transparent',
              color: isActive ? app.color : 'var(--text3)',
              fontSize: vertical ? 13 : 10,
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.15s',
              borderLeft: vertical && isActive ? `3px solid ${app.color}` : vertical ? '3px solid transparent' : 'none',
            }}>
            <span style={{ fontSize: vertical ? 16 : 20 }}>{app.icon}</span>
            {app.label}
          </button>
        )
      })}
    </>
  )

  if (isMobile) {
    return (
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', paddingBottom:120 }}>
        <div style={{ background:'var(--surface)', padding:'12px 14px', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:28,height:28,background:accent,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14 }}>{appDef.icon}</div>
            <div style={{ fontFamily:'var(--font-head)',fontSize:14,fontWeight:700 }}>
              Rajput Tour <span style={{ color:accent }}>&amp; Travels</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:6 }}><MiniAppTabs vertical={false}/></div>
        </div>
        <main style={{ flex:1, padding:'16px 14px', overflowX:'hidden' }}>{children}</main>
        <nav style={{ position:'fixed',bottom:0,left:0,right:0,background:'var(--surface2)',borderTop:'1px solid var(--border)',display:'flex',zIndex:100 }}>
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,padding:'10px 4px',background:'transparent',border:'none',color:active?accent:'var(--text3)',cursor:'pointer' }}>
                <span style={{ fontSize:18 }}>{item.icon}</span>
                <span style={{ fontSize:9, fontWeight:active?700:500 }}>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <aside style={{ width:220,background:'var(--surface)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',padding:'28px 0',position:'fixed',top:0,left:0,bottom:0,zIndex:100 }}>
        <div style={{ padding:'0 22px 18px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ width:38,height:38,background:accent,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:10 }}>{appDef.icon}</div>
          <div style={{ fontFamily:'var(--font-head)',fontSize:14,fontWeight:700,lineHeight:1.3 }}>
            Rajput Tour<br/><span style={{ color:accent }}>&amp; Travels</span>
          </div>
          <div style={{ color:'var(--text3)',fontSize:10,marginTop:3,fontFamily:'var(--font-mono)',textTransform:'uppercase',letterSpacing:1 }}>{appDef.label}</div>
        </div>

        <div style={{ padding:'12px 10px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ color:'var(--text3)',fontSize:10,textTransform:'uppercase',letterSpacing:1,padding:'0 4px',marginBottom:6 }}>Switch App</div>
          <div style={{ display:'flex',flexDirection:'column',gap:2 }}><MiniAppTabs vertical={true}/></div>
        </div>

        <nav style={{ padding:'14px 10px', flex:1 }}>
          <div style={{ color:'var(--text3)',fontSize:10,textTransform:'uppercase',letterSpacing:1,padding:'0 4px',marginBottom:8 }}>Pages</div>
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ display:'flex',alignItems:'center',gap:10,width:'100%',padding:'10px 14px',border:'none',borderRadius:8,background:active?`${accent}18`:'transparent',color:active?accent:'var(--text2)',fontSize:13,fontWeight:active?600:400,cursor:'pointer',marginBottom:2,transition:'all 0.15s',textAlign:'left' }}>
                <span style={{ fontSize:15 }}>{item.icon}</span>{item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding:'0 22px',borderTop:'1px solid var(--border)',paddingTop:14 }}>
          <div style={{ color:'var(--text3)',fontSize:11,lineHeight:1.8 }}>PAN: CBHPS4753G<br/>Mob: 7304315584</div>
        </div>
      </aside>
      <main style={{ marginLeft:220,flex:1,padding:'40px 48px',minHeight:'100vh',maxWidth:'calc(100vw - 220px)' }}>{children}</main>
    </div>
  )
}
