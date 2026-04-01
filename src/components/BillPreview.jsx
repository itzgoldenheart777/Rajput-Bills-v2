import React from 'react'
import { useAssets } from '../contexts/AssetsContext'

export default function BillPreview({ data, noBorderRadius }) {
  const d = data || {}
  const { logoUrl: carLogo, stampUrl: stampImg, signatureUrl: signatureImg } = useAssets()

  const LineWrap = ({ children, width, val }) => (
    <span style={{ position: 'relative', display: 'inline-block', width: width, borderBottom: '1px solid #111', margin: '0 4px', textAlign: 'center', lineHeight: 1.2 }}>
      <span style={{ position: 'absolute', bottom: 2, left: 0, right: 0, fontSize: 13, fontWeight: 700 }}>{val}</span>
      &nbsp;
    </span>
  )

  const BigAmt = ({ label, val }) => {
    if (!val || val == 0) return null
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, fontSize: 15, fontWeight: 700, paddingRight: 8 }}>
        <span style={{ minWidth: 60, textAlign: 'right' }}>{parseInt(val).toLocaleString('en-IN')}</span>
        <span style={{ minWidth: 40, textAlign: 'right', marginLeft: 8 }}>{label}</span>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff',
      color: '#000',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 12,
      width: 620,
      border: '1px solid #000',
      borderRadius: noBorderRadius ? 0 : 20,
      overflow: 'hidden',
      boxSizing: 'border-box',
      lineHeight: 1.5,
      margin: '0 auto',
    }}>
      
      {/* HEADER */}
      <div style={{ padding: '12px 16px 8px', position: 'relative' }}>
        <div style={{ position: 'absolute', right: 20, top: 12, fontSize: 12, fontWeight: 700, fontFamily: 'Arial' }}>
          Mob : 7304315584
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 14 }}>
          <img
            src={carLogo}
            alt="car"
            style={{ width: 110, height: 50, objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ flex: 1, textAlign: 'center', paddingRight: 20 }}>
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

      {/* M/S + BILL NO + DATE */}
      <div style={{ padding: '6px 16px', borderTop: '1px solid #000', borderBottom: '1px solid #000', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: 700, fontSize: 12, marginRight: 2 }}>M/s.</span>
          <LineWrap width="100%" val={d.client_name || d.party_name || ''} />
          <span style={{ fontSize: 12, marginLeft: 16, fontWeight: 700, whiteSpace: 'nowrap' }}>Bill No.</span>
          <LineWrap width="140px" val={d.bill_no || ''} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <LineWrap width="100%" val={d.route || d.trip_route || ''} />
          <span style={{ fontSize: 12, marginLeft: 16, fontWeight: 700, whiteSpace: 'nowrap' }}>Date</span>
          <LineWrap width="140px" val={d.date || ''} />
        </div>
      </div>

      {/* DUTY SLIP / CAR TYPE / CAR NO */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 30,
        padding: '6px 16px', borderBottom: '1px solid #000', fontSize: 12, fontWeight: 700, alignItems: 'center'
      }}>
        <div>Duty Slip <LineWrap width="80px" val={d.duty_slip || ''} /></div>
        <div>Car type <LineWrap width="60px" val={d.car_type || ''} /></div>
        <div>Car No. <LineWrap width="90px" val={d.car_no || ''} /></div>
      </div>

      {/* TABLE HEADER */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 115px',
        borderBottom: '1px solid #000', fontWeight: 700, fontSize: 12,
      }}>
        <div style={{ textAlign: 'center', padding: '6px 0' }}>Particulars</div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid #000', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '2px 0' }}>Amount</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
             <span>Rs.</span><span>P.</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 115px', minHeight: 400 }}>
        {/* LEFT: Rows mapping EXACTLY to the print image */}
        <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 24, fontSize: 12 }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Particulars</span>
            <LineWrap width="120px" val="" />
            <span style={{ flex: 1 }}>4 Hrs. 40 Km. / 8Hrs. 80Km.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Total Kms.</span>
            <LineWrap width="80px" val={d.total_kms || d.total_km || ''} />
            <span style={{ marginLeft: 8 }}>Extra</span>
            <LineWrap width="70px" val={d.extra_kms || d.extra_km || ''} />
            <span style={{ marginLeft: 8 }}>@</span>
            <LineWrap width="70px" val={d.extra_kms_rate || d.rate_per_km || ''} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Total Hrs.</span>
            <LineWrap width="80px" val={d.total_hrs || d.total_hours || ''} />
            <span style={{ marginLeft: 8 }}>Extra</span>
            <LineWrap width="70px" val={d.extra_hrs || ''} />
            <span style={{ marginLeft: 8 }}>@</span>
            <LineWrap width="70px" val={d.extra_hrs_rate || ''} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Outstation</span>
            <LineWrap width="80px" val={d.outstation || ''} />
            <span style={{ marginLeft: 8 }}>Extra</span>
            <LineWrap width="70px" val={d.outstation_extra || ''} />
            <span style={{ marginLeft: 8 }}>@</span>
            <LineWrap width="70px" val={d.outstation_rate || ''} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Toll /Parking</span>
            <LineWrap width="140px" val={d.toll_parking || ''} />
            <div style={{ flex: 1 }} />
            <LineWrap width="80px" val="" />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Driver's Food/Overnight/outstation Allowance</span>
            <span style={{ flex: 1 }}>
              <LineWrap width="100%" val={d.driver_allowance || d.da || ''} />
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Car used by</span>
            <span style={{ flex: 1, paddingLeft: 4 }}>
              <LineWrap width="140px" val={d.car_used_by || ''} />
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Car Booked by</span>
            <span style={{ paddingLeft: 4, fontWeight: 700 }}>{d.car_booked_by || ''}</span>
          </div>

        </div>

        {/* RIGHT: Numeric break down */}
        <div style={{ padding: '36px 4px 16px', borderLeft: '1px solid #000', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 10 }}>
           <BigAmt label="KM" val={d.trip_cost || d.amount} />
           <BigAmt label="Toll" val={d.toll_amount || d.toll} />
           <BigAmt label="DA" val={d.da || d.driver_allowance} />
           <BigAmt label="OS" val={d.outstation} />
        </div>
      </div>

      {/* TOTAL BAR */}
      <div style={{
        borderTop: '1px solid #000', padding: '6px 0',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto 115px',
        borderBottom: '1px solid #000', alignItems: 'center'
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, paddingLeft: 16 }}>PAN CARD NO : CBHPS4753G</div>
        <div style={{ fontSize: 11, fontWeight: 700, paddingRight: 40 }}>E. &amp; O. E.</div>
        <div style={{ fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'relative', left: -30 }}>Total</span>
          <span style={{ width: '100%', textAlign: 'center', fontSize: 14 }}>
            {d.final_total ? `${parseInt(d.final_total).toLocaleString('en-IN')} /-` : (d.amount ? `${parseInt(d.amount).toLocaleString('en-IN')} /-` : '')}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px', padding: '8px 16px 16px', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 9.5, color: '#333', lineHeight: 1.5, paddingTop: 4 }}>
          * &nbsp;No. disputes of objections will be entertained if not brought to our notice, within 10 days from the date from the date of hereof<br />
          * &nbsp;Interest @10%P.A. will be charged on accounts not settled within 30 days.
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, marginBottom: 4 }}>
            For <span style={{ color: '#d32f2f', fontWeight: 700, fontSize: 11 }}>Rajput Tours &amp; Travels</span>
          </div>
          <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'center', position: 'relative', height: 45 }}>
            {stampImg && <img src={stampImg} alt="Stamp" style={{ width: 140, objectFit: 'contain' }} />}
            {signatureImg && (
              <img src={signatureImg} alt="Signature" style={{
                width: 65, objectFit: 'contain', position: 'absolute', right: 25, bottom: -8, opacity: 0.9, mixBlendMode: 'multiply'
              }} />
            )}
          </div>
          <div style={{ fontSize: 11, marginTop: 15, fontWeight: 700 }}>Proprietor</div>
        </div>
      </div>
    </div>
  )
}
