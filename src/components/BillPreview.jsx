import React from 'react'
import { useAssets } from '../contexts/AssetsContext'

export default function BillPreview({ data, noBorderRadius }) {
  const d = data || {}
  const { logoUrl: carLogo, stampUrl: stampImg, signatureUrl: signatureImg } = useAssets()

  const underline = {
    display: 'inline-block',
    borderBottom: '1px solid #111',
    verticalAlign: 'bottom',
    paddingBottom: 2,
    margin: '0 4px',
  }

  return (
    <div style={{
      background: '#fff',
      color: '#000',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 12,
      width: 620,
      border: '1px solid #111',
      borderRadius: noBorderRadius ? 0 : 20, // To avoid rounding corners when saving to JPG if needed, though they want it looking exact. It has 20px radius in the picture.
      overflow: 'hidden',
      boxSizing: 'border-box',
      lineHeight: 1.5,
    }}>

      {/* ══════════════════════════════════
          HEADER
      ══════════════════════════════════ */}
      <div style={{ padding: '16px 20px 8px', position: 'relative' }}>
        <div style={{ position: 'absolute', right: 20, top: 16, fontSize: 13, fontWeight: 700 }}>
          Mob : 7304315584
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          <img
            src={carLogo}
            alt="car"
            style={{ width: 120, height: 60, objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ flex: 1, textAlign: 'center', paddingRight: 40 }}>
            <div style={{
              fontSize: 34,
              fontWeight: 900,
              color: '#d32f2f',
              fontFamily: 'Georgia, "Times New Roman", serif',
              letterSpacing: 0.5,
              lineHeight: 1.1,
              marginBottom: 4,
            }}>
              Rajput Tour &amp; Travels
            </div>
            <div style={{ fontSize: 10, color: '#111', fontWeight: 600 }}>
              Flat No - 706, Bldg No - 14, H - 1, Shradha Sabri Society, Sanghrsh Nagar,
            </div>
            <div style={{ fontSize: 10, color: '#111', fontWeight: 600 }}>
              Chandivali, Andheri (E) Mumbai - 400 072 | Email : rajputtoursandtravels2016@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          M/S  +  BILL NO  +  DATE
      ══════════════════════════════════ */}
      <div style={{ padding: '8px 20px', borderTop: '2px solid #111', borderBottom: '1px solid #111', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: 700, fontSize: 13, marginRight: 4 }}>M/s.</span>
          <span style={{ flex: 1, ...underline, minHeight: 18, fontSize: 14, fontWeight: 700 }}>
            {d.client_name || d.party_name || ''}
          </span>
          <span style={{ fontSize: 12, marginLeft: 16, fontWeight: 700 }}>Bill No.</span>
          <span style={{ ...underline, minWidth: 150, fontWeight: 700 }}>
            {d.bill_no || ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <span style={{ flex: 1, ...underline, minHeight: 18, fontSize: 12 }}>
            {d.route || d.trip_route || ''}
          </span>
          <span style={{ fontSize: 12, marginLeft: 16, fontWeight: 700 }}>Date</span>
          <span style={{ ...underline, minWidth: 150, fontWeight: 700 }}>
            {d.date || ''}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════
          DUTY SLIP / CAR TYPE / CAR NO
      ══════════════════════════════════ */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 20,
        padding: '6px 20px', borderBottom: '1px solid #111', fontSize: 13, fontWeight: 700
      }}>
        <div>Duty Slip <span style={{ ...underline, minWidth: 80, fontWeight: 400 }}>{d.duty_slip || ''}</span></div>
        <div>Car type <span style={{ ...underline, minWidth: 60, fontWeight: 400 }}>{d.car_type || ''}</span></div>
        <div>Car No. <span style={{ minWidth: 80, display: 'inline-block', fontWeight: 700 }}>{d.car_no || ''}</span></div>
      </div>

      {/* ══════════════════════════════════
          TABLE HEADER
      ══════════════════════════════════ */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 140px',
        padding: '6px 20px', borderBottom: '1px solid #111', fontWeight: 700, fontSize: 13,
      }}>
        <div style={{ textAlign: 'center' }}>Particulars</div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid #111' }}>
          Amount <br/> Rs. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; P.
        </div>
      </div>

      {/* ══════════════════════════════════
          BODY
      ══════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', minHeight: 340 }}>
        {/* LEFT: rows */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ minWidth: 70 }}>Particulars</span>
            <span style={{ ...underline, flex: 1, maxWidth: 160 }}></span>
            <span style={{ fontSize: 11 }}>{d.particulars_rate || '4 Hrs. 40 Km. / 8Hrs. 80Km.'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ minWidth: 70 }}>Total Kms.</span>
            <span style={{ ...underline, width: 80, textAlign: 'center' }}>{d.total_kms || d.total_km || ''}</span>
            <span style={{ margin: '0 8px' }}>Extra</span>
            <span style={{ ...underline, width: 70, textAlign: 'center' }}>{d.extra_kms || d.extra_km || ''}</span>
            <span style={{ margin: '0 8px' }}>@</span>
            <span style={{ ...underline, width: 70, textAlign: 'center' }}>{d.extra_kms_rate || d.rate_per_km || ''}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ minWidth: 70 }}>Total Hrs.</span>
            <span style={{ ...underline, width: 80, textAlign: 'center' }}>{d.total_hrs || d.total_hours || ''}</span>
            <span style={{ margin: '0 8px' }}>Extra</span>
            <span style={{ ...underline, width: 70, textAlign: 'center' }}>{d.extra_hrs || ''}</span>
            <span style={{ margin: '0 8px' }}>@</span>
            <span style={{ ...underline, width: 70, textAlign: 'center' }}>{d.extra_hrs_rate || ''}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ minWidth: 70 }}>Outstation</span>
            <span style={{ ...underline, width: 80, textAlign: 'center' }}>{d.outstation || ''}</span>
            <span style={{ margin: '0 8px' }}>Extra</span>
            <span style={{ ...underline, width: 70, textAlign: 'center' }}>{d.outstation_extra || ''}</span>
            <span style={{ margin: '0 8px' }}>@</span>
            <span style={{ ...underline, width: 70, textAlign: 'center' }}>{d.outstation_rate || ''}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <div>
              Toll /Parking
              <span style={{ ...underline, width: 140, marginLeft: 8 }}>{d.toll_parking || ''}</span>
            </div>
            <div style={{ flex: 1 }} />
            <span style={{ ...underline, width: 80, textAlign: 'center' }}>{d.toll_amount || d.toll || ''}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span>Driver's Food/Overnight/outstation Allowance</span>
            <span style={{ ...underline, width: 180, marginLeft: 8, textAlign: 'center' }}>
              {d.driver_allowance || d.da || ''}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 8 }}>
            Car used by
            <span style={{ ...underline, width: 220, marginLeft: 8 }}>{d.car_used_by || ''}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            Car Booked by
            <span style={{ marginLeft: 8 }}>{d.car_booked_by || ''}</span>
          </div>

        </div>

        {/* RIGHT: amount */}
        <div style={{ padding: '16px 12px', borderLeft: '1px solid #111', textAlign: 'right', fontWeight: 700, fontSize: 14 }}>
           {(d.trip_cost > 0 || d.amount) && (
             <div style={{ marginBottom: 12 }}>{d.trip_cost ? parseInt(d.trip_cost).toLocaleString('en-IN') : parseInt(d.amount).toLocaleString('en-IN')} KM</div>
           )}
           {(d.toll > 0 || d.toll_amount > 0) && (
             <div style={{ marginBottom: 12 }}>{d.toll ? parseInt(d.toll).toLocaleString('en-IN') : parseInt(d.toll_amount).toLocaleString('en-IN')} Toll</div>
           )}
           {(d.da > 0 || d.driver_allowance) && (
             <div style={{ marginBottom: 12 }}>{parseInt(d.da || d.driver_allowance).toLocaleString('en-IN')} DA</div>
           )}
           {d.outstation > 0 && (
             <div style={{ marginBottom: 12 }}>{parseInt(d.outstation).toLocaleString('en-IN')} OS</div>
           )}
        </div>
      </div>

      {/* ══════════════════════════════════
          TOTAL BAR
      ══════════════════════════════════ */}
      <div style={{
        borderTop: '2px solid #111', padding: '8px 20px',
        display: 'grid', gridTemplateColumns: '1fr 140px',
        borderBottom: '1px solid #111',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>PAN CARD NO : CBHPS4753G</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>E. &amp; O. E.</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          <span>Total</span>
          <span style={{ ...underline, flex: 1, minWidth: 90, textAlign: 'center', margin: '0 0 0 8px', fontSize: 15 }}>
            {d.final_total ? `${parseInt(d.final_total).toLocaleString('en-IN')} /-` : (d.amount ? `${parseInt(d.amount).toLocaleString('en-IN')} /-` : '')}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 195px', padding: '12px 20px 16px', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 10, color: '#333', lineHeight: 1.6 }}>
          * &nbsp;No. disputes of objections will be entertained if not brought to our notice, within 10 days from the date from the date of hereof<br />
          * &nbsp;Interest @10%P.A. will be charged on accounts not settled within 30 days.
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, marginBottom: 8 }}>
            For <span style={{ color: '#d32f2f', fontWeight: 700 }}>Rajput Tours &amp; Travels</span>
          </div>
          <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'center', position: 'relative', height: 40 }}>
            {stampImg && <img src={stampImg} alt="Stamp" style={{ width: 150, objectFit: 'contain' }} />}
            {signatureImg && (
              <img src={signatureImg} alt="Signature" style={{
                width: 70, objectFit: 'contain', position: 'absolute', right: 30, bottom: -10, opacity: 0.9, mixBlendMode: 'multiply'
              }} />
            )}
          </div>
          <div style={{ fontSize: 11, marginTop: 15, fontWeight: 700 }}>Proprietor</div>
        </div>
      </div>
    </div>
  )
}
