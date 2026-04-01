import React from 'react'
import { useAssets } from '../contexts/AssetsContext'

export default function BillPreview({ data }) {
  const d = data || {}
  const { logoUrl: carLogo, stampUrl: stampImg, signatureUrl: signatureImg } = useAssets()

  const underline = {
    display: 'inline-block',
    borderBottom: '1px solid #333',
    verticalAlign: 'bottom',
    paddingBottom: 1,
  }

  return (
    <div style={{
      background: '#fff',
      color: '#000',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 12,
      width: 620,
      border: '2px solid #555',
      borderRadius: 6,
      boxSizing: 'border-box',
      lineHeight: 1.4,
    }}>

      {/* ══════════════════════════════════
          HEADER
      ══════════════════════════════════ */}
      <div style={{ padding: '12px 22px 10px', borderBottom: '2px solid #333' }}>
        <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
          Mob : 7304315584
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* ── Real Toyota car logo ── */}
          <img
            src={carLogo}
            alt="car"
            style={{
              width: 100,
              height: 56,
              objectFit: 'contain',
              flexShrink: 0,
              background: 'transparent',
            }}
          />
          {/* ── Company name & address ── */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              fontSize: 32,
              fontWeight: 900,
              color: '#cc2200',
              fontFamily: 'Georgia, "Times New Roman", serif',
              letterSpacing: 0.4,
              lineHeight: 1.1,
              marginBottom: 5,
            }}>
              Rajput Tour &amp; Travels
            </div>
            <div style={{ fontSize: 10.5, color: '#333', lineHeight: 1.7 }}>
              Flat No - 706, Bldg No - 14, H - 1, Shradha Sabri &nbsp;Society, Sanghrsh Nagar,
            </div>
            <div style={{ fontSize: 10.5, color: '#333' }}>
              Chandivali, Andheri (E) Mumbai - 400 072 | Email : rajputtoursandtravels2016@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          M/S  +  BILL NO  +  DATE
      ══════════════════════════════════ */}
      <div style={{ padding: '10px 22px 6px', borderBottom: '1px solid #bbb' }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 13, minWidth: 38 }}>M/s.</span>
          <span style={{ flex: 1, ...underline, minWidth: 10, fontSize: 14, fontWeight: 700, minHeight: 18 }}>
            {d.client_name || ''}
          </span>
          <span style={{ whiteSpace: 'nowrap', fontSize: 12, marginLeft: 16 }}>
            Bill No.&nbsp;
            <span style={{ ...underline, minWidth: 100, fontWeight: 700 }}>
              {d.bill_no || ''}
            </span>
          </span>
        </div>
        {/* Row 2 */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <span style={{ minWidth: 38 }}></span>
          <span style={{ flex: 1, ...underline, minWidth: 10, fontSize: 12, minHeight: 18 }}>
            {d.route || ''}
          </span>
          <span style={{ whiteSpace: 'nowrap', fontSize: 12, marginLeft: 16 }}>
            Date&nbsp;
            <span style={{ ...underline, minWidth: 90, fontWeight: 700 }}>
              {d.date || ''}
            </span>
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════
          DUTY SLIP / CAR TYPE / CAR NO
      ══════════════════════════════════ */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        padding: '5px 22px', borderBottom: '1px solid #bbb', fontSize: 12,
      }}>
        <span><strong>Duty Slip</strong>&nbsp;
          <span style={{ ...underline, minWidth: 65 }}>{d.duty_slip || ''}</span>
        </span>
        <span style={{ textAlign: 'center' }}><strong>Car type</strong>&nbsp;
          <span style={{ ...underline, minWidth: 55 }}>{d.car_type || ''}</span>
        </span>
        <span style={{ textAlign: 'right' }}><strong>Car No.</strong>&nbsp;
          <span style={{ fontWeight: 700 }}>{d.car_no || ''}</span>
        </span>
      </div>

      {/* ══════════════════════════════════
          TABLE HEADER
      ══════════════════════════════════ */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 110px',
        background: '#f0f0f0', padding: '5px 22px',
        borderBottom: '1px solid #bbb', fontWeight: 700, fontSize: 12,
      }}>
        <span style={{ textAlign: 'center' }}>Particulars</span>
        <span style={{ textAlign: 'right', borderLeft: '1px solid #bbb', paddingLeft: 8 }}>
          Rs.&nbsp; Amount&nbsp; P.
        </span>
      </div>

      {/* ══════════════════════════════════
          BODY: Particulars + Amount
      ══════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', minHeight: 310 }}>

        {/* LEFT: rows */}
        <div style={{ padding: '12px 22px 10px', borderRight: '1px solid #bbb' }}>

          {/* Particulars */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
            <span style={{ minWidth: 72 }}>Particulars</span>
            <span style={{ ...underline, minWidth: 95 }}>&nbsp;</span>
            <span>{d.particulars_rate || '4 Hrs. 40 Km.  /  8Hrs. 80Km.'}</span>
          </div>

          {/* Total KMs */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 16 }}>
            <span style={{ minWidth: 72 }}>Total Kms.</span>
            <span style={{ ...underline, minWidth: 60, fontWeight: d.total_kms ? 700 : 400 }}>
              {d.total_kms || ''}
            </span>
            <span style={{ marginLeft: 6 }}>Extra</span>
            <span style={{ ...underline, minWidth: 50 }}>{d.extra_kms || ''}</span>
            <span style={{ marginLeft: 4 }}>@</span>
            <span style={{ ...underline, minWidth: 50 }}>{d.extra_kms_rate || ''}</span>
          </div>

          {/* Total Hrs */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 16 }}>
            <span style={{ minWidth: 72 }}>Total Hrs.</span>
            <span style={{ ...underline, minWidth: 60 }}>{d.total_hrs || ''}</span>
            <span style={{ marginLeft: 6 }}>Extra</span>
            <span style={{ ...underline, minWidth: 50 }}>{d.extra_hrs || ''}</span>
            <span style={{ marginLeft: 4 }}>@</span>
            <span style={{ ...underline, minWidth: 50 }}>{d.extra_hrs_rate || ''}</span>
          </div>

          {/* Outstation */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 16 }}>
            <span style={{ minWidth: 72 }}>Outstation</span>
            <span style={{ ...underline, minWidth: 75 }}>{d.outstation || ''}</span>
            <span style={{ marginLeft: 4 }}>Extra</span>
            <span style={{ ...underline, minWidth: 48 }}>{d.outstation_extra || ''}</span>
            <span style={{ marginLeft: 4 }}>@</span>
            <span style={{ ...underline, minWidth: 48 }}>{d.outstation_rate || ''}</span>
          </div>

          {/* Toll/Parking */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
            <span>Toll /Parking</span>
            <span style={{ ...underline, minWidth: 108 }}>{d.toll_parking || ''}</span>
            <span style={{ flex: 1 }} />
            <span style={{ ...underline, minWidth: 55, textAlign: 'right' }}>
              {d.toll_amount || ''}
            </span>
          </div>

          {/* Driver allowance */}
          <div style={{ marginBottom: 16 }}>
            Driver's Food/Overnight/outstation Allowance
            <span style={{ ...underline, minWidth: 118, marginLeft: 4 }}>
              {d.driver_allowance || ''}
            </span>
          </div>

          {/* Car used by */}
          <div style={{ marginBottom: 16 }}>
            Car used by&nbsp;
            <span style={{ ...underline, minWidth: 108 }}>{d.car_used_by || ''}</span>
          </div>

          {/* Car booked by */}
          <div>
            Car Booked by&nbsp;{d.car_booked_by || ''}
          </div>
        </div>

        {/* RIGHT: amount summary breakdown */}
        <div style={{ padding: '12px 10px 0', textAlign: 'right', fontWeight: 600, fontSize: 14 }}>
           {(d.trip_cost > 0 || d.amount) && (
             <div style={{ marginBottom: 8 }}>{d.trip_cost ? parseInt(d.trip_cost).toLocaleString('en-IN') : parseInt(d.amount).toLocaleString('en-IN')} KM</div>
           )}
           {d.toll > 0 && (
             <div style={{ marginBottom: 8 }}>{parseInt(d.toll).toLocaleString('en-IN')} Toll</div>
           )}
           {d.da > 0 && (
             <div style={{ marginBottom: 8 }}>{parseInt(d.da).toLocaleString('en-IN')} DA</div>
           )}
           {d.outstation > 0 && (
             <div style={{ marginBottom: 8 }}>{parseInt(d.outstation).toLocaleString('en-IN')} Outstation</div>
           )}
        </div>
      </div>

      {/* ══════════════════════════════════
          TOTAL BAR
      ══════════════════════════════════ */}
      <div style={{
        borderTop: '2px solid #333', padding: '7px 22px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #bbb',
      }}>
        <span style={{ fontSize: 11 }}>
          <strong>PAN CARD NO : CBHPS4753G</strong>&nbsp;&nbsp;&nbsp; E. &amp; O. E.
        </span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>
          Total = ₹&nbsp;&nbsp;
          <span style={{ borderBottom: '1px solid #333', minWidth: 90, display: 'inline-block', fontSize: 15, fontWeight: 700, textAlign: 'center' }}>
            {d.final_total ? `${parseInt(d.final_total).toLocaleString('en-IN')} /-` : (d.amount ? `${parseInt(d.amount).toLocaleString('en-IN')} /-` : '')}
          </span>
        </span>
      </div>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 195px', padding: '10px 22px', gap: 16, alignItems: 'flex-start' }}>

        {/* Disclaimer */}
        <div style={{ fontSize: 9.5, color: '#444', lineHeight: 1.9 }}>
          * &nbsp;No. disputes of objections will be entertained if not brought to our notice, within 10 days from the date from the date of hereof<br />
          * &nbsp;Interest @10%P.A. will be charged on accounts not settled within 30 days.
        </div>

        {/* Stamp + Signature block */}
        <div style={{ textAlign: 'right' }}>
          {/* "For Rajput Tours & Travels" */}
          <div style={{ fontSize: 11, marginBottom: 3 }}>
            For <span style={{ color: '#cc2200', fontWeight: 700 }}>Rajput Tours &amp; Travels</span>
          </div>

          {/* STAMP — "RAJPUT TOUR AND TRAVELS / PROPRIETOR" in blue */}
          <div style={{ marginBottom: 2, display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
            <img
              src={stampImg}
              alt="RAJPUT TOUR AND TRAVELS PROPRIETOR"
              style={{
                width: 170,
                objectFit: 'contain',
              }}
            />
            {/* Handwritten signature overlapping */}
            <img
              src={signatureImg}
              alt="Signature"
              style={{
                width: 80,
                objectFit: 'contain',
                position: 'absolute',
                right: 30, // pulls it neatly over the stamp text
                bottom: -15, // drops it down specifically over the bottom
                opacity: 0.9,
                mixBlendMode: 'multiply' // visually merges ink layers
              }}
            />
          </div>

          <div style={{ fontSize: 11, marginTop: 15 }}>Proprietor</div>
        </div>
      </div>
    </div>
  )
}
