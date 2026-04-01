import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveBill } from '../lib/supabase'
import BillPreview from '../components/BillPreview'
import { useReactToPrint } from 'react-to-print'
import html2canvas from 'html2canvas'

const CAR_TYPES = ['Sedan', 'SUV', 'Luxury', 'Mini', 'Tempo Traveller', 'Bus']

function Field({ label, children, half }) {
  return (
    <div style={{ flex: half ? '1 1 calc(50% - 16px)' : '1 1 100%', minWidth: half ? '200px' : '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ color: 'var(--text2)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function SmallField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ color: 'var(--text3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
      <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
        {children}
      </span>
      <div style={{ height: 1, flex: 1, background: 'var(--border)' }} />
    </div>
  )
}

export default function CreateBill() {
  const navigate = useNavigate()
  const printRef = useRef()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  const today = new Date()
  const dateStr = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`
  
  const randNumStr = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  const defaultBillNo = `${String(today.getFullYear()).slice(-2)}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}${randNumStr}`

  const defaultCarNo = localStorage.getItem('defaultCarNo') || ''

  const [form, setForm] = useState({
    party_name: '',
    trip_route: '',
    date: dateStr,
    start_time: '',
    end_time: '',
    total_km: '',
    rate_per_km: '12',
    base_km: '80',
    base_hours: '8',
    base_package_price: '0', 
    toll: '',
    driver_allowance: '300',
    outstation: '',
    manual_amount: '',
    is_manual: false,
    use_package: false,
    car_type: 'Sedan',
    car_no: defaultCarNo,
    bill_no: defaultBillNo,
    duty_slip: '',
    car_used_by: '',
    car_booked_by: '',
    particulars_rate: '4 Hrs. 40 Km. / 8Hrs. 80Km.',
  })

  // State for calculation results
  const [calc, setCalc] = useState({
    trip_cost: 0,
    toll: 0,
    driver_allowance: 0,
    outstation: 0,
    final_total: 0,
    total_hours: 0,
    extra_km: 0
  })

  const pNum = (val) => {
    const n = parseFloat(val)
    return isNaN(n) ? 0 : n
  }

  // Effect to handle calculations in real-time
  useEffect(() => {
    const total_km = pNum(form.total_km)
    const rate_per_km = pNum(form.rate_per_km)
    const base_km = pNum(form.base_km)
    const base_hours = pNum(form.base_hours)
    const base_package_price = pNum(form.base_package_price)
    const toll = pNum(form.toll)
    const da = pNum(form.driver_allowance)
    const outstation = pNum(form.outstation)

    // Time calculation
    let total_hours = 0
    if (form.start_time && form.end_time) {
      const start = new Date(`2000/01/01 ${form.start_time}`)
      const end = new Date(`2000/01/01 ${form.end_time}`)
      if (end < start) end.setDate(end.getDate() + 1) // crosses midnight
      total_hours = (end - start) / (1000 * 60 * 60)
    }

    let trip_cost = 0;
    let extra_km = 0;

    if (form.is_manual && form.manual_amount !== '') {
       trip_cost = pNum(form.manual_amount)
    } else {
       if (form.use_package) {
          if (total_km <= base_km && total_hours <= base_hours) {
             trip_cost = base_package_price;
          } else {
             extra_km = Math.max(0, total_km - base_km)
             trip_cost = base_package_price + (extra_km * rate_per_km)
          }
       } else {
          trip_cost = total_km * rate_per_km
       }
    }

    // Auto round to nearest integer and prevent negative bounds
    const final_total = Math.max(0, Math.round(trip_cost + toll + da + outstation))

    setCalc({
      trip_cost: Math.round(trip_cost),
      toll,
      driver_allowance: da,
      outstation,
      final_total,
      total_hours: parseFloat(total_hours.toFixed(2)),
      extra_km
    })
  }, [form])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Bill_${form.bill_no || 'Draft'}`,
  })

  const handleSave = async () => {
    if (!form.bill_no || !form.party_name) {
      setError('Bill No. and Party Name are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const saved_bill = await saveBill({
        bill_no: form.bill_no,
        date: form.date,
        client_name: form.party_name,
        route: form.trip_route,
        duty_slip: form.duty_slip,
        car_type: form.car_type,
        car_no: form.car_no,
        particulars_rate: form.particulars_rate,
        car_used_by: form.car_used_by,
        car_booked_by: form.car_booked_by,
        total_kms: form.total_km,
        
        // Exact schema requests without breaking original Supabase layout:
        amount: calc.final_total, 
        toll_amount: calc.toll,
        driver_allowance: String(calc.driver_allowance), 
        outstation: String(calc.outstation),
      })
      setSaved(true)
      setTimeout(() => navigate(`/bill/${saved_bill.id}`), 1200)
    } catch (e) {
      setError(`Save failed: ${e.message}.`)
    } finally {
      setSaving(false)
    }
  }

  const inp = {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    padding: '10px 14px',
    borderRadius: 8,
    outline: 'none',
    width: '100%',
  }

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 3, height: 28, background: 'var(--accent)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700 }}>Generate New Bill</h1>
        </div>
        <p style={{ color: 'var(--text2)', marginLeft: 15, paddingLeft: 12 }}>Auto-Calculate Billing Engine</p>
      </div>

      <div className="responsive-layout">
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 32px' }}>

          <SectionTitle>Header Information</SectionTitle>
          <div className="responsive-grid-col2" style={{ marginBottom: 20 }}>
            <Field label="Bill No."><input style={inp} value={form.bill_no} onChange={e => set('bill_no', e.target.value)} /></Field>
            <Field label="Date"><input style={inp} value={form.date} onChange={e => set('date', e.target.value)} /></Field>
            <Field label="Party Name (M/s.)"><input style={inp} value={form.party_name} onChange={e => set('party_name', e.target.value)} /></Field>
            <Field label="Route"><input style={inp} value={form.trip_route} onChange={e => set('trip_route', e.target.value)} /></Field>
            <Field label="Car Type">
              <select style={inp} value={form.car_type} onChange={e => set('car_type', e.target.value)}>
                {CAR_TYPES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Car Number"><input style={inp} value={form.car_no} onChange={e => set('car_no', e.target.value)} /></Field>
          </div>

          <SectionTitle>Calculation Logic (KM × Rate)</SectionTitle>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16, fontSize: 13, background: 'var(--surface2)', padding: '10px 14px', borderRadius: 8 }}>
             <input type="checkbox" checked={form.use_package} onChange={e => set('use_package', e.target.checked)} />
             Enable Minimum Fixed Package Rule
          </label>
          <div className="responsive-grid-col3" style={{ marginBottom: 20, opacity: form.is_manual ? 0.4 : 1, pointerEvents: form.is_manual ? 'none' : 'auto', transition: 'all 0.3s' }}>
            <SmallField label="Total KMs">
              <input style={inp} type="number" value={form.total_km} onChange={e => set('total_km', e.target.value)} />
            </SmallField>
            <SmallField label="Rate Per KM (₹)">
              <input style={inp} type="number" value={form.rate_per_km} onChange={e => set('rate_per_km', e.target.value)} />
            </SmallField>
            {form.use_package && (
              <>
                <SmallField label="Base Distance (KM)">
                  <input style={inp} type="number" value={form.base_km} onChange={e => set('base_km', e.target.value)} />
                </SmallField>
                <SmallField label="Base Hours">
                  <input style={inp} type="number" value={form.base_hours} onChange={e => set('base_hours', e.target.value)} />
                </SmallField>
                <SmallField label="Base Package Price">
                  <input style={inp} type="number" value={form.base_package_price} onChange={e => set('base_package_price', e.target.value)} />
                </SmallField>
              </>
            )}
            <SmallField label="Start Time (Auto calc)">
               <input style={inp} type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} />
            </SmallField>
            <SmallField label="End Time">
               <input style={inp} type="time" value={form.end_time} onChange={e => set('end_time', e.target.value)} />
            </SmallField>
            <SmallField label="Total Hours (Calculated)">
               <div style={{...inp, background: 'transparent', color: 'var(--accent)', fontWeight: 'bold'}}>{calc.total_hours} Hrs</div>
            </SmallField>
          </div>

          <SectionTitle>Extras & Allowances</SectionTitle>
          <div className="responsive-grid-col3" style={{ marginBottom: 20 }}>
            <SmallField label="Toll (₹)">
              <input style={inp} type="number" value={form.toll} onChange={e => set('toll', e.target.value)} />
            </SmallField>
            <SmallField label="Driver Allowance (₹)">
              <input style={inp} type="number" value={form.driver_allowance} onChange={e => set('driver_allowance', e.target.value)} />
            </SmallField>
            <SmallField label="Outstation (₹)">
              <input style={inp} type="number" value={form.outstation} onChange={e => set('outstation', e.target.value)} />
            </SmallField>
          </div>

          <SectionTitle>Manual Override</SectionTitle>
          <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: 8, marginBottom: 24, transition: 'all 0.3s' }}>
             <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: form.is_manual ? 10 : 0, fontSize: 13 }}>
               <input type="checkbox" checked={form.is_manual} onChange={e => set('is_manual', e.target.checked)} />
               <strong style={{ color: form.is_manual ? 'var(--red)' : 'var(--text2)' }}>Enable Manual Override (Locks auto KM calc)</strong>
             </label>
             {form.is_manual && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 6, animation: 'fadeIn 0.3s ease-out' }}>
                 <label style={{ color: 'var(--red)', fontSize: 11, fontWeight: 600 }}>MANUAL TRIP COST (₹)</label>
                 <input style={inp} type="number" value={form.manual_amount} onChange={e => set('manual_amount', e.target.value)} placeholder="Will override trip cost completely" />
               </div>
             )}
          </div>

          {error && <div style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid var(--red)', borderRadius: 10, padding: '12px 16px', color: 'var(--red)', fontSize: 13, marginBottom: 20 }}>⚠️ {error}</div>}

          <div style={{ background: '#18181f', padding: '16px 20px', borderRadius: 12, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid var(--border)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text2)' }}>
                <span>Trip Cost {form.is_manual && "(Manual)"}</span>
                <span>₹ {calc.trip_cost.toLocaleString('en-IN')}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text2)' }}>
                <span>Extras (Toll + DA + Outstation)</span>
                <span>₹ {(calc.toll + calc.driver_allowance + calc.outstation).toLocaleString('en-IN')}</span>
             </div>
             <div style={{ borderBottom: '1px dashed var(--border)', margin: '8px 0' }} />
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: 15, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final Total</span>
               <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>₹ {calc.final_total.toLocaleString('en-IN')} /-</span>
             </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              style={{
                flex: 1, background: saved ? 'var(--green)' : 'var(--accent)', color: '#000', border: 'none', borderRadius: 10,
                padding: '12px 28px', fontSize: 14, fontWeight: 700, opacity: saving ? 0.7 : 1, transition: 'all 0.2s',
                cursor: saving || saved ? 'not-allowed' : 'pointer', minWidth: '200px'
              }}
            >
              {saved ? '✓ Saved!' : saving ? 'Saving...' : '💾 Save to Database'}
            </button>
            <button
              onClick={handlePrint}
              style={{ flex: 1, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minWidth: '150px' }}
            >
              🖨️ Print PDF
            </button>
            <button
              onClick={async () => {
                const canvas = await html2canvas(printRef.current, { scale: 3, useCORS: true })
                const link = document.createElement('a')
                link.download = `Bill_${form.bill_no || 'Draft'}.jpg`
                link.href = canvas.toDataURL('image/jpeg', 0.95)
                link.click()
              }}
              style={{ flex: 1, background: 'transparent', color: 'var(--text)', border: '1px dashed var(--accent)', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minWidth: '150px' }}
            >
              📸 Download JPG
            </button>
          </div>
        </div>

        <div style={{ position: 'sticky', top: 24, zIndex: 10 }}>
          <div style={{ color: 'var(--text2)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Live Preview</div>
          <div style={{ borderRadius: 12, border: '1px solid var(--border)', background: '#222', width: '100%', overflowX: 'auto', padding: 16 }}>
             <div ref={printRef} style={{ width: 620, margin: '0 auto', background: '#fff' }}>
               <BillPreview data={{ ...form, ...calc, amount: calc.final_total }} />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
