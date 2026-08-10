import { StudentShell } from "@/components/layout/StudentShell";
import { createClient } from "@/lib/supabase/server";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userName = "Student";
  let phone: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single();
    if (profile?.full_name) userName = profile.full_name;
    phone = profile?.phone ?? null;
  }

  return (
    <StudentShell userName={userName} initialPhone={phone}>
      {children}
    </StudentShell>
  );
}
