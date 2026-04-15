import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getVehicles, addPayment, uploadReceipt, formatReceiptFilename } from '../lib/supabase'

function periodEnd(start, type) {
  const d = new Date(start)
  if (type==='MONTHLY')     { d.setMonth(d.getMonth()+1);      d.setDate(d.getDate()-1) }
  else if (type==='QUARTERLY')   { d.setMonth(d.getMonth()+3);      d.setDate(d.getDate()-1) }
  else if (type==='HALF_YEARLY') { d.setMonth(d.getMonth()+6);      d.setDate(d.getDate()-1) }
  else                           { d.setFullYear(d.getFullYear()+1); d.setDate(d.getDate()-1) }
  return d.toISOString().slice(0,10)
}
function periodLabel(start, type) {
  const d = new Date(start)
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  if (type==='MONTHLY')     return `${M[d.getMonth()]} ${d.getFullYear()}`
  if (type==='QUARTERLY')   return `Q${Math.ceil((d.getMonth()+1)/3)} ${d.getFullYear()}`
  if (type==='HALF_YEARLY') return `H${d.getMonth()<6?1:2} ${d.getFullYear()}`
  return `FY ${d.getFullYear()}`
}

const label = { color:'var(--text3)',fontSize:11,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',display:'block',marginBottom:5 }

const STEPS = (v, taxType, receiptName) => [
  { title:'Open VAHAN Portal', desc:'Click to open VAHAN in a new tab. Close any mobile number popup.', action:<a href="https://vahan.parivahan.gov.in/vahanservice/vahan/ui/statevalidation/homepage.xhtml" target="_blank" rel="noreferrer" style={{ display:'inline-block',marginTop:8,padding:'8px 16px',background:'#f5a623',border:'none',borderRadius:8,fontWeight:700,fontSize:13,color:'#0a0a0f',textDecoration:'none' }}>🌐 Open VAHAN</a> },
  { title:'Enter Vehicle Number', desc:'Type this in the search box on VAHAN:', action:<div style={{ fontFamily:'var(--font-mono)',background:'#0a0a0f',border:'1px solid var(--border)',borderRadius:8,padding:'10px 14px',fontSize:16,color:'#f5a623',letterSpacing:2,marginTop:8 }}>{v.vehicle_number.toUpperCase()}</div> },
  { title:'Solve CAPTCHA & Click Proceed', desc:'Tick the CAPTCHA checkbox, then click Proceed button.' },
  { title:'Select "Pay Your Tax"', desc:'On the services page, click Pay Your Tax. Login with OTP if prompted.' },
  { title:'Enter Chassis Number', desc:'Enter the last 5 digits of the chassis number:', action:<div style={{ fontFamily:'var(--font-mono)',background:'#0a0a0f',border:'1px solid var(--border)',borderRadius:8,padding:'10px 14px',fontSize:28,color:'#f5a623',letterSpacing:6,marginTop:8,textAlign:'center' }}>{v.chassis_last5}</div> },
  { title:'Verify Details & Enter OTP', desc:`Click Verify Details. OTP will be sent to mobile ${v.mobile_number||'linked to vehicle'}. Enter it and click Submit.` },
  { title:`Select "${taxType}" Tax Type`, desc:'Choose the tax type from the dropdown on the tax page.' },
  { title:'Click Payment → Confirm Payment', desc:'Click Payment button, review the amount, then Confirm Payment.' },
  { title:'Pay via UPI QR', desc:'On SBI ePay: Select UPI → UPI QR → Click Pay Now. Scan the QR with GPay / PhonePe and complete payment.', action:<div style={{ padding:'10px 14px',background:'#f39c1218',border:'1px solid #f39c1240',borderRadius:8,fontSize:12,color:'#f39c12',marginTop:8 }}>⚠ After scanning, complete payment in your UPI app, then come back here.</div> },
  { title:'Download Receipt from VAHAN', desc:'After payment success, VAHAN shows a receipt. Download the PDF.', action:<div style={{ padding:'10px 14px',background:'#2ecc7118',border:'1px solid #2ecc7140',borderRadius:8,fontSize:12,color:'#2ecc71',marginTop:8 }}>💡 Save receipt as: <strong>{receiptName}</strong></div> },
]

export default function TaxAutomate() {
  const location = useLocation()
  const [vehicles,setVehicles] = useState([])
  const [selected,setSelected] = useState(location.state?.vehicle||null)
  const [taxType, setTaxType]  = useState('MONTHLY')
  const [periodStart,setPeriodStart] = useState(new Date().toISOString().slice(0,10))
  const [step,    setStep]     = useState(0)
  const [receipt, setReceipt]  = useState(null)
  const [amount,  setAmount]   = useState('')
  const [txnId,   setTxnId]    = useState('')
  const [saving,  setSaving]   = useState(false)
  const [saved,   setSaved]    = useState(false)

  useEffect(()=>{ getVehicles().then(v=>setVehicles(v||[])) },[])

  const pEnd       = selected ? periodEnd(periodStart, taxType) : ''
  const rcptName   = selected ? formatReceiptFilename(selected.vehicle_number, periodStart, pEnd) : ''
  const steps      = selected ? STEPS(selected, taxType, rcptName) : []

  const saveRecord = async () => {
    if (!selected||!receipt) return
    setSaving(true)
    try {
      const ext = receipt.name.split('.').pop()
      const { publicUrl } = await uploadReceipt(receipt, `${rcptName}.${ext}`)
      await addPayment({ vehicle_id:selected.id, vehicle_number:selected.vehicle_number, period_start:periodStart, period_end:pEnd, period_label:periodLabel(periodStart,taxType), tax_type:taxType, amount:amount?parseFloat(amount):null, status:'PAID', receipt_filename:rcptName, receipt_url:publicUrl, transaction_id:txnId||null, payment_date:new Date().toISOString() })
      setSaved(true); setStep(0)
    } catch(e) { alert('Error: '+e.message) }
    setSaving(false)
  }

  const Card = ({children,style={}}) => <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:20,...style }}>{children}</div>

  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-head)',fontSize:26,fontWeight:700 }}>⚡ Pay Road <span style={{ color:'#f5a623' }}>Tax</span></h1>
      </div>

      {saved && (
        <div style={{ padding:'12px 16px',background:'#2ecc7118',border:'1px solid #2ecc7140',borderRadius:8,color:'#2ecc71',fontSize:13,marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          ✅ Payment saved! Receipt: <strong>{rcptName}</strong>
          <button onClick={()=>setSaved(false)} style={{ background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:6,padding:'4px 10px',color:'var(--text2)',cursor:'pointer',fontSize:11 }}>✕</button>
        </div>
      )}

      <Card style={{ marginBottom:20 }}>
        <div style={{ fontWeight:700,fontSize:15,marginBottom:16 }}>1. Select Vehicle &amp; Period</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12 }}>
          <div><label style={label}>Vehicle</label>
            <select value={selected?.id||''} onChange={e=>setSelected(vehicles.find(v=>v.id===e.target.value)||null)}>
              <option value="">Select...</option>
              {vehicles.map(v=><option key={v.id} value={v.id}>{v.vehicle_number}</option>)}
            </select>
          </div>
          <div><label style={label}>Tax Type</label>
            <select value={taxType} onChange={e=>setTaxType(e.target.value)}>
              {['MONTHLY','QUARTERLY','HALF_YEARLY','ANNUAL'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={label}>Period Start</label><input type="date" value={periodStart} onChange={e=>setPeriodStart(e.target.value)}/></div>
        </div>
        {selected && (
          <div style={{ marginTop:14,padding:14,background:'var(--surface2)',borderRadius:8,display:'flex',gap:20,flexWrap:'wrap',fontSize:13 }}>
            <div><div style={{ fontSize:11,color:'var(--text3)',marginBottom:2 }}>VEHICLE</div><div style={{ fontFamily:'var(--font-mono)',color:'#f5a623' }}>{selected.vehicle_number}</div></div>
            <div><div style={{ fontSize:11,color:'var(--text3)',marginBottom:2 }}>CHASSIS</div><div style={{ fontFamily:'var(--font-mono)' }}>{selected.chassis_last5}</div></div>
            <div><div style={{ fontSize:11,color:'var(--text3)',marginBottom:2 }}>PERIOD</div><div>{periodStart} → {pEnd}</div></div>
            <div><div style={{ fontSize:11,color:'var(--text3)',marginBottom:2 }}>RECEIPT NAME</div><div style={{ color:'#2ecc71',fontSize:12 }}>{rcptName}</div></div>
          </div>
        )}
      </Card>

      {selected ? (
        <Card>
          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:16 }}>
            <div style={{ fontWeight:700,fontSize:15 }}>2. Follow Steps on VAHAN</div>
            <div style={{ fontSize:12,color:'var(--text3)' }}>Step {step+1} / {steps.length}</div>
          </div>
          <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
            {steps.map((s,i)=>{
              const done   = i < step
              const active = i === step
              const stepColor = done?'#2ecc71':active?'#f5a623':'var(--text3)'
              return (
                <div key={i} onClick={()=>setStep(i)} style={{ display:'flex',gap:14,padding:14,background:active?'var(--surface2)':'transparent',borderRadius:10,border:`1px solid ${active?'var(--border)':'transparent'}`,opacity:i>step?0.35:1,cursor:'pointer',transition:'all 0.15s' }}>
                  <div style={{ width:28,height:28,borderRadius:'50%',background:done?'#2ecc71':active?'#f5a623':'var(--surface2)',color:done||active?'#0a0a0f':'var(--text3)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,flexShrink:0 }}>{done?'✓':i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,fontSize:14,color:stepColor,marginBottom:3 }}>{s.title}</div>
                    <div style={{ fontSize:12,color:'var(--text2)',lineHeight:1.5 }}>{s.desc}</div>
                    {active && s.action && <div style={{ marginTop:10 }}>{s.action}</div>}
                    {/* Step 10 — Upload receipt */}
                    {active && i === steps.length-1 && (
                      <div style={{ marginTop:14 }}>
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12 }}>
                          <div><label style={label}>Amount Paid (₹)</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="e.g. 450"/></div>
                          <div><label style={label}>Transaction ID</label><input value={txnId} onChange={e=>setTxnId(e.target.value)} placeholder="UPI ref" style={{ fontFamily:'var(--font-mono)' }}/></div>
                        </div>
                        <div style={{ marginBottom:12 }}>
                          <label style={label}>Upload Receipt (PDF / Image)</label>
                          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e=>setReceipt(e.target.files[0])}/>
                          {receipt && <div style={{ fontSize:11,color:'#2ecc71',marginTop:4 }}>✓ Will save as: <strong>{rcptName}.{receipt.name.split('.').pop()}</strong></div>}
                        </div>
                        <button onClick={saveRecord} disabled={saving||!receipt}
                          style={{ padding:'10px 20px',background:receipt?'#2ecc71':'var(--border)',border:'none',borderRadius:8,fontWeight:700,cursor:receipt?'pointer':'not-allowed',color:'#0a0a0f',fontSize:13 }}>
                          {saving?'Saving...':'💾 Save Payment Record'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display:'flex',gap:10,marginTop:20 }}>
            <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{ padding:'9px 16px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',cursor:'pointer',fontWeight:600,fontSize:13 }}>← Previous</button>
            <button onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))} disabled={step===steps.length-1} style={{ padding:'9px 18px',background:'#f5a623',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',color:'#0a0a0f',fontSize:13 }}>Next Step →</button>
          </div>
        </Card>
      ) : (
        <Card style={{ textAlign:'center',padding:'60px 20px',color:'var(--text3)' }}>
          <div style={{ fontSize:52,marginBottom:12 }}>⚡</div>
          <p>Select a vehicle above to see the step-by-step payment guide</p>
        </Card>
      )}
    </div>
  )
}
