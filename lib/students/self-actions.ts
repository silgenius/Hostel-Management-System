"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Note: uses the user-scoped client (respects RLS), not the admin client —
// the trigger above is the real backstop, this action just provides UI feedback
export async function updateOwnPhone(phone: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({ phone })
    .eq("id", user.id);
  if (error) return { error: "Failed to update profile." };

  revalidatePath("/student/dashboard");
  return { success: true };
}
