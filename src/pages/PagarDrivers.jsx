import React, { useEffect, useState } from 'react'
import { getDrivers, addDriver, removeDriver } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function PagarDrivers() {
  const navigate = useNavigate()
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [name,    setName]    = useState('')
  const [vehicle, setVehicle] = useState('')
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const [deleting,setDeleting]= useState(null)

  const load = () => getDrivers().then(d=>{ setDrivers(d||[]); setLoading(false) }).catch(()=>setLoading(false))
  useEffect(()=>{ load() },[])

  const save = async () => {
    if (!name.trim()) { setMsg('Driver name is required'); return }
    setSaving(true); setMsg('')
    try {
      await addDriver(name.trim(), vehicle.trim())
      setName(''); setVehicle(''); load()
    } catch(e) { setMsg(e.message) }
    setSaving(false)
  }
  const remove = async (d) => {
    if (!window.confirm(`Remove driver ${d.name}?`)) return
    setDeleting(d.id)
    try { await removeDriver(d.id); load() } catch(e) { alert(e.message) }
    setDeleting(null)
  }

  const label = { color:'var(--text3)',fontSize:11,fontWeight:600,letterSpacing:'.05em',textTransform:'uppercase',display:'block',marginBottom:5 }

  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-head)',fontSize:26,fontWeight:700 }}>Manage <span style={{ color:'#4caf7d' }}>Drivers</span></h1>
        <button onClick={()=>navigate('/pagar')} style={{ padding:'8px 16px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',fontSize:13,cursor:'pointer',fontWeight:600 }}>← Back to Calculator</button>
      </div>

      {/* Add Driver Card */}
      <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:24,marginBottom:24 }}>
        <div style={{ fontFamily:'var(--font-head)',fontSize:17,fontWeight:700,marginBottom:18,color:'#4caf7d' }}>+ Add New Driver</div>
        {msg && <div style={{ padding:'10px 14px',background:'#e74c3c18',border:'1px solid #e74c3c40',borderRadius:8,color:'#e74c3c',fontSize:13,marginBottom:14 }}>{msg}</div>}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:12,alignItems:'end' }}>
          <div>
            <label style={label}>Driver Name *</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Raju Bhai" onKeyDown={e=>e.key==='Enter'&&save()}/>
          </div>
          <div>
            <label style={label}>Vehicle Number</label>
            <input value={vehicle} onChange={e=>setVehicle(e.target.value)} placeholder="e.g. MH03EL5095" style={{ fontFamily:'var(--font-mono)',textTransform:'uppercase' }} onKeyDown={e=>e.key==='Enter'&&save()}/>
          </div>
          <button onClick={save} disabled={saving}
            style={{ padding:'11px 20px',background:'#4caf7d',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',color:'#0a0a0f',fontSize:13,whiteSpace:'nowrap' }}>
            {saving?'Adding...':'Add Driver'}
          </button>
        </div>
      </div>

      {/* Drivers List */}
      <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:20 }}>
        <div style={{ fontWeight:700,fontSize:15,marginBottom:16 }}>All Drivers ({drivers.length})</div>
        {loading ? <p style={{ color:'var(--text3)' }}>Loading...</p> :
          drivers.length === 0 ? (
            <div style={{ textAlign:'center',padding:'50px 0',color:'var(--text3)' }}>
              <div style={{ fontSize:48,marginBottom:12 }}>🧑‍✈️</div>
              <p>No drivers added yet. Add your first driver above!</p>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              {drivers.map((d,i) => (
                <div key={d.id} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:14 }}>
                    <div style={{ width:40,height:40,background:'#4caf7d22',border:'1px solid #4caf7d44',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>🧑‍✈️</div>
                    <div>
                      <div style={{ fontWeight:700,fontSize:15 }}>{d.name}</div>
                      {d.vehicle_number && <div style={{ fontSize:12,color:'var(--text3)',fontFamily:'var(--font-mono)',marginTop:2 }}>{d.vehicle_number}</div>}
                      <div style={{ fontSize:11,color:'var(--text3)',marginTop:1 }}>Added {new Date(d.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex',gap:8 }}>
                    <button onClick={()=>navigate('/pagar',{state:{driverId:d.id}})}
                      style={{ padding:'7px 12px',background:'#4caf7d18',border:'1px solid #4caf7d44',borderRadius:7,color:'#4caf7d',cursor:'pointer',fontSize:12,fontWeight:600 }}>
                      🧮 Calculate
                    </button>
                    <button onClick={()=>navigate('/pagar/records',{state:{driverId:d.id}})}
                      style={{ padding:'7px 12px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:7,color:'var(--text2)',cursor:'pointer',fontSize:12 }}>
                      📋 Records
                    </button>
                    <button onClick={()=>remove(d)} disabled={deleting===d.id}
                      style={{ padding:'7px 12px',background:'#e74c3c18',border:'1px solid #e74c3c40',borderRadius:7,color:'#e74c3c',cursor:'pointer',fontSize:12,fontWeight:600 }}>
                      {deleting===d.id?'...':'🗑'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}
