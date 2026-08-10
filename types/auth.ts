export type UserRole = 'admin' | 'student'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  matric_number: string | null
  phone: string | null
  avatar_url: string | null
}