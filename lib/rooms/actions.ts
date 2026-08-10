'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/utils'

export async function createRoom(input: {
  roomNumber: string
  block: string
  floor: number
  capacity: number
}) {
  await assertAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('rooms').insert({
    room_number: input.roomNumber,
    block: input.block,
    floor: input.floor,
    capacity: input.capacity,
  })

  if (error) {
    if (error.message.includes('duplicate')) {
      return { error: 'A room with this number already exists.' }
    }
    return { error: 'Failed to create room.' }
  }

  revalidatePath('/admin/rooms')
  return { success: true }
}

export async function updateRoom(input: {
  id: string
  roomNumber: string
  block: string
  floor: number
  capacity: number
}) {
  await assertAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('rooms')
    .update({
      room_number: input.roomNumber,
      block: input.block,
      floor: input.floor,
      capacity: input.capacity,
    })
    .eq('id', input.id)

  if (error) {
    if (error.message.includes('duplicate')) {
      return { error: 'A room with this number already exists.' }
    }
    return { error: 'Failed to update room.' }
  }

  revalidatePath('/admin/rooms')
  return { success: true }
}

export async function deleteRoom(id: string) {
  await assertAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('rooms').delete().eq('id', id)
  if (error) return { error: 'Failed to delete room. It may still have students assigned to it.' }

  revalidatePath('/admin/rooms')
  return { success: true }
}