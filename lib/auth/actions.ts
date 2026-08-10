'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAdmin(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Invalid email or password.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'This account does not have admin access.' }
  }

  return { success: true }
}

export async function loginStudent(matricNumber: string, password: string) {
  const supabase = await createClient()

  // Resolve matric number -> email via our security-definer function
  const { data: email, error: lookupError } = await supabase.rpc('get_email_by_matric', {
    matric: matricNumber,
  })

  if (lookupError || !email) {
    return { error: 'Invalid matric number or password.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Invalid matric number or password.' }

  return { success: true }
}


export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}