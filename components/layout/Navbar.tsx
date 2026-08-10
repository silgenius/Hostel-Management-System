'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '@/lib/auth/actions'

interface NavbarProps {
  onMenuClick: () => void
  userName: string
}

export function Navbar({ onMenuClick, userName }: NavbarProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch {
      toast.error('Failed to log out. Try again.')
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <button onClick={onMenuClick} className="text-slate-500 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
          <User className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{userName}</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}