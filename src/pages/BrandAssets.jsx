import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const ASSETS = [
  {
    key: 'logo',
    label: 'Company Logo',
    desc: 'Shown in the top-left of every bill. Use a transparent PNG for best results.',
    icon: '🏢',
    accept: 'image/png,image/webp,image/svg+xml',
    hint: 'PNG with transparent background recommended',
  },
  {
    key: 'stamp',
    label: 'Company Stamp',
    desc: 'Stamp image shown in the bill footer. Use a transparent PNG.',
    icon: '📮',
    accept: 'image/png,image/webp',
    hint: 'PNG with transparent background recommended',
  },
  {
    key: 'signature',
    label: 'Proprietor Signature',
    desc: 'Signature shown in the bill footer. Use a transparent PNG.',
    icon: '✍️',
    accept: 'image/png,image/webp',
    hint: 'PNG with transparent background recommended',
  },
]

const BUCKET = 'brand-assets'

async function getPublicUrl(key) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key + '.png')
  return data?.publicUrl || null
}

async function uploadAsset(key, file) {
  const ext = file.name.split('.').pop()
  const path = `${key}.${ext}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function loadAllAssetUrls() {
  const results = {}
  for (const asset of ASSETS) {
    try {
      // Try png first, then webp
      for (const ext of ['png', 'webp', 'svg']) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${asset.key}.${ext}`)
        if (data?.publicUrl) {
          // Check if it actually exists by a HEAD request trick - just store and verify in img onError
          results[asset.key] = data.publicUrl
          break
        }
      }
    } catch (_) {}
  }
  return results
}

function UploadZone({ assetDef, currentUrl, onUploaded }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [preview, setPreview] = useState(currentUrl)
  const inputRef = useRef()

  useEffect(() => { setPreview(currentUrl) }, [currentUrl])

  const handleFile = async (file) => {
    if (!file) return
    setErr(null)
    setLoading(true)
    try {
      const url = await uploadAsset(assetDef.key, file)
      // Add cache-buster so browser reloads the image
      setPreview(url + '?t=' + Date.now())
      onUploaded && onUploaded(assetDef.key, url)
    } catch (e) {
      setErr(e.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(200,153,58,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>{assetDef.icon}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text1)' }}>{assetDef.label}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{assetDef.desc}</div>
        </div>
      </div>

      {/* Preview area */}
      <div style={{
        background: 'repeating-conic-gradient(#333 0% 25%, #2a2a2a 0% 50%) 0 0 / 20px 20px',
        borderRadius: 10,
        minHeight: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {preview ? (
          <img
            src={preview}
            alt={assetDef.label}
            style={{ maxWidth: '100%', maxHeight: 130, objectFit: 'contain' }}
            onError={() => setPreview(null)}
          />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>🖼️</div>
            No image uploaded yet
          </div>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 10,
          padding: '20px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
          background: dragging ? 'rgba(200,153,58,0.06)' : 'transparent',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={assetDef.accept}
          onChange={onInputChange}
          style={{ display: 'none' }}
        />
        {loading ? (
          <div style={{ color: 'var(--accent)', fontSize: 13 }}>⏳ Uploading...</div>
        ) : (
          <>
            <div style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>
              Drop image here or <span style={{ color: 'var(--accent)', fontWeight: 600 }}>click to browse</span>
            </div>
            <div style={{ color: 'var(--text3)', fontSize: 11 }}>{assetDef.hint}</div>
          </>
        )}
      </div>

      {err && (
        <div style={{
          background: 'rgba(220,50,50,0.1)',
          border: '1px solid rgba(220,50,50,0.3)',
          borderRadius: 8,
          padding: '10px 14px',
          color: '#ff6b6b',
          fontSize: 13,
        }}>
          ⚠️ {err}
        </div>
      )}

      {preview && (
        <div style={{
          background: 'rgba(50,200,100,0.08)',
          border: '1px solid rgba(50,200,100,0.2)',
          borderRadius: 8,
          padding: '9px 14px',
          color: '#5de897',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>✅</span>
          <span>Saved to Supabase Storage — used automatically in all bills</span>
        </div>
      )}
    </div>
  )
}

export default function BrandAssets() {
  const [urls, setUrls] = useState({})
  const [loading, setLoading] = useState(true)
  const [bucketError, setBucketError] = useState(null)
  
  const [savedCars, setSavedCars] = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedCars')) || [] } catch { return [] }
  })
  const [newCarNo, setNewCarNo] = useState('')
  const [newCarType, setNewCarType] = useState('')

  const handleAddCar = () => {
    if (!newCarNo || !newCarType) return
    const updated = [...savedCars, { no: newCarNo.toUpperCase(), type: newCarType }]
    setSavedCars(updated)
    localStorage.setItem('savedCars', JSON.stringify(updated))
    setNewCarNo('')
    setNewCarType('')
  }
  
  const handleDeleteCar = (i) => {
    const updated = savedCars.filter((_, idx) => idx !== i)
    setSavedCars(updated)
    localStorage.setItem('savedCars', JSON.stringify(updated))
  }

  useEffect(() => {
    setLoading(true)
    loadAllAssetUrls()
      .then(setUrls)
      .catch(e => setBucketError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleUploaded = (key, url) => {
    setUrls(prev => ({ ...prev, [key]: url }))
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text1)', margin: 0 }}>
          Brand Assets
        </h1>
        <p style={{ color: 'var(--text2)', marginTop: 8, fontSize: 14 }}>
          Upload your logo, stamp, and signature. They are stored in Supabase Storage
          and used automatically in every bill preview and printout.
        </p>
      </div>

      {bucketError && (
        <div style={{
          background: 'rgba(220,50,50,0.1)',
          border: '1px solid rgba(220,50,50,0.3)',
          borderRadius: 12,
          padding: '16px 20px',
          color: '#ff6b6b',
          fontSize: 13,
          marginBottom: 24,
        }}>
          <strong>⚠️ Storage Error:</strong> {bucketError}
          <br />
          <span style={{ color: 'var(--text3)', fontSize: 12, marginTop: 6, display: 'block' }}>
            Make sure you have created a public Supabase Storage bucket named <code style={{ color: 'var(--accent)' }}>brand-assets</code>.
            See the SQL schema file for setup instructions.
          </span>
        </div>
      )}

      {/* Setup instructions panel */}
      <div style={{
        background: 'rgba(200,153,58,0.06)',
        border: '1px solid rgba(200,153,58,0.2)',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 28,
        fontSize: 13,
      }}>
        <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>
          📦 One-time Supabase Setup Required
        </div>
        <div style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
          Go to your Supabase Dashboard → Storage → Create a new bucket named{' '}
          <code style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4, color: 'var(--accent2)' }}>
            brand-assets
          </code>{' '}
          and set it as <strong>Public</strong>. That's it — uploads will work automatically.
        </div>
      </div>

      {/* Saved Cars Panel */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 28,
        marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
           <div style={{
             width: 44, height: 44, borderRadius: 12,
             background: 'rgba(200,153,58,0.15)',
             display: 'flex', alignItems: 'center', justifyContent: 'center',
             fontSize: 22,
           }}>🚗</div>
           <div>
             <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text1)' }}>Saved Cars</div>
             <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Add your fleet cars (e.g. Ertiga, Dzire) to quickly select them when billing.</div>
           </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input 
            value={newCarNo} 
            onChange={e => setNewCarNo(e.target.value)} 
            placeholder="Car No. (MH04...)"
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
              fontSize: 14, padding: '10px 14px', borderRadius: 8, outline: 'none', flex: 1
            }} 
          />
          <input 
            value={newCarType} 
            onChange={e => setNewCarType(e.target.value)} 
            placeholder="Type (Ertiga, Dzire...)"
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
              fontSize: 14, padding: '10px 14px', borderRadius: 8, outline: 'none', flex: 1
            }} 
          />
          <button 
            onClick={handleAddCar}
            style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, padding: '0 20px', fontWeight: 700, cursor: 'pointer' }}
          >
            Add Car
          </button>
        </div>

        {savedCars.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedCars.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface2)', padding: '10px 14px', borderRadius: 8, alignItems: 'center' }}>
                <div><strong style={{ color: 'var(--accent2)' }}>{c.type}</strong> &nbsp;—&nbsp; {c.no}</div>
                <button onClick={() => handleDeleteCar(i)} style={{ background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer', fontWeight: 700 }}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 60 }}>
          Loading assets…
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          {ASSETS.map(asset => (
            <UploadZone
              key={asset.key}
              assetDef={asset}
              currentUrl={urls[asset.key] || null}
              onUploaded={handleUploaded}
            />
          ))}
        </div>
      )}
    </div>
  )
}
