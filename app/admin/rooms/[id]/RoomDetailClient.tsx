"use client";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  assignStudentToRoom,
  removeStudentFromRoom,
} from "@/lib/assignments/actions";
import { Room } from "@/types/room";
import { ArrowLeft, UserMinus, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface AssignedStudent {
  id: string;
  full_name: string;
  matric_number: string;
}

interface RoomDetailClientProps {
  room: Room;
  assignedStudents: AssignedStudent[];
  unassignedStudents: AssignedStudent[];
}

export function RoomDetailClient({
  room,
  assignedStudents,
  unassignedStudents,
}: RoomDetailClientProps) {
  const router = useRouter();
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [removingStudent, setRemovingStudent] =
    useState<AssignedStudent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFull = assignedStudents.length >= room.capacity;

  const filteredUnassigned = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return unassignedStudents;
    return unassignedStudents.filter(
      (s) =>
        s.full_name.toLowerCase().includes(term) ||
        s.matric_number.toLowerCase().includes(term),
    );
  }, [unassignedStudents, search]);

  const handleAssign = async (studentId: string) => {
    setIsSubmitting(true);
    const result = await assignStudentToRoom({ studentId, roomId: room.id });
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Student assigned");
    setIsAssignOpen(false);
    router.refresh();
  };

  const handleRemove = async () => {
    if (!removingStudent) return;
    setIsSubmitting(true);
    const result = await removeStudentFromRoom(removingStudent.id, room.id);
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Student removed from room");
    setRemovingStudent(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/rooms"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Rooms
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {room.room_number}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {room.block} · Floor {room.floor}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {assignedStudents.length} / {room.capacity} occupied
          </span>
          <Button
            onClick={() => setIsAssignOpen(true)}
            disabled={isFull}
            className="sm:w-auto"
          >
            <UserPlus className="h-4 w-4" />
            Assign Student
          </Button>
        </div>
      </div>

      {isFull && (
        <p className="text-sm text-amber-600">
          This room is at full capacity. Remove a student to free up a slot.
        </p>
      )}

      {assignedStudents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students assigned"
          description="Assign students to this room to get started."
          action={
            <Button onClick={() => setIsAssignOpen(true)} className="sm:w-auto">
              Assign Student
            </Button>
          }
        />
      ) : (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm shadow-slate-200/50 ring-1 ring-slate-100">
          {assignedStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {student.full_name}
                </p>
                <p className="text-sm text-slate-500">
                  {student.matric_number}
                </p>
              </div>
              <button
                onClick={() => setRemovingStudent(student)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600"
              >
                <UserMinus className="h-4 w-4" />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Assign Student"
      >
        <div className="space-y-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or matric number..."
          />
          {filteredUnassigned.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              {unassignedStudents.length === 0
                ? "All students are already assigned to rooms."
                : "No matching students."}
            </p>
          ) : (
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {filteredUnassigned.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleAssign(student.id)}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  <span>
                    <span className="font-medium text-slate-900">
                      {student.full_name}
                    </span>
                    <span className="ml-2 text-slate-500">
                      {student.matric_number}
                    </span>
                  </span>
                  <UserPlus className="h-4 w-4 text-indigo-600" />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!removingStudent}
        onClose={() => setRemovingStudent(null)}
        onConfirm={handleRemove}
        title="Remove Student"
        description={`Remove ${removingStudent?.full_name} from this room?`}
        isLoading={isSubmitting}
      />
    </div>
  );
}
