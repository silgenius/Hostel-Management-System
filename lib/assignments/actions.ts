"use server";

import { assertAdmin } from "@/lib/auth/utils";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function assignStudentToRoom(input: {
  studentId: string;
  roomId: string;
}) {
  await assertAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("room_assignments")
    .select("id")
    .eq("student_id", input.studentId)
    .maybeSingle();

  const { error } = existing
    ? await supabase
        .from("room_assignments")
        .update({ room_id: input.roomId })
        .eq("id", existing.id)
    : await supabase
        .from("room_assignments")
        .insert({ room_id: input.roomId, student_id: input.studentId });

  if (error) {
    if (error.message.includes("capacity")) return { error: error.message };
    return { error: "Failed to assign student." };
  }

  revalidatePath("/admin/rooms");
  revalidatePath(`/admin/rooms/${input.roomId}`);
  return { success: true };
}

export async function removeStudentFromRoom(studentId: string, roomId: string) {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("room_assignments")
    .delete()
    .eq("student_id", studentId);
  if (error) return { error: "Failed to remove student from room." };

  revalidatePath("/admin/rooms");
  revalidatePath(`/admin/rooms/${roomId}`);
  return { success: true };
}
