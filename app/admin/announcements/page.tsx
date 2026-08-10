import { createClient } from "@/lib/supabase/server";
import { AnnouncementsClient } from "./AnnouncementsClient";

export default async function AnnouncementsPage() {
  const supabase = await createClient();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*, rooms(room_number)")
    .order("created_at", { ascending: false });

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, room_number")
    .order("room_number");

  return (
    <AnnouncementsClient
      initialAnnouncements={announcements ?? []}
      rooms={rooms ?? []}
    />
  );
}
