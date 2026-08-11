"use client";

import { logout } from "@/lib/auth/actions";
import { Building2, LogOut, Pencil, User } from "lucide-react";
import { useState } from "react";

interface StudentNavbarProps {
  userName: string;
  onEditProfile: () => void;
}

export function StudentNavbar({ userName, onEditProfile }: StudentNavbarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-slate-900">
          Hostel Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onEditProfile}
          className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 hover:bg-slate-100"
        >
          <User className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{userName}</span>
          <Pencil className="h-3 w-3 text-slate-400" />
        </button>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
