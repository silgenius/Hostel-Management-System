import { createClient } from "@/lib/supabase/server";
import { RoomsClient } from "./RoomsClient";

export default async function RoomsPage() {
  const supabase = await createClient();

  const { data: rooms } = await supabase
    .from("rooms")
    .select(
      "id, room_number, block, floor, capacity, created_at, room_assignments(id)",
    )
    .order("room_number");

  const roomsWithOccupancy = (rooms ?? []).map((r) => ({
    ...r,
    occupancy: r.room_assignments?.length ?? 0,
  }));

  return <RoomsClient initialRooms={roomsWithOccupancy} />;
}
