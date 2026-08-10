"use server";

import { assertAdmin } from "@/lib/auth/utils";
import { createClient } from "@/lib/supabase/server";
import { TaskStatus } from "@/types/task";
import { revalidatePath } from "next/cache";

export async function createTask(input: {
  roomId: string;
  title: string;
  description?: string;
  dueDate?: string;
}) {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").insert({
    room_id: input.roomId,
    title: input.title,
    description: input.description || null,
    due_date: input.dueDate || null,
  });

  if (error) return { error: "Failed to create task." };
  revalidatePath("/admin/tasks");
  return { success: true };
}

export async function updateTask(input: {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  dueDate?: string;
}) {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({
      room_id: input.roomId,
      title: input.title,
      description: input.description || null,
      due_date: input.dueDate || null,
    })
    .eq("id", input.id);

  if (error) return { error: "Failed to update task." };
  revalidatePath("/admin/tasks");
  return { success: true };
}

export async function deleteTask(id: string) {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return { error: "Failed to delete task." };
  revalidatePath("/admin/tasks");
  return { success: true };
}

// Used later by the Student Dashboard (Feature 9) — a student marking
// a task in their own room as active/completed. RLS + the trigger both
// enforce that this can never touch title/description/room_id/due_date.
export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("tasks")
    .update({
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", taskId);

  if (error) return { error: "Failed to update task status." };
  revalidatePath("/student/dashboard");
  return { success: true };
}
