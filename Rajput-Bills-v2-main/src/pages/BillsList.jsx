import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBills, deleteBill } from '../lib/supabase'

export default function BillsList() {
  const navigate = useNavigate()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [search, setSearch] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterCar, setFilterCar] = useState('')

  const [deleting, setDeleting] = useState(null)

  useEffect(() => { loadBills() }, [])

  async function loadBills() {
    try {
      const data = await getAllBills()
      setBills(data || [])
    } catch (e) {
      setError(`Failed to load bills: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, e) {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Are you strictly sure you want to permanently delete this bill? This cannot be undone.')) return
    setDeleting(id)
    try {
      await deleteBill(id)
      setBills(b => b.filter(bill => bill.id !== id))
    } catch (err) {
      alert(`Delete failed. Your Supabase table might not have RLS DELETE policy enabled. Error: ${err.message}`)
    } finally {
      setDeleting(null)
    }
  }

  const now = new Date()
  
  const filtered = bills.filter(b => {
    // Text search
    if (search) {
      const q = search.toLowerCase()
      const matchText = (b.client_name || '').toLowerCase().includes(q) ||
                        (b.bill_no || '').includes(q) ||
                        (b.route || '').toLowerCase().includes(q) ||
                        (b.car_no || '').toLowerCase().includes(q)
      if (!matchText) return false
    }

    // Car Filter
    if (filterCar && b.car_no !== filterCar) return false

    // Date Filter
    if (filterMonth && b.created_at) {
      const d = new Date(b.created_at)
      if (filterMonth === 'this_month') {
        if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return false
      } else if (filterMonth === 'last_month') {
        const lastM = new Date()
        lastM.setMonth(lastM.getMonth() - 1)
        if (d.getMonth() !== lastM.getMonth() || d.getFullYear() !== lastM.getFullYear()) return false
      }
    }
    return true
  })

  // Determine Unique cars for filter
  const uniqueCars = Array.from(new Set(bills.map(b => b.car_no).filter(Boolean)))

  const totalRevenue = filtered.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)

  const thisMonthCount = bills.filter(b => {
    if (!b.created_at) return false
    const d = new Date(b.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const inpStyle = {
    background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
    fontSize: 14, padding: '10px 14px', borderRadius: 8, outline: 'none'
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 3, height: 28, background: 'var(--accent)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700 }}>All Bills</h1>
        </div>
        <p style={{ color: 'var(--text2)', marginLeft: 15, paddingLeft: 12 }}>
          {bills.length} total generated bills
        </p>
      </div>

      {/* Stats - using responsive grid class */}
      <div className="responsive-grid-col3" style={{ marginBottom: 28 }}>
        <StatCard label="Total Saved Bills" value={bills.length} icon="📋" />
        <StatCard label="Filtered Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon="💰" />
        <StatCard label="New This Month" value={thisMonthCount} icon="📅" />
      </div>

      {/* Advanced Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by client, bill no, route..."
          style={{ flex: '1 1 200px', ...inpStyle }}
        />
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ ...inpStyle, flex: '1 1 140px' }}>
           <option value="">All Time</option>
           <option value="this_month">This Month</option>
           <option value="last_month">Last Month</option>
        </select>
        <select value={filterCar} onChange={e => setFilterCar(e.target.value)} style={{ ...inpStyle, flex: '1 1 140px' }}>
           <option value="">All Cars</option>
           {uniqueCars.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        { (search || filterMonth || filterCar) && (
          <button onClick={() => { setSearch(''); setFilterMonth(''); setFilterCar('') }} style={{ background: 'transparent', color: 'var(--accent2)', border: 'none', cursor: 'pointer', padding: '0 8px', fontSize: 13, fontWeight: 600 }}>Clear</button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ color: 'var(--text2)', textAlign: 'center', padding: 60 }}>Loading bills...</div>
      ) : error ? (
        <div style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid var(--red)', borderRadius: 12, padding: 24, color: 'var(--red)' }}>
          <strong>Error:</strong> {error}
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)' }}>
            Make sure your Supabase credentials are set in the <code>.env</code> file and the <code>bills</code> table exists.
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text2)' }}>
          {search || filterCar || filterMonth ? 'No bills match your current filters.' : 'No bills yet. Create your first bill!'}
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflowX: 'auto' }}>
          <div style={{ minWidth: 800 }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '130px 1.5fr 1.5fr 110px 110px 100px 70px',
              padding: '12px 20px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)',
              fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
            }}>
              <span>Bill No.</span>
              <span>Client</span>
              <span>Route</span>
              <span>Car No.</span>
              <span>Date</span>
              <span>Amount</span>
              <span style={{ textAlign: 'right' }}>Action</span>
            </div>

            {filtered.map((bill, i) => (
              <div
                key={bill.id}
                onClick={() => navigate(`/bill/${bill.id}`)}
                style={{
                  display: 'grid', gridTemplateColumns: '130px 1.5fr 1.5fr 110px 110px 100px 70px',
                  padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer', transition: 'background 0.12s', alignItems: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent2)' }}>
                  #{bill.bill_no}
                </span>
                <span style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                  {bill.client_name}
                </span>
                <span style={{ color: 'var(--text2)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                  {bill.route}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{bill.car_no}</span>
                <span style={{ color: 'var(--text2)', fontSize: 12 }}>{bill.date}</span>
                <span style={{ fontWeight: 700, color: 'var(--green)', fontSize: 14 }}>
                  {bill.amount ? `₹${Number(bill.amount).toLocaleString('en-IN')}` : '—'}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={e => handleDelete(bill.id, e)}
                    disabled={deleting === bill.id}
                    style={{
                      background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.3)',
                      color: 'var(--red)', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    {deleting === bill.id ? '...' : 'Del'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div>
        <div style={{ color: 'var(--text2)', fontSize: 12, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-head)' }}>{value}</div>
      </div>
    </div>
  )
}
