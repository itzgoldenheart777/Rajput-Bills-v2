import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getVehicles, getPayments, addPayment, uploadReceipt, formatReceiptFilename } from '../lib/supabase'

const TAX_TYPES = ['MONTHLY','QUARTERLY','HALF_YEARLY','ANNUAL']

function periodEnd(start, type) {
  const d = new Date(start)
  if (type==='MONTHLY')    { d.setMonth(d.getMonth()+1);   d.setDate(d.getDate()-1) }
  else if (type==='QUARTERLY')  { d.setMonth(d.getMonth()+3);   d.setDate(d.getDate()-1) }
  else if (type==='HALF_YEARLY'){ d.setMonth(d.getMonth()+6);   d.setDate(d.getDate()-1) }
  else                          { d.setFullYear(d.getFullYear()+1); d.setDate(d.getDate()-1) }
  return d.toISOString().slice(0,10)
}
function periodLabel(start, type) {
  const d = new Date(start)
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  if (type==='MONTHLY')     return `${M[d.getMonth()]} ${d.getFullYear()}`
  if (type==='QUARTERLY')   return `Q${Math.ceil((d.getMonth()+1)/3)} ${d.getFullYear()}`
  if (type==='HALF_YEARLY') return `H${d.getMonth()<6?1:2} ${d.getFullYear()}`
  return `FY ${d.getFullYear()}-${String(d.getFullYear()+1).slice(2)}`
}
function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—' }

function Badge({ text, color }) {
  const map = { green:'#2ecc71', red:'#e74c3c', blue:'#3498db', gray:'#55556a' }
  const c = map[color]||map.gray
  return <span style={{ display:'inline-block',padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700,background:`${c}22`,color:c }}>{text}</span>
}

const label = { color:'var(--text3)',fontSize:11,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',display:'block',marginBottom:5 }

export default function TaxPayments() {
  const location = useLocation()
  const [vehicles,    setVehicles]    = useState([])
  const [selectedId,  setSelectedId]  = useState(location.state?.vehicleId||'')
  const [payments,    setPayments]    = useState([])
  const [showModal,   setShowModal]   = useState(false)
  const [form,        setForm]        = useState({ vehicle_id:'',period_start:new Date().toISOString().slice(0,10),tax_type:'MONTHLY',amount:'',status:'PAID',transaction_id:'',notes:'' })
  const [receiptFile, setReceiptFile] = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [msg,         setMsg]         = useState('')

  useEffect(()=>{ getVehicles().then(v=>setVehicles(v||[])) },[])
  useEffect(()=>{ getPayments(selectedId||null).then(p=>setPayments(p||[])) },[selectedId])

  const openAdd = () => {
    const v = vehicles.find(x=>x.id===selectedId)
    setForm({ vehicle_id:selectedId||'',period_start:new Date().toISOString().slice(0,10),tax_type:'MONTHLY',amount:'',status:'PAID',transaction_id:'',notes:'' })
    setReceiptFile(null); setShowModal(true); setMsg('')
  }
  const save = async () => {
    if (!form.vehicle_id) { setMsg('Select a vehicle'); return }
    setSaving(true)
    try {
      const v    = vehicles.find(x=>x.id===form.vehicle_id)
      const pEnd = periodEnd(form.period_start, form.tax_type)
      const lbl  = periodLabel(form.period_start, form.tax_type)
      const fname= formatReceiptFilename(v.vehicle_number, form.period_start, pEnd)
      let receiptUrl = null
      if (receiptFile) {
        const ext = receiptFile.name.split('.').pop()
        const { publicUrl } = await uploadReceipt(receiptFile, `${fname}.${ext}`)
        receiptUrl = publicUrl
      }
      await addPayment({ vehicle_id:form.vehicle_id, vehicle_number:v.vehicle_number, period_start:form.period_start, period_end:pEnd, period_label:lbl, tax_type:form.tax_type, amount:form.amount?parseFloat(form.amount):null, status:form.status, transaction_id:form.transaction_id||null, notes:form.notes||null, receipt_filename:fname, receipt_url:receiptUrl, payment_date:form.status==='PAID'?new Date().toISOString():null })
      setShowModal(false)
      getPayments(selectedId||null).then(p=>setPayments(p||[]))
    } catch(e) { setMsg(e.message) }
    setSaving(false)
  }
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}))
  const veh = form.vehicle_id ? vehicles.find(x=>x.id===form.vehicle_id) : null
  const previewEnd  = form.vehicle_id ? periodEnd(form.period_start, form.tax_type) : ''
  const previewName = veh ? formatReceiptFilename(veh.vehicle_number, form.period_start, previewEnd) : ''

  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-head)',fontSize:26,fontWeight:700 }}>Payment <span style={{ color:'#f5a623' }}>Records</span></h1>
        <button onClick={openAdd} style={{ padding:'9px 18px',background:'#f5a623',border:'none',borderRadius:8,fontWeight:700,fontSize:13,cursor:'pointer',color:'#0a0a0f' }}>+ Log Payment</button>
      </div>

      <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:16,marginBottom:20,display:'flex',gap:12,alignItems:'center' }}>
        <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} style={{ maxWidth:300 }}>
          <option value="">All Vehicles</option>
          {vehicles.map(v=><option key={v.id} value={v.id}>{v.vehicle_number} — {v.owner_name||'No owner'}</option>)}
        </select>
        <span style={{ color:'var(--text3)',fontSize:13 }}>{payments.length} records</span>
      </div>

      <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:20,overflowX:'auto' }}>
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
          <thead>
            <tr>{['Vehicle','Period','Type','Amount','Status','Receipt','Date'].map(h=>(
              <th key={h} style={{ textAlign:'left',padding:'9px 12px',color:'var(--text3)',fontSize:11,textTransform:'uppercase',letterSpacing:.8,borderBottom:'1px solid var(--border)' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {payments.map(p=>(
              <tr key={p.id}>
                <td style={{ padding:'12px',borderBottom:'1px solid var(--border)',fontFamily:'var(--font-mono)',color:'#f5a623' }}>{p.vehicle_number}</td>
                <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}>
                  <div style={{ fontWeight:600 }}>{p.period_label}</div>
                  <div style={{ fontSize:11,color:'var(--text3)' }}>{fmtDate(p.period_start)} → {fmtDate(p.period_end)}</div>
                </td>
                <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}><Badge text={p.tax_type} color="blue"/></td>
                <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}>{p.amount?`₹${Number(p.amount).toFixed(2)}`:'—'}</td>
                <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}><Badge text={p.status} color={p.status==='PAID'?'green':p.status==='FAILED'?'red':'gray'}/></td>
                <td style={{ padding:'12px',borderBottom:'1px solid var(--border)' }}>
                  {p.receipt_url ? <a href={p.receipt_url} target="_blank" rel="noreferrer" style={{ padding:'5px 10px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:6,color:'var(--text2)',fontSize:11,textDecoration:'none' }}>📥 Download</a> : '—'}
                  {p.receipt_filename && <div style={{ fontSize:10,color:'var(--text3)',marginTop:3,maxWidth:200 }}>{p.receipt_filename}</div>}
                </td>
                <td style={{ padding:'12px',borderBottom:'1px solid var(--border)',fontSize:12,color:'var(--text3)' }}>{fmtDate(p.payment_date)}</td>
              </tr>
            ))}
            {payments.length===0 && <tr><td colSpan={7} style={{ textAlign:'center',color:'var(--text3)',padding:40 }}>No payment records found</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div onClick={e=>e.target===e.currentTarget&&setShowModal(false)}
          style={{ position:'fixed',inset:0,background:'#00000088',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:20 }}>
          <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,padding:28,width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto' }}>
            <div style={{ fontFamily:'var(--font-head)',fontSize:20,fontWeight:700,marginBottom:20,color:'#f5a623' }}>+ Log Tax Payment</div>
            {msg && <div style={{ padding:'10px 14px',background:'#e74c3c18',border:'1px solid #e74c3c40',borderRadius:8,color:'#e74c3c',fontSize:13,marginBottom:14 }}>{msg}</div>}
            <div style={{ marginBottom:14 }}>
              <label style={label}>Vehicle *</label>
              <select value={form.vehicle_id} onChange={e=>{ const v=vehicles.find(x=>x.id===e.target.value); setForm(p=>({...p,vehicle_id:e.target.value})) }}>
                <option value="">Select vehicle...</option>
                {vehicles.map(v=><option key={v.id} value={v.id}>{v.vehicle_number}</option>)}
              </select>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14 }}>
              <div><label style={label}>Period Start *</label><input type="date" value={form.period_start} onChange={f('period_start')}/></div>
              <div><label style={label}>Tax Type *</label>
                <select value={form.tax_type} onChange={f('tax_type')}>{TAX_TYPES.map(t=><option key={t}>{t}</option>)}</select>
              </div>
            </div>
            {form.vehicle_id && (
              <div style={{ padding:'10px 14px',background:'#2ecc7118',border:'1px solid #2ecc7140',borderRadius:8,fontSize:12,color:'#2ecc71',marginBottom:14 }}>
                📅 <strong>{form.period_start}</strong> → <strong>{previewEnd}</strong><br/>
                📁 <strong>{previewName}</strong>
              </div>
            )}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14 }}>
              <div><label style={label}>Amount (₹)</label><input type="number" value={form.amount} onChange={f('amount')} placeholder="0.00"/></div>
              <div><label style={label}>Status</label>
                <select value={form.status} onChange={f('status')}><option>PAID</option><option>PENDING</option><option>FAILED</option></select>
              </div>
            </div>
            <div style={{ marginBottom:14 }}><label style={label}>Transaction ID</label><input value={form.transaction_id} onChange={f('transaction_id')} placeholder="UPI / Bank ref" style={{ fontFamily:'var(--font-mono)' }}/></div>
            <div style={{ marginBottom:14 }}>
              <label style={label}>Upload Receipt (PDF/Image)</label>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e=>setReceiptFile(e.target.files[0])}/>
              {receiptFile && <div style={{ fontSize:11,color:'#2ecc71',marginTop:4 }}>✓ {receiptFile.name}</div>}
            </div>
            <div style={{ marginBottom:14 }}><label style={label}>Notes</label><textarea value={form.notes} onChange={f('notes')} rows={2} style={{ resize:'vertical' }}/></div>
            <div style={{ display:'flex',gap:10,justifyContent:'flex-end',marginTop:20 }}>
              <button onClick={()=>setShowModal(false)} style={{ padding:'9px 16px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',cursor:'pointer',fontWeight:600 }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ padding:'9px 18px',background:'#f5a623',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',color:'#0a0a0f',fontSize:13 }}>{saving?'Saving...':'Save Record'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
