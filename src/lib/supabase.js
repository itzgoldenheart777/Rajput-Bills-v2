import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// ─── BILLS ────────────────────────────────────────────────────────────────────

// Database helper functions
export async function saveBill(billData) {
  const { data, error } = await supabase
    .from('bills')
    .insert([billData])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAllBills() {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getBillById(id) {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function deleteBill(id) {
  const { data, error } = await supabase
    .from('bills')
    .delete()
    .eq('id', id)
    .select()

  if (error) throw error
  if (!data || data.length === 0) throw new Error("Delete blocked by Supabase Security (RLS). You must add a DELETE policy in your SQL Editor.")
}

// Brand Assets CARS API
export async function getCars() {
  const { data, error } = await supabase.from('saved_cars').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addCar(car_no, car_type) {
  const { data, error } = await supabase.from('saved_cars').insert([{ car_no, car_type }]).select().single()
  if (error) throw error
  return data
}

export async function removeCar(id) {
  const { error } = await supabase.from('saved_cars').delete().eq('id', id)
  if (error) throw error
}



// ─── ROAD TAX ─────────────────────────────────────────────────────────────────

export async function getVehicles() {
  const { data, error } = await supabase
    .from('vehicle_status').select('*')
    .order('days_until_expiry', { ascending: true, nullsFirst: false })
  if (error) throw error
  return data
}
export async function addVehicle(vehicle) {
  const { data, error } = await supabase.from('vehicles').insert([vehicle]).select().single()
  if (error) throw error
  return data
}
export async function updateVehicle(id, updates) {
  const { data, error } = await supabase.from('vehicles')
    .update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}
export async function deleteVehicle(id) {
  const { error } = await supabase.from('vehicles').delete().eq('id', id)
  if (error) throw error
}
export async function getPayments(vehicleId) {
  const query = supabase.from('tax_payments').select('*').order('period_end', { ascending: false })
  if (vehicleId) query.eq('vehicle_id', vehicleId)
  const { data, error } = await query
  if (error) throw error
  return data
}
export async function addPayment(payment) {
  const { data, error } = await supabase.from('tax_payments').insert([payment]).select().single()
  if (error) throw error
  return data
}
export async function updatePayment(id, updates) {
  const { data, error } = await supabase.from('tax_payments').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}
export async function uploadReceipt(file, filename) {
  const path = `receipts/${filename}`
  const { error } = await supabase.storage.from('receipts').upload(path, file, { upsert: true, contentType: file.type })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(path)
  return { path, publicUrl }
}
export function formatReceiptFilename(vehicleNumber, periodStart, periodEnd) {
  const fmt = (d) => {
    const date = new Date(d)
    return `${String(date.getDate()).padStart(2,'0')} ${date.toLocaleString('en',{month:'short'})} ${String(date.getFullYear()).slice(2)}`
  }
  return `Road Tax - ${vehicleNumber.toUpperCase().replace(/\s/g,'')} - ${fmt(periodStart)} to ${fmt(periodEnd)}`
}

// ─── PAGAR (DRIVER SALARY) ────────────────────────────────────────────────────

export async function savePagar(record) {
  const { data, error } = await supabase.from('pagar_records').insert([record]).select().single()
  if (error) throw error
  return data
}
export async function getAllPagar(driverId) {
  const query = supabase.from('pagar_records').select('*').order('week_start', { ascending: false })
  if (driverId) query.eq('driver_id', driverId)
  const { data, error } = await query
  if (error) throw error
  return data
}
export async function deletePagar(id) {
  const { error } = await supabase.from('pagar_records').delete().eq('id', id)
  if (error) throw error
}
export async function getDrivers() {
  const { data, error } = await supabase.from('drivers').select('*').order('name', { ascending: true })
  if (error) throw error
  return data
}
export async function addDriver(name, vehicle_number) {
  const { data, error } = await supabase.from('drivers').insert([{ name, vehicle_number }]).select().single()
  if (error) throw error
  return data
}
export async function removeDriver(id) {
  const { error } = await supabase.from('drivers').delete().eq('id', id)
  if (error) throw error
}
