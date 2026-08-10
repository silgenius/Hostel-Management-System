'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function matricToEmail(matricNumber: string) {
  const slug = matricNumber.toLowerCase().replace(/[^a-z0-9]/g, '')
  return `${slug}@students.hostel.local`
}

// Defense in depth: even though the admin client bypasses RLS,
// we explicitly verify the CALLER is an admin before allowing
// any privileged action to run.
import { assertAdmin } from '@/lib/auth/utils'

export async function createStudent(input: {
  fullName: string
  matricNumber: string
  phone?: string
  password: string
}) {
  await assertAdmin()
  const admin = createAdminClient()
  const email = matricToEmail(input.matricNumber)

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
  })

  if (authError || !authUser.user) {
    if (authError?.message.includes('already been registered')) {
      return { error: 'A student with this matric number already exists.' }
    }
    return { error: authError?.message ?? 'Failed to create student account.' }
  }

  const { error: profileError } = await admin.from('profiles').insert({
    id: authUser.user.id,
    role: 'student',
    full_name: input.fullName,
    matric_number: input.matricNumber,
    phone: input.phone || null,
  })

  if (profileError) {
    // Roll back the orphaned auth user if the profile insert fails
    await admin.auth.admin.deleteUser(authUser.user.id)
    if (profileError.message.includes('duplicate')) {
      return { error: 'A student with this matric number already exists.' }
    }
    return { error: 'Failed to create student profile.' }
  }

  revalidatePath('/admin/students')
  return { success: true }
}

export async function updateStudent(input: {
  id: string
  fullName: string
  matricNumber: string
  phone?: string
}) {
  await assertAdmin()
  const admin = createAdminClient()

  const { error } = await admin
    .from('profiles')
    .update({
      full_name: input.fullName,
      matric_number: input.matricNumber,
      phone: input.phone || null,
    })
    .eq('id', input.id)

  if (error) {
    if (error.message.includes('duplicate')) {
      return { error: 'A student with this matric number already exists.' }
    }
    return { error: 'Failed to update student.' }
  }

  revalidatePath('/admin/students')
  return { success: true }
}

export async function deleteStudent(id: string) {
  await assertAdmin()
  const admin = createAdminClient()

  // Deletes auth.users row -> profiles row cascades automatically
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) return { error: 'Failed to delete student.' }

  revalidatePath('/admin/students')
  return { success: true }
}