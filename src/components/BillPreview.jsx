import React from 'react'
import { useAssets } from '../contexts/AssetsContext'

export default function BillPreview({ data, noBorderRadius }) {
  const d = data || {}
  const { logoUrl: carLogo, stampUrl: stampImg, signatureUrl: signatureImg } = useAssets()

  const LineWrap = ({ width, val }) => (
    <span style={{ position: 'relative', display: 'inline-block', width: width, borderBottom: '1px solid #000', margin: '0 4px', textAlign: 'center', lineHeight: 1.2 }}>
      <span style={{ position: 'absolute', bottom: 2, left: 0, right: 0, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{val || ''}</span>
      &nbsp;
    </span>
  )

  const printAmt = (val) => {
    if (!val || val == 0) return ''
    return parseInt(val).toLocaleString('en-IN')
  }

  return (
    <div style={{
      background: '#fff', color: '#000', fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 12, width: 620, border: '1px solid #000', borderRadius: noBorderRadius ? 0 : 22,
      overflow: 'hidden', boxSizing: 'border-box', margin: '0 auto', position: 'relative'
    }}>
      
      {/* HEADER */}
      <div style={{ padding: '24px 20px 10px', position: 'relative' }}>
        <div style={{ position: 'absolute', right: 24, top: 24, fontSize: 12, fontWeight: 700, fontFamily: 'Arial', color: '#333' }}>
          Mob : 7304315584
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          <img
            src={carLogo} alt="car"
            style={{ width: 110, height: 60, objectFit: 'contain', flexShrink: 0, marginLeft: 10, alignSelf: 'flex-start', marginTop: 10 }}
          />
          <div style={{ flex: 1, textAlign: 'center', paddingRight: 35 }}>
            <div style={{
              fontSize: 34, fontWeight: 900, color: '#e32929',
              fontFamily: 'Georgia, "Times New Roman", serif',
              letterSpacing: 0.5, lineHeight: 1.1, marginBottom: 8,
              WebkitTextStroke: '0.5px #cc0000', // Subtle stroke to mimic the thick printed red
            }}>
              Rajput Tour &amp; Travels
            </div>
            <div style={{ fontSize: 11, color: '#222', fontWeight: 600, letterSpacing: 0.2 }}>
              Flat No - 706, Bldg No - 14, H - 1, Shradha Sabri Society, Sanghrsh Nagar,
            </div>
            <div style={{ fontSize: 11, color: '#222', fontWeight: 600, letterSpacing: 0.2 }}>
              Chandivali, Andheri (E) Mumbai - 400 072 | Email : rajputtoursandtravels2016@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* M/S + BILL NO + DATE */}
      <div style={{ padding: '16px 20px', borderTop: '2px solid #000', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
          <span style={{ fontWeight: 700, fontSize: 12, marginRight: 4, transform: 'translateY(-2px)' }}>M/s.</span>
          <span style={{ borderBottom: '1px solid #000', flex: 1, position: 'relative', margin: '0 8px' }}>
            <span style={{ position: 'absolute', bottom: 2, left: 10, fontSize: 13, fontWeight: 700 }}>{d.client_name || d.party_name || ''}</span>
            &nbsp;
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', transform: 'translateY(-2px)' }}>Bill No.</span>
          <span style={{ borderBottom: '1px solid #000', width: '130px', position: 'relative', marginLeft: 8 }}>
            <span style={{ position: 'absolute', bottom: 2, left: 10, fontSize: 13, fontWeight: 700 }}>{d.bill_no || ''}</span>
            &nbsp;
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', width: '100%' }}>
           <span style={{ borderBottom: '1px solid #000', width: '300px' }}>&nbsp;</span>
           <span style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 8, transform: 'translateY(-2px)' }}>Date</span>
           <span style={{ borderBottom: '1px solid #000', width: '130px', position: 'relative', marginLeft: 8 }}>
            <span style={{ position: 'absolute', bottom: 2, left: 10, fontSize: 13, fontWeight: 700 }}>{d.date || ''}</span>
            &nbsp;
          </span>
        </div>
      </div>

      {/* DUTY SLIP / CAR TYPE / CAR NO */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '2px 20px 8px', fontSize: 12, fontWeight: 700, alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', width: '40%' }}>
           Duty Slip <span style={{ borderBottom: '1px solid #000', flex: 1, position: 'relative', marginLeft: 8 }}><span style={{position:'absolute', bottom: 2, left: 10}}>{d.duty_slip || ''}</span>&nbsp;</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', width: '25%' }}>
           Car type <span style={{ borderBottom: '1px solid #000', flex: 1, position: 'relative', marginLeft: 8 }}><span style={{position:'absolute', bottom: 2, left: 10}}>{d.car_type || ''}</span>&nbsp;</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', width: '25%' }}>
           Car No. <span style={{ borderBottom: '1px solid #000', flex: 1, position: 'relative', marginLeft: 8 }}><span style={{position:'absolute', bottom: 2, left: 10}}>{d.car_no || ''}</span>&nbsp;</span>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 110px',
        borderBottom: '1px solid #000', borderTop: '1px solid #000', fontWeight: 700, fontSize: 12,
      }}>
        <div style={{ textAlign: 'center', padding: '6px 0' }}>Particulars</div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid #000', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '2px 0 0', fontSize: 11, fontWeight: 700 }}>Amount</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 4px', fontSize: 11, fontWeight: 700 }}>
             <span>Rs.</span><span>P.</span>
          </div>
        </div>
      </div>

      {/* TABLE BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', minHeight: 460 }}>
        {/* LEFT PANE */}
        <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 32, fontSize: 12, color: '#222' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Particulars</span>
            <LineWrap width="160px" val={d.particulars_rate?.split(' ')[0] || ''} />
            <span style={{ fontSize: 12 }}>{d.particulars_rate || '4 Hrs. 40 Km. / 8Hrs. 80Km.'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span style={{ width: 65 }}>Total Kms.</span>
            <LineWrap width="80px" val={d.total_kms || d.total_km || ''} />
            <span style={{ width: 40, textAlign: 'center' }}>Extra</span>
            <LineWrap width="90px" val={d.extra_kms || d.extra_km || ''} />
            <span style={{ width: 20, textAlign: 'center' }}>@</span>
            <LineWrap width="90px" val={d.extra_kms_rate || d.rate_per_km || ''} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span style={{ width: 65 }}>Total Hrs.</span>
            <LineWrap width="80px" val={d.total_hrs || d.total_hours || ''} />
            <span style={{ width: 40, textAlign: 'center' }}>Extra</span>
            <LineWrap width="90px" val={d.extra_hrs || ''} />
            <span style={{ width: 20, textAlign: 'center' }}>@</span>
            <LineWrap width="90px" val={d.extra_hrs_rate || ''} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span style={{ width: 65 }}>Outstation</span>
            <LineWrap width="80px" val={d.outstation || ''} />
            <span style={{ width: 40, textAlign: 'center' }}>Extra</span>
            <LineWrap width="90px" val={d.outstation_extra || ''} />
            <span style={{ width: 20, textAlign: 'center' }}>@</span>
            <LineWrap width="90px" val={d.outstation_rate || ''} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span style={{ width: 80 }}>Toll /Parking</span>
            <LineWrap width="110px" val={d.toll_parking || ''} />
            <span style={{ width: 50 }}></span>
            <LineWrap width="100px" val="" />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Driver's Food/Overnight/outstation Allowance</span>
            <LineWrap width="160px" val={d.driver_allowance || d.da || ''} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
            <span>Car used by</span>
            <LineWrap width="110px" val={d.car_used_by || ''} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap', marginTop: 10 }}>
            <span>Car Booked by</span>
            <span style={{ paddingLeft: 8, fontWeight: 700, fontSize: 13 }}>{d.car_booked_by || ''}</span>
          </div>

        </div>

        {/* RIGHT PANE (Amounts) */}
        <div style={{ borderLeft: '1px solid #000', display: 'flex', flexDirection: 'column', gap: 32, padding: '24px 8px 16px', position: 'relative' }}>
           {/* Positioned exactly matching the lines on the left visually */}
           <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 14, marginTop: 4 }}>{printAmt(d.trip_cost || d.amount)}</div>
           <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 14, marginTop: 12 }}></div>
           <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 14, marginTop: 12 }}></div>
           <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 14, marginTop: 12 }}>{printAmt(d.outstation)}</div>
           <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 14, marginTop: 12 }}>{printAmt(d.toll_amount || d.toll)}</div>
           <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 14, marginTop: 12 }}>{printAmt(d.da || d.driver_allowance)}</div>
        </div>
      </div>

      {/* TOTAL BAR */}
      <div style={{
        borderTop: '1px solid #000', display: 'flex', borderBottom: '1px solid #000', alignItems: 'center'
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '6px 16px' }}>
           <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Arial' }}>PAN CARD NO : CBHPS4753G</div>
           <div style={{ fontSize: 12, fontWeight: 800, fontFamily: 'Arial', flex: 1, textAlign: 'center' }}>E. &amp; O. E.</div>
           <div style={{ fontSize: 13, fontWeight: 700, paddingRight: 8 }}>Total</div>
        </div>
        <div style={{ width: 110, borderLeft: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '6px 0' }}>
           <span style={{ fontSize: 15, fontWeight: 700 }}>
             {d.final_total ? `${printAmt(d.final_total)}` : (parseInt(d.amount) ? `${printAmt(d.amount)}` : '')}
           </span>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', padding: '10px 16px 12px', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 10.5, color: '#111', lineHeight: 1.4, fontFamily: 'Arial' }}>
          * &nbsp;No. disputes of objections will be entertained if not brought to<br/>
            &nbsp;&nbsp;&nbsp;our notice, within 10 days from the date from the date of<br/>
            &nbsp;&nbsp;&nbsp;hereof<br />
          * &nbsp;Interest @10%P.A. will be charged on accounts not settled<br/>
            &nbsp;&nbsp;&nbsp;within 30 days.
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, marginBottom: 8, fontFamily: 'Arial' }}>
            For <span style={{ color: '#d32f2f', fontWeight: 700, fontSize: 12 }}>Rajput Tours &amp; Travels</span>
          </div>
          <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'center', position: 'relative', height: 45 }}>
            {stampImg && <img src={stampImg} alt="Stamp" style={{ width: 140, objectFit: 'contain' }} />}
            {signatureImg && (
              <img src={signatureImg} alt="Signature" style={{
                width: 75, objectFit: 'contain', position: 'absolute', right: 25, bottom: -12, opacity: 0.9, mixBlendMode: 'multiply'
              }} />
            )}
            {!stampImg && !signatureImg && (
              <div style={{ color: 'transparent', height: 40 }}>Stamp Area</div>
            )}
          </div>
          <div style={{ fontSize: 12, marginTop: 15, fontWeight: 700, fontFamily: 'Arial', paddingLeft: 20 }}>Proprietor</div>
        </div>
      </div>
    </div>
  )
}
