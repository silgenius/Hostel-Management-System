import { createClient } from "@/lib/supabase/server";
import { StudentDashboardClient } from "./StudentDashboardClient";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // middleware already guards this route

  const { data: assignment } = await supabase
    .from("room_assignments")
    .select("room_id, rooms(id, room_number, block, floor)")
    .eq("student_id", user.id)
    .maybeSingle();

  const room = (assignment?.rooms as any) ?? null;

  let roommates: any[] = [];
  let tasks: any[] = [];
  if (room) {
    const { data: assignments } = await supabase
      .from("room_assignments")
      .select("profiles(id, full_name, matric_number)")
      .eq("room_id", room.id);

    roommates = (assignments ?? [])
      .map((a: any) => a.profiles)
      .filter((p: any) => p && p.id !== user.id);

    const { data: roomTasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("room_id", room.id)
      .order("created_at", { ascending: false });

    tasks = roomTasks ?? [];
  }

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*, rooms(room_number)")
    .order("created_at", { ascending: false });

  return (
    <StudentDashboardClient
      room={room}
      roommates={roommates}
      tasks={tasks}
      announcements={announcements ?? []}
    />
  );
}
