import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBillById } from '../lib/supabase'
import BillPreview from '../components/BillPreview'
import { useReactToPrint } from 'react-to-print'
import html2canvas from 'html2canvas'

export default function ViewBill() {
  const { id } = useParams()
  const navigate = useNavigate()
  const printRef = useRef()
  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBillById(id)
      .then(setBill)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  // react-to-print v2 correct API
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: bill ? `Rajput_Bill_${bill.bill_no}` : 'Rajput_Bill',
  })

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80, color: 'var(--text2)' }}>Loading bill...</div>
  )

  if (error) return (
    <div style={{ color: 'var(--red)', padding: 40 }}>
      <strong>Error:</strong> {error}
      <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text2)' }}>
        Make sure your Supabase credentials are set correctly in the .env file.
      </div>
    </div>
  )

  if (!bill) return (
    <div style={{ color: 'var(--text2)', padding: 40 }}>Bill not found.</div>
  )

  const summaryItems = [
    { label: 'Amount', value: bill.amount ? `₹${Number(bill.amount).toLocaleString('en-IN')}` : '—', accent: true },
    { label: 'Route', value: bill.route || '—' },
    { label: 'Car No.', value: bill.car_no || '—' },
    { label: 'Total KMs', value: bill.total_kms ? `${bill.total_kms} km` : '—' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
        <div>
          <button
            onClick={() => navigate('/bills')}
            style={{ background: 'transparent', border: 'none', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', marginBottom: 8, padding: 0 }}
          >
            ← Back to Bills
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 3, height: 28, background: 'var(--accent)', borderRadius: 2 }} />
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700 }}>
              Bill #{bill.bill_no}
            </h1>
          </div>
          <p style={{ color: 'var(--text2)', marginLeft: 15, paddingLeft: 12, marginTop: 4 }}>
            {bill.client_name} · {bill.date}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handlePrint}
            style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            🖨️ Print PDF
          </button>
          <button
            onClick={async () => {
              const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
              const link = document.createElement('a')
              link.download = `Rajput_Bill_${bill.bill_no || 'Draft'}.png`
              link.href = canvas.toDataURL('image/png', 1.0)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            style={{ background: 'transparent', color: 'var(--text)', border: '1px dashed var(--accent)', borderRadius: 10, padding: '12px 28px', fontSize: 14, cursor: 'pointer' }}
          >
            📸 Download PNG
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 28px', fontSize: 14, cursor: 'pointer' }}
          >
            + New Bill
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {summaryItems.map(item => (
          <div key={item.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ color: 'var(--text2)', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {item.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: item.accent ? 'var(--green)' : 'var(--text)' }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Printable bill */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 16px', display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
        <div ref={printRef} style={{ width: 620, minWidth: 620, background: '#fff' }}>
          <BillPreview data={bill} />
        </div>
      </div>
    </div>
  )
}
