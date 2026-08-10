export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  room_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  rooms?: { room_number: string; block: string };
}
