import { createClient } from "@/lib/supabase/server";
import { TasksClient } from "./TasksClient";

export default async function TasksPage() {
  const supabase = await createClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, rooms(room_number, block)")
    .order("created_at", { ascending: false });

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, room_number")
    .order("room_number");

  return <TasksClient initialTasks={tasks ?? []} rooms={rooms ?? []} />;
}
