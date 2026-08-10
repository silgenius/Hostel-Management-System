"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import {
  createAnnouncement,
  deleteAnnouncement,
} from "@/lib/announcements/actions";
import { Announcement } from "@/types/announcement";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AnnouncementForm, AnnouncementFormData } from "./AnnouncementForm";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AnnouncementsClient({
  initialAnnouncements,
  rooms,
}: {
  initialAnnouncements: Announcement[];
  rooms: { id: string; room_number: string }[];
}) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingAnnouncement, setDeletingAnnouncement] =
    useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: AnnouncementFormData) => {
    setIsSubmitting(true);
    const result = await createAnnouncement({
      title: data.title,
      message: data.message,
      roomId: data.target === "room" ? data.roomId! : null,
    });
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Announcement sent");
    setIsFormOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deletingAnnouncement) return;
    setIsSubmitting(true);
    const result = await deleteAnnouncement(deletingAnnouncement.id);
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Announcement deleted");
    setDeletingAnnouncement(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Announcements
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {initialAnnouncements.length} sent
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="sm:w-auto">
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {initialAnnouncements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Send your first announcement to students."
          action={
            <Button onClick={() => setIsFormOpen(true)} className="sm:w-auto">
              New Announcement
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {initialAnnouncements.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50 ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{a.title}</h3>
                    <Badge color={a.room_id ? "amber" : "indigo"}>
                      {a.room_id
                        ? (a.rooms?.room_number ?? "Room")
                        : "All Students"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                    {a.message}
                  </p>
                  <p className="mt-3 text-xs text-slate-400">
                    {formatDate(a.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setDeletingAnnouncement(a)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="New Announcement"
      >
        <AnnouncementForm
          rooms={rooms}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingAnnouncement}
        onClose={() => setDeletingAnnouncement(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        description={`Delete "${deletingAnnouncement?.title}"? This cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}
