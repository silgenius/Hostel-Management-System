"use client";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { Select } from "@/components/ui/Select";
import { createRoom, deleteRoom, updateRoom } from "@/lib/rooms/actions";
import { Room } from "@/types/room";
import { DoorOpen, Pencil, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { RoomForm, RoomFormData } from "./RoomForm";

const PAGE_SIZE = 9;

export function RoomsClient({ initialRooms }: { initialRooms: Room[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const blocks = useMemo(
    () => Array.from(new Set(initialRooms.map((r) => r.block))).sort(),
    [initialRooms],
  );

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return initialRooms.filter((r) => {
      const matchesSearch = !term || r.room_number.toLowerCase().includes(term);
      const matchesBlock = blockFilter === "all" || r.block === blockFilter;
      return matchesSearch && matchesBlock;
    });
  }, [initialRooms, search, blockFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };
  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: RoomFormData) => {
    setIsSubmitting(true);
    const result = editingRoom
      ? await updateRoom({
          id: editingRoom.id,
          roomNumber: data.roomNumber,
          block: data.block,
          floor: data.floor,
          capacity: data.capacity,
        })
      : await createRoom({
          roomNumber: data.roomNumber,
          block: data.block,
          floor: data.floor,
          capacity: data.capacity,
        });
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(editingRoom ? "Room updated" : "Room created");
    setIsFormOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deletingRoom) return;
    setIsSubmitting(true);
    const result = await deleteRoom(deletingRoom.id);
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Room deleted");
    setDeletingRoom(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Rooms</h1>
          <p className="mt-1 text-sm text-slate-500">
            {initialRooms.length} total rooms
          </p>
        </div>
        <Button onClick={openCreate} className="sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by room number..."
        />
        <div className="sm:w-48">
          <Select
            value={blockFilter}
            onChange={(e) => {
              setBlockFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All blocks</option>
            {blocks.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title={
            search || blockFilter !== "all"
              ? "No matching rooms"
              : "No rooms yet"
          }
          description={
            search || blockFilter !== "all"
              ? "Try a different search or filter."
              : "Add your first room to get started."
          }
          action={
            !search &&
            blockFilter === "all" && (
              <Button onClick={openCreate} className="sm:w-auto">
                Add Room
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((room) => (
              <div
                key={room.id}
                className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100"
              >
                <div className="flex items-start justify-between">
                  <Link href={`/admin/rooms/${room.id}`} className="flex-1">
                    <p className="text-base font-semibold text-slate-900 hover:text-indigo-600">
                      {room.room_number}
                    </p>
                    <p className="text-sm text-slate-500">
                      {room.block} · Floor {room.floor}
                    </p>
                  </Link>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(room);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingRoom(room);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Link
                  href={`/admin/rooms/${room.id}`}
                  className="mt-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600"
                >
                  <Users className="h-4 w-4" />
                  <span>
                    {room.occupancy ?? 0} / {room.capacity} occupied
                  </span>
                </Link>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingRoom ? "Edit Room" : "Add Room"}
      >
        <RoomForm
          defaultValues={
            editingRoom
              ? {
                  roomNumber: editingRoom.room_number,
                  block: editingRoom.block,
                  floor: editingRoom.floor,
                  capacity: editingRoom.capacity,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitLabel={editingRoom ? "Save Changes" : "Add Room"}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingRoom}
        onClose={() => setDeletingRoom(null)}
        onConfirm={handleDelete}
        title="Delete Room"
        description={`Are you sure you want to delete room ${deletingRoom?.room_number}? This cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}
