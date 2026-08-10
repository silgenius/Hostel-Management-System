"use client";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { updateTaskStatus } from "@/lib/tasks/actions";
import { Announcement } from "@/types/announcement";
import { Task, TaskStatus } from "@/types/task";
import { CheckCircle2, Circle, DoorOpen, Megaphone, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface Roommate {
  id: string;
  full_name: string;
  matric_number: string;
}
interface RoomInfo {
  id: string;
  room_number: string;
  block: string;
  floor: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const statusConfig: Record<
  TaskStatus,
  { label: string; color: "slate" | "amber" | "emerald" }
> = {
  pending: { label: "Pending", color: "slate" },
  in_progress: { label: "In Progress", color: "amber" },
  completed: { label: "Completed", color: "emerald" },
};

export function StudentDashboardClient({
  room,
  roommates,
  tasks,
  announcements,
}: {
  room: RoomInfo | null;
  roommates: Roommate[];
  tasks: Task[];
  announcements: Announcement[];
}) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleTask = async (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === "completed" ? "pending" : "completed";
    setUpdatingId(task.id);
    const result = await updateTaskStatus(task.id, nextStatus);
    setUpdatingId(null);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(
      nextStatus === "completed" ? "Task marked complete" : "Task reopened",
    );
    router.refresh();
  };

  if (!room) {
    return (
      <EmptyState
        icon={DoorOpen}
        title="No room assigned yet"
        description="You haven't been assigned to a room. Please contact your hostel administrator."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Room info */}
      <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
            <DoorOpen className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {room.room_number}
            </p>
            <p className="text-sm text-slate-500">
              {room.block} · Floor {room.floor}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Roommates */}
        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Roommates</h2>
          </div>
          {roommates.length === 0 ? (
            <p className="text-sm text-slate-500">
              {"No roommates yet — you're the first one in this room."}
            </p>
          ) : (
            <div className="space-y-3">
              {roommates.map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">
                    {r.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {r.full_name}
                    </p>
                    <p className="text-xs text-slate-500">{r.matric_number}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Room Tasks
          </h2>
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-500">
              No tasks assigned to your room right now.
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <Badge color={statusConfig[task.status].color}>
                        {statusConfig[task.status].label}
                      </Badge>
                      {task.due_date && (
                        <span className="text-xs text-slate-400">
                          Due {task.due_date}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTask(task)}
                    disabled={updatingId === task.id}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {task.status === "completed" ? (
                      <>
                        <Circle className="h-3.5 w-3.5" /> Reopen
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Announcements */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">
            Announcements
          </h2>
        </div>
        {announcements.length === 0 ? (
          <p className="text-sm text-slate-500">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{a.title}</h3>
                  <Badge color={a.room_id ? "amber" : "indigo"}>
                    {a.room_id ? "Your Room" : "All Students"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                  {a.message}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  {formatDate(a.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
