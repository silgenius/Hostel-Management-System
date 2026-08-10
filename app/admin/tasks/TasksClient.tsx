"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { createTask, deleteTask, updateTask } from "@/lib/tasks/actions";
import { Task, TaskStatus } from "@/types/task";
import { ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { TaskForm, TaskFormData } from "./TaskForm";

const PAGE_SIZE = 8;

const statusConfig: Record<
  TaskStatus,
  { label: string; color: "slate" | "amber" | "emerald" }
> = {
  pending: { label: "Pending", color: "slate" },
  in_progress: { label: "In Progress", color: "amber" },
  completed: { label: "Completed", color: "emerald" },
};

export function TasksClient({
  initialTasks,
  rooms,
}: {
  initialTasks: Task[];
  rooms: { id: string; room_number: string }[];
}) {
  const router = useRouter();
  const [roomFilter, setRoomFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = useMemo(() => {
    return initialTasks.filter((t) => {
      const matchesRoom = roomFilter === "all" || t.room_id === roomFilter;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesRoom && matchesStatus;
    });
  }, [initialTasks, roomFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    const result = editingTask
      ? await updateTask({
          id: editingTask.id,
          roomId: data.roomId,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
        })
      : await createTask({
          roomId: data.roomId,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
        });
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(editingTask ? "Task updated" : "Task assigned");
    setIsFormOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setIsSubmitting(true);
    const result = await deleteTask(deletingTask.id);
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Task deleted");
    setDeletingTask(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">
            {initialTasks.length} total tasks
          </p>
        </div>
        <Button onClick={openCreate} className="sm:w-auto">
          <Plus className="h-4 w-4" />
          Assign Task
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-48">
          <Select
            value={roomFilter}
            onChange={(e) => {
              setRoomFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All rooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.room_number}
              </option>
            ))}
          </Select>
        </div>
        <div className="sm:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks found"
          description="Assign a cleaning or maintenance task to a room to get started."
          action={
            <Button onClick={openCreate} className="sm:w-auto">
              Assign Task
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-slate-200/50 ring-1 ring-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="px-5 py-3 font-medium text-slate-500">Task</th>
                <th className="px-5 py-3 font-medium text-slate-500">Room</th>
                <th className="hidden px-5 py-3 font-medium text-slate-500 sm:table-cell">
                  Due
                </th>
                <th className="px-5 py-3 font-medium text-slate-500">Status</th>
                <th className="px-5 py-3 text-right font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {task.title}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {task.rooms?.room_number ?? "—"}
                  </td>
                  <td className="hidden px-5 py-3 text-slate-600 sm:table-cell">
                    {task.due_date ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <Badge color={statusConfig[task.status].color}>
                      {statusConfig[task.status].label}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(task)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTask(task)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 pb-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingTask ? "Edit Task" : "Assign Task"}
      >
        <TaskForm
          rooms={rooms}
          defaultValues={
            editingTask
              ? {
                  roomId: editingTask.room_id,
                  title: editingTask.title,
                  description: editingTask.description ?? "",
                  dueDate: editingTask.due_date ?? "",
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel={editingTask ? "Save Changes" : "Assign Task"}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Delete "${deletingTask?.title}"? This cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}
