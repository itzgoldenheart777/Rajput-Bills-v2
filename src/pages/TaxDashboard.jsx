import React, { useEffect, useState } from 'react'
import { getVehicles } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function ExpiryBadge({ days }) {
  if (days === null || days === undefined) return <span style={badge('gray')}>No Data</span>
  if (days < 0)   return <span style={badge('red')}>EXPIRED {Math.abs(days)}d ago</span>
  if (days <= 7)  return <span style={badge('red')}>⚠ {days}d left</span>
  if (days <= 30) return <span style={badge('yellow')}>🕐 {days}d left</span>
  return <span style={badge('green')}>✓ {days}d left</span>
}
function badge(c) {
  const map = { red:'#e74c3c',yellow:'#f39c12',green:'#2ecc71',gray:'#55556a' }
  return { display:'inline-block',padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:`${map[c]}22`,color:map[c] }
}
function ExpiryBar({ days }) {
  const pct   = days === null ? 0 : Math.min(100, Math.max(0,(days/30)*100))
  const color = days < 0 ? '#e74c3c' : days <= 7 ? '#e74c3c' : days <= 30 ? '#f39c12' : '#2ecc71'
  return (
    <div style={{ marginTop:4, height:3, background:'#2a2a35', borderRadius:2, overflow:'hidden' }}>
      <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:2 }} />
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:'18px 20px',borderTop:`3px solid ${color}` }}>
      <div style={{ fontSize:11,textTransform:'uppercase',letterSpacing:1,color:'var(--text3)',marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:34,fontWeight:700,fontFamily:'var(--font-head)',color }}>{value}</div>
    </div>
  )
}

export default function TaxDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading,  setLoading]  = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getVehicles().then(v => { setVehicles(v||[]); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  const expired  = vehicles.filter(v => v.days_until_expiry < 0).length
  const critical = vehicles.filter(v => v.days_until_expiry >= 0 && v.days_until_expiry <= 7).length
  const warning  = vehicles.filter(v => v.days_until_expiry > 7  && v.days_until_expiry <= 30).length
  const good     = vehicles.filter(v => v.days_until_expiry > 30).length
  const sorted   = [...vehicles].sort((a,b) => (a.days_until_expiry??9999)-(b.days_until_expiry??9999))

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'

  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-head)',fontSize:26,fontWeight:700 }}>Road Tax <span style={{ color:'#f5a623' }}>Dashboard</span></h1>
        <button onClick={() => navigate('/tax/vehicles')}
          style={{ padding:'9px 18px',background:'#f5a623',border:'none',borderRadius:8,fontWeight:700,fontSize:13,cursor:'pointer',color:'#0a0a0f' }}>
          + Add Vehicle
        </button>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:28 }}>
        <StatCard label="Expired"         value={expired}  color="#e74c3c" />
        <StatCard label="Critical ≤7d"    value={critical} color="#e74c3c" />
        <StatCard label="Due Soon ≤30d"   value={warning}  color="#f39c12" />
        <StatCard label="All Clear"       value={good}     color="#2ecc71" />
      </div>

      {(expired > 0 || critical > 0) && (
        <div style={{ padding:'12px 16px',background:'#e74c3c18',border:'1px solid #e74c3c40',borderRadius:8,color:'#e74c3c',fontSize:13,marginBottom:20 }}>
          ⚠ {expired+critical} vehicle(s) have expired or critically expiring road tax!
        </div>
      )}

      <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:20 }}>
        <div style={{ fontWeight:700,fontSize:15,marginBottom:16 }}>All Vehicles — Expiry Status</div>
        {loading ? <p style={{ color:'var(--text3)' }}>Loading...</p> :
          vehicles.length === 0 ? (
            <div style={{ textAlign:'center',padding:'50px 0',color:'var(--text3)' }}>
              <div style={{ fontSize:48,marginBottom:12 }}>🚘</div>
              <p>No vehicles yet.</p>
              <button onClick={() => navigate('/tax/vehicles')} style={{ marginTop:12,padding:'9px 18px',background:'#f5a623',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',color:'#0a0a0f',fontSize:13 }}>
                Add Vehicle
              </button>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
                <thead>
                  <tr>{['Vehicle No.','Owner','Last Period','Tax Ends','Status','Actions'].map(h=>(
                    <th key={h} style={{ textAlign:'left',padding:'9px 12px',color:'var(--text3)',fontSize:11,textTransform:'uppercase',letterSpacing:.8,borderBottom:'1px solid var(--border)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {sorted.map(v => (
                    <tr key={v.id}>
                      <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}>
                        <span style={{ fontFamily:'var(--font-mono)',color:'#f5a623',fontWeight:500 }}>{v.vehicle_number?.toUpperCase()}</span>
                        <div style={{ fontSize:11,color:'var(--text3)',marginTop:2 }}>{v.vehicle_type}</div>
                      </td>
                      <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}>{v.owner_name||'—'}</td>
                      <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}>{v.last_period||'—'}</td>
                      <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}>
                        {v.last_tax_end ? <>{fmtDate(v.last_tax_end)}<ExpiryBar days={v.days_until_expiry}/></> : '—'}
                      </td>
                      <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}><ExpiryBadge days={v.days_until_expiry}/></td>
                      <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}>
                        <div style={{ display:'flex',gap:6 }}>
                          <button onClick={() => navigate('/tax/payments',{state:{vehicleId:v.id,vehicleNumber:v.vehicle_number}})}
                            style={{ padding:'5px 10px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:6,color:'var(--text2)',fontSize:11,cursor:'pointer' }}>🧾 History</button>
                          <button onClick={() => navigate('/tax/automate',{state:{vehicle:v}})}
                            style={{ padding:'5px 10px',background:'#f5a623',border:'none',borderRadius:6,color:'#0a0a0f',fontSize:11,fontWeight:700,cursor:'pointer' }}>⚡ Pay</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  )
}
