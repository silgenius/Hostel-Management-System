"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    title: z.string().min(2, "Title is required"),
    message: z.string().min(5, "Message is required"),
    target: z.enum(["all", "room"]),
    roomId: z.string().optional(),
  })
  .refine((data) => data.target === "all" || !!data.roomId, {
    message: "Please select a room",
    path: ["roomId"],
  });

export type AnnouncementFormData = z.infer<typeof schema>;

interface AnnouncementFormProps {
  rooms: { id: string; room_number: string }[];
  onSubmit: (data: AnnouncementFormData) => void;
  isLoading: boolean;
}

export function AnnouncementForm({
  rooms,
  onSubmit,
  isLoading,
}: AnnouncementFormProps) {
  const [target, setTarget] = useState<"all" | "room">("all");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(schema),
    defaultValues: { target: "all" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Water outage notice"
        error={errors.title?.message}
        {...register("title")}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          rows={4}
          placeholder="Write your announcement..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Send to
        </label>
        <div className="flex gap-3">
          <label
            className={`flex-1 cursor-pointer rounded-xl border px-4 py-2.5 text-center text-sm font-medium ${target === "all" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600"}`}
          >
            <input
              type="radio"
              value="all"
              className="sr-only"
              {...register("target")}
              onChange={() => setTarget("all")}
            />
            All Students
          </label>
          <label
            className={`flex-1 cursor-pointer rounded-xl border px-4 py-2.5 text-center text-sm font-medium ${target === "room" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600"}`}
          >
            <input
              type="radio"
              value="room"
              className="sr-only"
              {...register("target")}
              onChange={() => setTarget("room")}
            />
            Specific Room
          </label>
        </div>
      </div>

      {target === "room" && (
        <Select
          label="Room"
          error={errors.roomId?.message}
          {...register("roomId")}
        >
          <option value="">Select a room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.room_number}
            </option>
          ))}
        </Select>
      )}

      <Button type="submit" isLoading={isLoading}>
        Send Announcement
      </Button>
    </form>
  );
}
