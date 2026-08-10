'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  block: z.string().min(1, 'Block is required'),
  floor: z.coerce.number().int().min(0, 'Floor must be 0 or higher'),
  capacity: z.coerce.number().int().min(1, 'Minimum capacity is 1').max(4, 'Maximum capacity is 4'),
})

export type RoomFormData = z.infer<typeof schema>

interface RoomFormProps {
  defaultValues?: Partial<RoomFormData>
  onSubmit: (data: RoomFormData) => void
  isLoading: boolean
  submitLabel: string
}

export function RoomForm({ defaultValues, onSubmit, isLoading, submitLabel }: RoomFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RoomFormData>({
    resolver: zodResolver(schema),
    defaultValues: { capacity: 4, ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Room Number" placeholder="A-101" error={errors.roomNumber?.message} {...register('roomNumber')} />
      <Input label="Block" placeholder="Block A" error={errors.block?.message} {...register('block')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Floor" type="number" error={errors.floor?.message} {...register('floor')} />
        <Input label="Capacity" type="number" min={1} max={4} error={errors.capacity?.message} {...register('capacity')} />
      </div>
      <Button type="submit" isLoading={isLoading}>{submitLabel}</Button>
    </form>
  )
}