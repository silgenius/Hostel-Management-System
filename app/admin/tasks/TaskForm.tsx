"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  roomId: z.string().min(1, "Please select a room"),
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

export type TaskFormData = z.infer<typeof schema>;

interface TaskFormProps {
  rooms: { id: string; room_number: string }[];
  defaultValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  isLoading: boolean;
  submitLabel: string;
}

export function TaskForm({
  rooms,
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      <Input
        label="Title"
        placeholder="Clean bathroom"
        error={errors.title?.message}
        {...register("title")}
      />
      <Input
        label="Description (optional)"
        placeholder="Details..."
        error={errors.description?.message}
        {...register("description")}
      />
      <Input
        label="Due Date (optional)"
        type="date"
        error={errors.dueDate?.message}
        {...register("dueDate")}
      />
      <Button type="submit" isLoading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
