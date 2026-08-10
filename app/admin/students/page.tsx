import { createClient } from '@/lib/supabase/server'
import { StudentsClient } from './StudentsClient'

export default async function StudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from('profiles')
    .select('id, full_name, matric_number, phone, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  return <StudentsClient initialStudents={students ?? []} />
}