import { StatCard } from "@/components/ui/StatCard";
import { createClient } from "@/lib/supabase/server";
import {
  ClipboardList,
  DoorOpen,
  GraduationCap,
  Megaphone,
  Users,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: studentCount },
    { count: roomCount },
    { count: activeTaskCount },
    { count: announcementCount },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student"),
    supabase.from("rooms").select("*", { count: "exact", head: true }),
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .neq("status", "completed"),
    supabase.from("announcements").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your hostel at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={studentCount ?? 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          label="Total Rooms"
          value={roomCount ?? 0}
          icon={DoorOpen}
          color="emerald"
        />
        <StatCard
          label="Active Tasks"
          value={activeTaskCount ?? 0}
          icon={ClipboardList}
          color="amber"
        />
        <StatCard
          label="Announcements Sent"
          value={announcementCount ?? 0}
          icon={Megaphone}
          color="rose"
        />
      </div>

      {/* ND Final Year Project credit */}
      <div className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            National Diploma Final Year Project
          </p>
          <p className="mt-1 text-sm text-slate-600">
            This Hostel Management System was developed by{" "}
            <span className="font-medium text-slate-900">
              Kehinde Adegbenro
            </span>{" "}
            as a final year project submitted in partial fulfillment of the
            requirements for the award of National Diploma (ND) in Computer
            Science.
          </p>
        </div>
      </div>
    </div>
  );
}
