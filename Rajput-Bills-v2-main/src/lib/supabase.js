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
