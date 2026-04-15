import React, { useEffect, useState } from 'react'
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '../lib/supabase'

const EMPTY = { vehicle_number:'',chassis_last5:'',owner_name:'',vehicle_type:'Private',mobile_number:'',notes:'' }

function Btn({ children, onClick, color='#f5a623', textColor='#0a0a0f', ghost }) {
  return (
    <button onClick={onClick} style={{ padding:'8px 14px',background:ghost?'var(--surface2)':color,border:ghost?'1px solid var(--border)':'none',borderRadius:8,color:ghost?'var(--text2)':textColor,fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'var(--font-body)' }}>
      {children}
    </button>
  )
}

function ExpiryChip({ days }) {
  if (days === null || days === undefined) return null
  const color = days < 0 ? '#e74c3c' : days <= 7 ? '#e74c3c' : days <= 30 ? '#f39c12' : '#2ecc71'
  const label = days < 0 ? 'EXPIRED' : days <= 7 ? `⚠ ${days}d` : days <= 30 ? `🕐 ${days}d` : `✓ ${days}d`
  return <span style={{ display:'inline-block',padding:'3px 9px',borderRadius:20,fontSize:11,fontWeight:700,background:`${color}22`,color }}>{label}</span>
}

export default function TaxVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showModal,setShowModal]= useState(false)
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState('')

  const load = () => getVehicles().then(v=>{ setVehicles(v||[]); setLoading(false) }).catch(()=>setLoading(false))
  useEffect(()=>{ load() },[])

  const open = (v=null) => {
    setEditing(v)
    setForm(v ? { vehicle_number:v.vehicle_number,chassis_last5:v.chassis_last5,owner_name:v.owner_name||'',vehicle_type:v.vehicle_type||'Private',mobile_number:v.mobile_number||'',notes:v.notes||'' } : EMPTY)
    setShowModal(true); setMsg('')
  }
  const save = async () => {
    if (!form.vehicle_number || !form.chassis_last5) { setMsg('Vehicle number and chassis digits required'); return }
    setSaving(true)
    try {
      const d = { ...form, vehicle_number:form.vehicle_number.toUpperCase().trim(), chassis_last5:form.chassis_last5.toUpperCase().trim() }
      if (editing) await updateVehicle(editing.id, d); else await addVehicle(d)
      setShowModal(false); load()
    } catch(e) { setMsg(e.message) }
    setSaving(false)
  }
  const remove = async (v) => {
    if (!window.confirm(`Delete ${v.vehicle_number}? All payment records will also be deleted.`)) return
    await deleteVehicle(v.id); load()
  }
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}))

  const label = { color:'var(--text3)',fontSize:11,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',display:'block',marginBottom:5 }
  const card  = { background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:20,position:'relative' }

  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-head)',fontSize:26,fontWeight:700 }}>My <span style={{ color:'#f5a623' }}>Vehicles</span></h1>
        <Btn onClick={()=>open()}>+ Add Vehicle</Btn>
      </div>

      {loading ? <p style={{ color:'var(--text3)' }}>Loading...</p> : (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16 }}>
          {vehicles.map(v => (
            <div key={v.id} style={card}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14 }}>
                <div>
                  <div style={{ fontFamily:'var(--font-mono)',fontSize:18,color:'#f5a623',fontWeight:500,letterSpacing:1 }}>{v.vehicle_number}</div>
                  <div style={{ fontSize:12,color:'var(--text3)',marginTop:3 }}>{v.vehicle_type} · {v.owner_name||'No owner'}</div>
                </div>
                <ExpiryChip days={v.days_until_expiry}/>
              </div>
              <div style={{ fontSize:13,color:'var(--text2)',display:'flex',flexDirection:'column',gap:4 }}>
                <div>Chassis (last 5): <span style={{ fontFamily:'var(--font-mono)',color:'var(--text)' }}>{v.chassis_last5}</span></div>
                {v.mobile_number && <div>Mobile: <strong style={{ color:'var(--text)' }}>{v.mobile_number}</strong></div>}
                {v.last_tax_end && <div>Tax until: <strong style={{ color:'var(--text)' }}>{new Date(v.last_tax_end).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</strong></div>}
                {v.notes && <div style={{ fontSize:12,color:'var(--text3)',marginTop:4 }}>{v.notes}</div>}
              </div>
              <div style={{ display:'flex',gap:8,marginTop:16 }}>
                <Btn ghost onClick={()=>open(v)}>✏ Edit</Btn>
                <Btn onClick={()=>remove(v)} color="#e74c3c">🗑 Delete</Btn>
              </div>
            </div>
          ))}
          {vehicles.length===0 && (
            <div style={{ gridColumn:'1/-1',textAlign:'center',padding:'60px 0',color:'var(--text3)' }}>
              <div style={{ fontSize:52,marginBottom:12 }}>🚘</div>
              <p>No vehicles added yet.</p>
              <Btn onClick={()=>open()} style={{ marginTop:12 }}>Add First Vehicle</Btn>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div onClick={e=>e.target===e.currentTarget&&setShowModal(false)}
          style={{ position:'fixed',inset:0,background:'#00000088',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:20 }}>
          <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,padding:28,width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto' }}>
            <div style={{ fontFamily:'var(--font-head)',fontSize:20,fontWeight:700,marginBottom:20,color:'#f5a623' }}>{editing?'✏ Edit Vehicle':'+ Add Vehicle'}</div>
            {msg && <div style={{ padding:'10px 14px',background:'#e74c3c18',border:'1px solid #e74c3c40',borderRadius:8,color:'#e74c3c',fontSize:13,marginBottom:14 }}>{msg}</div>}
            {[['Vehicle Registration Number *','vehicle_number','e.g. MH48CQ3166'],
              ['Chassis Last 5 Digits *','chassis_last5','e.g. 55540'],
              ['Owner Name','owner_name','Full name'],
              ['Mobile Number','mobile_number','10-digit']].map(([lbl,key,ph])=>(
              <div key={key} style={{ marginBottom:14 }}>
                <label style={label}>{lbl}</label>
                <input value={form[key]} onChange={f(key)} placeholder={ph}
                  style={{ fontFamily:key==='chassis_last5'?'var(--font-mono)':'var(--font-body)' }}/>
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={label}>Vehicle Type</label>
              <select value={form.vehicle_type} onChange={f('vehicle_type')}>
                {['Private','Commercial','Two-Wheeler','Three-Wheeler','Goods Vehicle'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={label}>Notes</label>
              <textarea value={form.notes} onChange={f('notes')} rows={2} style={{ resize:'vertical' }}/>
            </div>
            <div style={{ display:'flex',gap:10,justifyContent:'flex-end',marginTop:20 }}>
              <Btn ghost onClick={()=>setShowModal(false)}>Cancel</Btn>
              <Btn onClick={save} disabled={saving}>{saving?'Saving...':'Save Vehicle'}</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
