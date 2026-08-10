'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { GraduationCap } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { loginStudent } from '@/lib/auth/actions'

const schema = z.object({
  matricNumber: z.string().min(1, 'Matric number is required'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

export default function StudentLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  // Defense-in-depth: strip any stray query params from a pre-hydration
  // native form submission (see Feature 2 security fix)
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    const result = await loginStudent(data.matricNumber, data.password)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Welcome back!')
    router.push('/student/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/50">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Student Login</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to access your hostel dashboard</p>
        </div>

        <form method="post" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Matric Number"
            type="text"
            placeholder="CS/2021/034"
            error={errors.matricNumber?.message}
            {...register('matricNumber')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}