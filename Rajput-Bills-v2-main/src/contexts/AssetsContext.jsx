import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { carLogo, stampImg, signatureImg } from '../lib/assets'

const BUCKET = 'brand-assets'
const EXTENSIONS = ['png', 'webp', 'svg', 'jpg']

// Try fetching the public URL for an asset key; returns null if not reachable
async function fetchAssetUrl(key) {
  for (const ext of EXTENSIONS) {
    const path = `${key}.${ext}`
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    if (data?.publicUrl) {
      try {
        const res = await fetch(data.publicUrl, { method: 'HEAD' })
        if (res.ok) return data.publicUrl + '?t=' + Date.now()
      } catch (_) {}
    }
  }
  return null
}

const AssetsContext = createContext({
  logoUrl: carLogo,
  stampUrl: stampImg,
  signatureUrl: signatureImg,
  loading: false,
  reload: () => {},
})

export function AssetsProvider({ children }) {
  const [logoUrl, setLogoUrl] = useState(carLogo)
  const [stampUrl, setStampUrl] = useState(stampImg)
  const [signatureUrl, setSignatureUrl] = useState(signatureImg)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchAssetUrl('logo'),
      fetchAssetUrl('stamp'),
      fetchAssetUrl('signature'),
    ]).then(([logo, stamp, sig]) => {
      if (logo) setLogoUrl(logo)
      if (stamp) setStampUrl(stamp)
      if (sig) setSignatureUrl(sig)
    }).catch(() => {
      // silently fall back to defaults
    }).finally(() => setLoading(false))
  }, [tick])

  const reload = () => setTick(t => t + 1)

  return (
    <AssetsContext.Provider value={{ logoUrl, stampUrl, signatureUrl, loading, reload }}>
      {children}
    </AssetsContext.Provider>
  )
}

export function useAssets() {
  return useContext(AssetsContext)
}
