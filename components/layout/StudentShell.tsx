"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { updateOwnPhone } from "@/lib/students/self-actions";
import { useState } from "react";
import toast from "react-hot-toast";
import { StudentNavbar } from "./StudentNavbar";

export function StudentShell({
  children,
  userName,
  initialPhone,
}: {
  children: React.ReactNode;
  userName: string;
  initialPhone: string | null;
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateOwnPhone(phone);
    setIsSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Profile updated");
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar
        userName={userName}
        onEditProfile={() => setIsProfileOpen(true)}
      />
      <main className="p-4 lg:p-6">{children}</main>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0801..."
          />
          <p className="text-xs text-slate-400">
            Name and matric number can only be changed by an administrator.
          </p>
          <Button onClick={handleSave} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}
