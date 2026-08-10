"use server";

import { assertAdmin } from "@/lib/auth/utils";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(input: {
  title: string;
  message: string;
  roomId: string | null;
}) {
  await assertAdmin();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("announcements").insert({
    title: input.title,
    message: input.message,
    room_id: input.roomId,
    created_by: user!.id,
  });

  if (error) return { error: "Failed to send announcement." };
  revalidatePath("/admin/announcements");
  return { success: true };
}

export async function deleteAnnouncement(id: string) {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return { error: "Failed to delete announcement." };
  revalidatePath("/admin/announcements");
  return { success: true };
}
