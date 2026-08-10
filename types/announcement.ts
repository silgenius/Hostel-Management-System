export interface Announcement {
  id: string;
  title: string;
  message: string;
  room_id: string | null;
  created_at: string;
  rooms?: { room_number: string } | null;
}
