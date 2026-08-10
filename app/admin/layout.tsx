import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/layout/AdminShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userName = 'Admin'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    if (profile?.full_name) userName = profile.full_name
  }

  return <AdminShell userName={userName}>{children}</AdminShell>
}