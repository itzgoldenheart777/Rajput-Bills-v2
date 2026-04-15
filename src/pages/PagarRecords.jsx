import React, { useEffect, useState } from 'react'
import { getAllPagar, deletePagar, getDrivers } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—' }
function fmtCur(v)  { return `₹${Number(v||0).toFixed(2)}` }

export default function PagarRecords() {
  const navigate = useNavigate()
  const [records,  setRecords]  = useState([])
  const [drivers,  setDrivers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('')
  const [expanded, setExpanded] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = () => {
    Promise.all([getAllPagar(), getDrivers()]).then(([r,d])=>{
      setRecords(r||[]); setDrivers(d||[]); setLoading(false)
    }).catch(()=>setLoading(false))
  }
  useEffect(()=>{ load() },[])

  const handleDelete = async (id,e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this pagar record?')) return
    setDeleting(id)
    try { await deletePagar(id); setRecords(r=>r.filter(x=>x.id!==id)) }
    catch(e){ alert('Delete failed: '+e.message) }
    setDeleting(null)
  }

  const filtered = filter ? records.filter(r=>r.driver_id===filter) : records

  // Summary stats
  const totalPagar   = filtered.reduce((s,r)=>s+Number(r.pagar||0),0)
  const totalEarning = filtered.reduce((s,r)=>s+Number(r.total_earning||0),0)
  const totalFinal   = filtered.reduce((s,r)=>s+Number(r.final_payout||0),0)

  const th = { textAlign:'left',padding:'9px 12px',color:'var(--text3)',fontSize:11,textTransform:'uppercase',letterSpacing:.8,borderBottom:'1px solid var(--border)',whiteSpace:'nowrap' }
  const td = { padding:'12px',borderBottom:'1px solid var(--border)',fontSize:13 }

  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-head)',fontSize:26,fontWeight:700 }}>Pagar <span style={{ color:'#4caf7d' }}>Records</span></h1>
        <button onClick={()=>navigate('/pagar')} style={{ padding:'9px 18px',background:'#4caf7d',border:'none',borderRadius:8,fontWeight:700,fontSize:13,cursor:'pointer',color:'#0a0a0f' }}>+ New Calculation</button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:14,marginBottom:20 }}>
        {[
          { label:'Total Records', value:filtered.length, mono:true },
          { label:'Total Earning', value:fmtCur(totalEarning), color:'#f5a623' },
          { label:'Total Pagar Paid', value:fmtCur(totalPagar), color:'#4caf7d' },
          { label:'Total Payout', value:fmtCur(totalFinal), color:totalFinal>=0?'#4caf7d':'#e74c3c' },
        ].map(s=>(
          <div key={s.label} style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:'16px 18px' }}>
            <div style={{ fontSize:11,textTransform:'uppercase',letterSpacing:1,color:'var(--text3)',marginBottom:5 }}>{s.label}</div>
            <div style={{ fontFamily:'var(--font-mono)',fontSize:22,fontWeight:700,color:s.color||'var(--text)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:14,marginBottom:16,display:'flex',gap:12,alignItems:'center' }}>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ maxWidth:260 }}>
          <option value="">All Drivers</option>
          {drivers.map(d=><option key={d.id} value={d.id}>{d.name} {d.vehicle_number?`(${d.vehicle_number})`:''}</option>)}
        </select>
        <span style={{ fontSize:13,color:'var(--text3)' }}>{filtered.length} record{filtered.length!==1?'s':''}</span>
      </div>

      {loading ? <p style={{ color:'var(--text3)' }}>Loading...</p> : (
        <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center',padding:'50px 0',color:'var(--text3)' }}>
              <div style={{ fontSize:48,marginBottom:12 }}>💰</div>
              <p>No pagar records yet.</p>
              <button onClick={()=>navigate('/pagar')} style={{ marginTop:12,padding:'9px 18px',background:'#4caf7d',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',color:'#0a0a0f',fontSize:13 }}>Calculate First Pagar</button>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%',borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['Driver','Week','Earning','Cash','Toll','CNG','Pagar (50%)','Prev Bal','Final Payout',''].map(h=><th key={h} style={th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <React.Fragment key={r.id}>
                      <tr onClick={()=>setExpanded(expanded===r.id?null:r.id)} style={{ cursor:'pointer' }}>
                        <td style={td}><strong>{r.driver_name}</strong></td>
                        <td style={td}>{fmtDate(r.week_start)}</td>
                        <td style={{ ...td,color:'#f5a623',fontFamily:'var(--font-mono)' }}>{fmtCur(r.total_earning)}</td>
                        <td style={{ ...td,fontFamily:'var(--font-mono)' }}>{fmtCur(r.total_cash)}</td>
                        <td style={{ ...td,fontFamily:'var(--font-mono)' }}>{fmtCur(r.total_toll)}</td>
                        <td style={{ ...td,color:'#e74c3c',fontFamily:'var(--font-mono)' }}>{fmtCur(r.cng)}</td>
                        <td style={{ ...td,color:'#4caf7d',fontFamily:'var(--font-mono)',fontWeight:700 }}>{fmtCur(r.pagar)}</td>
                        <td style={{ ...td,fontFamily:'var(--font-mono)' }}>{fmtCur(r.prev_balance)}</td>
                        <td style={{ ...td,fontFamily:'var(--font-mono)',fontWeight:700,fontSize:15,color:Number(r.final_payout)>=0?'#4caf7d':'#e74c3c' }}>{fmtCur(r.final_payout)}</td>
                        <td style={td}>
                          <button onClick={e=>handleDelete(r.id,e)} disabled={deleting===r.id}
                            style={{ padding:'5px 10px',background:'#e74c3c18',border:'1px solid #e74c3c40',borderRadius:6,color:'#e74c3c',cursor:'pointer',fontSize:11,fontWeight:600 }}>
                            {deleting===r.id?'...':'🗑'}
                          </button>
                        </td>
                      </tr>
                      {/* Expanded detail row */}
                      {expanded===r.id && (
                        <tr>
                          <td colSpan={10} style={{ padding:0,borderBottom:'1px solid var(--border)' }}>
                            <div style={{ background:'var(--surface2)',padding:16 }}>
                              <div style={{ fontSize:12,fontWeight:700,color:'var(--text3)',textTransform:'uppercase',letterSpacing:.5,marginBottom:10 }}>Weekly Breakdown by App</div>
                              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10 }}>
                                {['Uber','Ola','Rapido','Private'].map(app=>{
                                  const appL = app.toLowerCase()
                                  return (
                                    <div key={app} style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,padding:12 }}>
                                      <div style={{ fontWeight:700,fontSize:13,marginBottom:8,color:'var(--text2)' }}>{app}</div>
                                      {[['Earning',`${appL}_earning`],['Cash',`${appL}_cash`],['Toll',`${appL}_toll`]].map(([lbl,key])=>(
                                        <div key={key} style={{ display:'flex',justifyContent:'space-between',fontSize:12,padding:'3px 0' }}>
                                          <span style={{ color:'var(--text3)' }}>{lbl}</span>
                                          <span style={{ fontFamily:'var(--font-mono)' }}>{fmtCur(r[key])}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )
                                })}
                              </div>
                              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10,marginTop:10 }}>
                                {[['Base Profit','base_profit'],['Pagar (50%)','pagar'],['Net Cash (Cash−CNG)','total_after_cng'],['After Pagar','after_pagar'],['Payout','payout']].map(([lbl,key])=>(
                                  <div key={key} style={{ display:'flex',justifyContent:'space-between',padding:'6px 12px',background:'var(--surface)',borderRadius:8,fontSize:12 }}>
                                    <span style={{ color:'var(--text3)' }}>{lbl}</span>
                                    <span style={{ fontFamily:'var(--font-mono)',fontWeight:600 }}>{fmtCur(r[key])}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
