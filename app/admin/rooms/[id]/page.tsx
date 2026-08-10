import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { RoomDetailClient } from "./RoomDetailClient";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();
  if (!room) notFound();

  const { data: assignments } = await supabase
    .from("room_assignments")
    .select("profiles(id, full_name, matric_number)")
    .eq("room_id", id);

  const { data: allStudents } = await supabase
    .from("profiles")
    .select("id, full_name, matric_number")
    .eq("role", "student");

  const { data: allAssignments } = await supabase
    .from("room_assignments")
    .select("student_id");
  const assignedIds = new Set((allAssignments ?? []).map((a) => a.student_id));

  const assignedStudents = (assignments ?? [])
    .map((a: any) => a.profiles)
    .filter(Boolean);
  const unassignedStudents = (allStudents ?? []).filter(
    (s) => !assignedIds.has(s.id),
  );

  return (
    <RoomDetailClient
      room={room}
      assignedStudents={assignedStudents}
      unassignedStudents={unassignedStudents}
    />
  );
}
