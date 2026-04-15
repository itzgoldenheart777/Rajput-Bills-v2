import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getDrivers, savePagar } from '../lib/supabase'

const label = { color:'var(--text3)',fontSize:11,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',display:'block',marginBottom:5 }
const APPS = ['Uber','Ola','Rapido','Private']
const EMPTY_VALS = () => Object.fromEntries(APPS.map(a => [a,{E:'',C:'',T:''}]))

function SectionTitle({ children }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:10,margin:'20px 0 14px' }}>
      <div style={{ height:1,flex:1,background:'var(--border)' }}/>
      <span style={{ color:'#4caf7d',fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',fontFamily:'var(--font-mono)' }}>{children}</span>
      <div style={{ height:1,flex:1,background:'var(--border)' }}/>
    </div>
  )
}

export default function PagarCalc() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [drivers,  setDrivers]  = useState([])
  const [driverId, setDriverId] = useState(location.state?.driverId||'')
  const [weekStart,setWeekStart]= useState(()=>{ const d=new Date(); d.setDate(d.getDate()-((d.getDay()+6)%7)); return d.toISOString().slice(0,10) })
  const [vals,    setVals]      = useState(EMPTY_VALS())
  const [cng,     setCng]       = useState('')
  const [fees,    setFees]      = useState('')
  const [prev,    setPrev]      = useState('')
  const [result,  setResult]    = useState(null)
  const [saving,  setSaving]    = useState(false)
  const [saved,   setSaved]     = useState(false)
  const [msg,     setMsg]       = useState('')

  useEffect(()=>{ getDrivers().then(d=>setDrivers(d||[])).catch(()=>{}) },[])

  const onChange = (app, key, val) => { setVals(p => ({ ...p, [app]:{ ...p[app],[key]:val } })); setResult(null); setSaved(false) }
  const n = x => parseFloat(x)||0

  const calculate = () => {
    const earning = APPS.reduce((s,a)=>s+n(vals[a].E),0)
    const cash    = APPS.reduce((s,a)=>s+n(vals[a].C),0)
    const toll    = APPS.reduce((s,a)=>s+n(vals[a].T),0)
    const cngV    = n(cng), feesV = n(fees), prevV = n(prev)
    const base           = earning - cngV - feesV
    const pagar          = base / 2
    const total          = cash - cngV
    const totalAfterPagar= total - pagar
    const payout         = totalAfterPagar - toll
    const finalPayout    = payout + prevV
    setResult({ earning, cash, toll, cng:cngV, fees:feesV, base, pagar, total, totalAfterPagar, payout, prev:prevV, finalPayout })
    setSaved(false)
  }

  const saveRecord = async () => {
    if (!result) return
    if (!driverId) { setMsg('Please select a driver before saving.'); return }
    setSaving(true); setMsg('')
    const driver = drivers.find(d=>d.id===driverId)
    try {
      await savePagar({
        driver_id:driverId, driver_name:driver?.name||'Unknown', week_start:weekStart,
        uber_earning:n(vals.Uber.E),    uber_cash:n(vals.Uber.C),    uber_toll:n(vals.Uber.T),
        ola_earning:n(vals.Ola.E),      ola_cash:n(vals.Ola.C),      ola_toll:n(vals.Ola.T),
        rapido_earning:n(vals.Rapido.E),rapido_cash:n(vals.Rapido.C),rapido_toll:n(vals.Rapido.T),
        private_earning:n(vals.Private.E),private_cash:n(vals.Private.C),private_toll:n(vals.Private.T),
        cng:result.cng, fees:result.fees,
        total_earning:result.earning, total_cash:result.cash, total_toll:result.toll,
        base_profit:result.base, pagar:result.pagar,
        total_after_cng:result.total, after_pagar:result.totalAfterPagar,
        payout:result.payout, prev_balance:result.prev, final_payout:result.finalPayout,
      })
      setSaved(true)
    } catch(e) { setMsg('Save failed: '+e.message) }
    setSaving(false)
  }

  const reset = () => { setVals(EMPTY_VALS()); setCng(''); setFees(''); setPrev(''); setResult(null); setSaved(false); setMsg('') }

  const ResultRow = ({lbl,value,highlight,sep}) => (
    <>
      {sep && <div style={{ height:1,background:'var(--border)',margin:'6px 0' }}/>}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0' }}>
        <span style={{ fontSize:13,color:highlight?'var(--text)':'var(--text2)',fontWeight:highlight?600:400 }}>{lbl}</span>
        <span style={{ fontFamily:'var(--font-mono)',fontSize:highlight?15:13,fontWeight:highlight?700:400,color:highlight?'#4caf7d':'var(--text)' }}>₹{value.toFixed(2)}</span>
      </div>
    </>
  )

  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-head)',fontSize:26,fontWeight:700 }}>Driver <span style={{ color:'#4caf7d' }}>Pagar</span> Calculator</h1>
        <button onClick={()=>navigate('/pagar/records')} style={{ padding:'8px 16px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',fontSize:13,cursor:'pointer',fontWeight:600 }}>📋 Records</button>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 340px',gap:24,alignItems:'start' }}>

        {/* ── LEFT col: inputs ── */}
        <div>
          {/* Driver & Week */}
          <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:20,marginBottom:16 }}>
            <SectionTitle>Driver &amp; Week</SectionTitle>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
              <div>
                <label style={label}>Driver</label>
                <select value={driverId} onChange={e=>setDriverId(e.target.value)}>
                  <option value="">Select driver...</option>
                  {drivers.map(d=><option key={d.id} value={d.id}>{d.name}{d.vehicle_number?` (${d.vehicle_number})`:''}</option>)}
                </select>
                {drivers.length===0 && (
                  <div style={{ fontSize:11,color:'var(--text3)',marginTop:4 }}>
                    No drivers — <button onClick={()=>navigate('/pagar/drivers')} style={{ background:'none',border:'none',color:'#4caf7d',cursor:'pointer',fontSize:11,padding:0 }}>Add drivers →</button>
                  </div>
                )}
              </div>
              <div>
                <label style={label}>Week Starting</label>
                <input type="date" value={weekStart} onChange={e=>setWeekStart(e.target.value)}/>
              </div>
            </div>
          </div>

          {/* App Earnings Table */}
          <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:20,marginBottom:16 }}>
            <SectionTitle>App Earnings</SectionTitle>
            {/* Header */}
            <div style={{ display:'grid',gridTemplateColumns:'90px 1fr 1fr 1fr',gap:8,marginBottom:6 }}>
              <div/>
              {['Earning (₹)','Cash (₹)','Toll (₹)'].map(h=>(
                <div key={h} style={{ fontSize:11,color:'var(--text3)',fontWeight:600,textTransform:'uppercase',letterSpacing:.5,textAlign:'center',paddingBottom:4,borderBottom:'1px solid var(--border)' }}>{h}</div>
              ))}
            </div>
            {/* Rows */}
            {APPS.map(app=>(
              <div key={app} style={{ display:'grid',gridTemplateColumns:'90px 1fr 1fr 1fr',gap:8,alignItems:'center',padding:'7px 0',borderBottom:'1px solid var(--border)' }}>
                <div style={{ fontWeight:600,fontSize:13,color:'var(--text2)' }}>{app}</div>
                {['E','C','T'].map(t=>(
                  <input key={t} type="number" min="0" placeholder="0"
                    value={vals[app][t]}
                    onChange={e=>onChange(app,t,e.target.value)}
                    style={{ textAlign:'right' }}/>
                ))}
              </div>
            ))}
            {/* Totals */}
            <div style={{ display:'grid',gridTemplateColumns:'90px 1fr 1fr 1fr',gap:8,marginTop:8,paddingTop:8,borderTop:'2px solid var(--border)' }}>
              <div style={{ fontSize:11,fontWeight:700,color:'var(--text3)',display:'flex',alignItems:'center' }}>TOTAL</div>
              {[
                APPS.reduce((s,a)=>s+n(vals[a].E),0),
                APPS.reduce((s,a)=>s+n(vals[a].C),0),
                APPS.reduce((s,a)=>s+n(vals[a].T),0),
              ].map((tot,i)=>(
                <div key={i} style={{ fontFamily:'var(--font-mono)',fontSize:14,fontWeight:700,color:'#4caf7d',textAlign:'right',padding:'6px 8px' }}>₹{tot.toFixed(0)}</div>
              ))}
            </div>
          </div>

          {/* Expenses */}
          <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:20,marginBottom:16 }}>
            <SectionTitle>Expenses &amp; Adjustments</SectionTitle>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12 }}>
              <div>
                <label style={label}>CNG (₹)</label>
                <input type="number" min="0" value={cng} onChange={e=>{setCng(e.target.value);setResult(null)}} placeholder="0"/>
              </div>
              <div>
                <label style={label}>App / Uber Fees (₹)</label>
                <input type="number" min="0" value={fees} onChange={e=>{setFees(e.target.value);setResult(null)}} placeholder="0"/>
              </div>
              <div>
                <label style={label}>Previous Balance (₹)</label>
                <input type="number" value={prev} onChange={e=>{setPrev(e.target.value);setResult(null)}} placeholder="+ recv / − owed"/>
              </div>
            </div>
          </div>

          <div style={{ display:'flex',gap:10 }}>
            <button onClick={calculate}
              style={{ flex:1,padding:'13px',background:'#4caf7d',border:'none',borderRadius:10,fontWeight:700,fontSize:15,cursor:'pointer',color:'#0a0a0f' }}>
              🧮 Calculate Pagar
            </button>
            <button onClick={reset}
              style={{ padding:'13px 18px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,color:'var(--text2)',cursor:'pointer',fontWeight:600,fontSize:13 }}>
              Reset
            </button>
          </div>
        </div>

        {/* ── RIGHT col: result ── */}
        <div style={{ position:'sticky',top:20 }}>
          <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:20 }}>
            <div style={{ fontFamily:'var(--font-head)',fontSize:18,fontWeight:700,marginBottom:16,color:'#4caf7d' }}>📊 Pagar Result</div>
            {!result ? (
              <div style={{ textAlign:'center',padding:'40px 0',color:'var(--text3)' }}>
                <div style={{ fontSize:44,marginBottom:10 }}>🧮</div>
                <p style={{ fontSize:13 }}>Fill earnings &amp; click Calculate</p>
              </div>
            ) : (
              <>
                <ResultRow lbl="Total Earning"                 value={result.earning}/>
                <ResultRow lbl="Total Cash"                    value={result.cash}/>
                <ResultRow lbl="Total Toll"                    value={result.toll}/>
                <ResultRow lbl="CNG"                           value={result.cng}/>
                <ResultRow lbl="App / Uber Fees"               value={result.fees}/>
                <ResultRow lbl="Base Profit (Earning−CNG−Fees)" value={result.base}     sep highlight/>
                <ResultRow lbl="Pagar (50% of Base)"           value={result.pagar}    highlight/>
                <ResultRow lbl="Net Cash (Cash−CNG)"           value={result.total}    sep/>
                <ResultRow lbl="After Pagar Deduction"         value={result.totalAfterPagar}/>
                <ResultRow lbl="Payout (After Pagar − Toll)"   value={result.payout}   sep/>
                <ResultRow lbl="Previous Balance"              value={result.prev}/>
                <div style={{ height:1,background:'var(--accent)',margin:'12px 0',opacity:.25 }}/>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0' }}>
                  <span style={{ fontFamily:'var(--font-head)',fontSize:16,fontWeight:700 }}>Final Payout</span>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:26,fontWeight:700,color:result.finalPayout>=0?'#4caf7d':'#e74c3c' }}>
                    ₹{result.finalPayout.toFixed(2)}
                  </span>
                </div>
                {result.finalPayout<0 && (
                  <div style={{ padding:'8px 12px',background:'#e74c3c18',border:'1px solid #e74c3c40',borderRadius:8,fontSize:12,color:'#e74c3c',marginBottom:8 }}>
                    ⚠ Driver owes ₹{Math.abs(result.finalPayout).toFixed(2)}
                  </div>
                )}
                {msg && <div style={{ padding:'8px 12px',background:'#e74c3c18',border:'1px solid #e74c3c40',borderRadius:8,fontSize:12,color:'#e74c3c',marginTop:8 }}>{msg}</div>}
                {saved && <div style={{ padding:'8px 12px',background:'#2ecc7118',border:'1px solid #2ecc7140',borderRadius:8,fontSize:12,color:'#2ecc71',marginTop:8 }}>✅ Saved to database!</div>}
                <button onClick={saveRecord} disabled={saving||saved}
                  style={{ width:'100%',marginTop:12,padding:'11px',background:saved?'var(--surface2)':'#4caf7d',border:saved?'1px solid var(--border)':'none',borderRadius:9,fontWeight:700,cursor:saved?'default':'pointer',color:saved?'var(--text3)':'#0a0a0f',fontSize:13 }}>
                  {saving?'Saving...' : saved?'✅ Saved to Database':'💾 Save to Database'}
                </button>
              </>
            )}
          </div>

          {/* Formula reference */}
          <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:16,marginTop:12 }}>
            <div style={{ fontSize:11,fontWeight:700,color:'var(--text3)',marginBottom:8,textTransform:'uppercase',letterSpacing:.5 }}>Formula Reference</div>
            {[
              ['Base Profit','Earning − CNG − Fees'],
              ['Pagar','Base ÷ 2 (50%)'],
              ['Net Cash','Cash − CNG'],
              ['After Pagar','Net Cash − Pagar'],
              ['Payout','After Pagar − Toll'],
              ['Final','Payout + Prev Balance'],
            ].map(([k,f])=>(
              <div key={k} style={{ display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid var(--border)',fontSize:12 }}>
                <span style={{ color:'var(--text3)' }}>{k}</span>
                <span style={{ fontFamily:'var(--font-mono)',color:'#4caf7d',fontSize:11 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile responsive result at bottom */}
      <style>{`@media(max-width:900px){.pagar-grid{grid-template-columns:1fr!important}.pagar-sticky{position:static!important}}`}</style>
    </div>
  )
}
