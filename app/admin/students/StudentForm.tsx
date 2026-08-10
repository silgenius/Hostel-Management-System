'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const createSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  matricNumber: z.string().min(3, 'Matric number is required'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
const editSchema = createSchema.omit({ password: true })

export type StudentFormData = z.infer<typeof createSchema>

interface StudentFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<StudentFormData>
  onSubmit: (data: StudentFormData) => void
  isLoading: boolean
}

export function StudentForm({ mode, defaultValues, onSubmit, isLoading }: StudentFormProps) {
  const schema = mode === 'create' ? createSchema : editSchema
  const { register, handleSubmit, formState: { errors } } = useForm<StudentFormData>({
    resolver: zodResolver(schema as typeof createSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" placeholder="Jane Doe" error={errors.fullName?.message} {...register('fullName')} />
      <Input label="Matric Number" placeholder="CS/2021/034" error={errors.matricNumber?.message} {...register('matricNumber')} />
      <Input label="Phone (optional)" placeholder="0801..." error={errors.phone?.message} {...register('phone')} />
      {mode === 'create' && (
        <Input
          label="Initial Password"
          type="text"
          placeholder="Set a temporary password"
          error={errors.password?.message}
          {...register('password')}
        />
      )}
      <Button type="submit" isLoading={isLoading}>
        {mode === 'create' ? 'Add Student' : 'Save Changes'}
      </Button>
    </form>
  )
}