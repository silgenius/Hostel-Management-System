import { cn } from "@/lib/utils";

const styles = {
  slate: "bg-slate-100 text-slate-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  rose: "bg-rose-100 text-rose-700",
  indigo: "bg-indigo-100 text-indigo-700",
};

interface BadgeProps {
  children: React.ReactNode;
  color?: keyof typeof styles;
}

export function Badge({ children, color = "slate" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        styles[color],
      )}
    >
      {children}
    </span>
  );
}
