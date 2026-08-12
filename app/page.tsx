import { GraduationCap, ListChecks, Megaphone, Users } from "lucide-react";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import Link from "next/link";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const plate = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plate",
});

export default function HomePage() {
  return (
    <div
      className={`${display.variable} ${plate.variable} bg-slate-50 text-slate-900`}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes plateIn {
            from { opacity: 0; transform: translateY(14px) rotate(var(--tilt, 0deg)); }
            to   { opacity: 1; transform: translateY(0) rotate(var(--tilt, 0deg)); }
          }
          .plate-enter { animation: plateIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        }
      `}</style>

      {/* ===== Mark ===== */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <span
              style={{ fontFamily: "var(--font-plate)" }}
              className="text-xs font-semibold text-white"
            >
              H
            </span>
          </div>
          <span
            style={{ fontFamily: "var(--font-plate)" }}
            className="text-xs tracking-wider text-slate-500"
          >
            HOSTEL MANAGEMENT SYSTEM
          </span>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-8 sm:px-10 sm:pb-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p
              style={{ fontFamily: "var(--font-plate)" }}
              className="mb-5 text-xs font-semibold tracking-[0.2em] text-indigo-600"
            >
              ADMINISTERED · ASSIGNED · ANNOUNCED
            </p>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl"
            >
              Every room has
              <br />
              a number. Now every
              <br />
              number has a system.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-500">
              Assign rooms, track chores, and post notices — built for hostel
              administrators and the students who actually live there.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/login/admin"
                className="flex items-center gap-3 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                <span
                  style={{ fontFamily: "var(--font-plate)" }}
                  className="text-[11px] font-semibold tracking-wider text-indigo-200"
                >
                  A
                </span>
                Admin Login
              </Link>
              <Link
                href="/login/student"
                className="flex items-center gap-3 rounded-xl bg-slate-100 px-5 py-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                <span
                  style={{ fontFamily: "var(--font-plate)" }}
                  className="text-[11px] font-semibold tracking-wider text-indigo-600"
                >
                  S
                </span>
                Student Login
              </Link>
            </div>
          </div>

          {/* Door plates */}
          <div className="relative flex h-72 items-center justify-center sm:h-80">
            <div
              className="plate-enter absolute w-40 rounded-2xl bg-indigo-600 p-4 shadow-sm shadow-slate-200/50"
              style={{
                ["--tilt" as any]: "-6deg",
                transform: "rotate(-6deg)",
                top: "4%",
                left: "6%",
                animationDelay: "80ms",
              }}
            >
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="text-[10px] tracking-widest text-indigo-200"
              >
                BLOCK A
              </p>
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="mt-1 text-2xl font-semibold text-white"
              >
                A-101
              </p>
              <p className="mt-2 text-[11px] text-indigo-100">4 / 4 occupied</p>
            </div>
            <div
              className="plate-enter absolute w-40 rounded-2xl bg-indigo-700 p-4 shadow-sm shadow-slate-200/50"
              style={{
                ["--tilt" as any]: "4deg",
                transform: "rotate(4deg)",
                top: "30%",
                right: "2%",
                animationDelay: "220ms",
              }}
            >
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="text-[10px] tracking-widest text-indigo-200"
              >
                BLOCK C
              </p>
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="mt-1 text-2xl font-semibold text-white"
              >
                C-310
              </p>
              <p className="mt-2 text-[11px] text-indigo-100">2 / 4 occupied</p>
            </div>
            <div
              className="plate-enter absolute w-40 rounded-2xl bg-indigo-600 p-4 shadow-sm shadow-slate-200/50"
              style={{
                ["--tilt" as any]: "-2deg",
                transform: "rotate(-2deg)",
                bottom: "2%",
                left: "20%",
                animationDelay: "360ms",
              }}
            >
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="text-[10px] tracking-widest text-indigo-200"
              >
                BLOCK B
              </p>
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="mt-1 text-2xl font-semibold text-white"
              >
                B-204
              </p>
              <p className="mt-2 text-[11px] text-indigo-100">3 / 4 occupied</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== What it does ===== */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="text-xs font-semibold tracking-widest text-indigo-600"
              >
                RM
              </p>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-3 text-lg font-semibold text-slate-900"
              >
                Rooms, mapped
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Create rooms, set capacity, and assign students without a
                spreadsheet in sight.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5" /> 3 / 4 occupied
              </div>
            </div>
            <div>
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="text-xs font-semibold tracking-widest text-indigo-600"
              >
                TK
              </p>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-3 text-lg font-semibold text-slate-900"
              >
                Chores, tracked
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {
                  "Assign cleaning duty to a room. Whoever's home marks it done."
                }
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                <ListChecks className="h-3.5 w-3.5" /> Bathroom cleaning — done
              </div>
            </div>
            <div>
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="text-xs font-semibold tracking-widest text-indigo-600"
              >
                NT
              </p>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-3 text-lg font-semibold text-slate-900"
              >
                Notices, posted
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {
                  "Send a notice to the whole hostel or just one room. Every student sees only what's meant for them."
                }
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                <Megaphone className="h-3.5 w-3.5" /> Water outage — Block B
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== About ===== */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p
                style={{ fontFamily: "var(--font-plate)" }}
                className="text-xs font-semibold tracking-widest text-indigo-600"
              >
                WHY THIS EXISTS
              </p>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl"
              >
                The register never used to hold everyone.
              </h2>
            </div>

            <div className="space-y-4 text-[15px] leading-relaxed text-slate-500">
              <p>
                Most hostels still run on paper registers, group chats, and
                whoever remembers to pass the message along. A lost sheet means
                a student sleeps in the corridor on move-in day. A missed notice
                means a leaking pipe goes unfixed for a week because nobody in
                that room saw it.
              </p>
              <p>
                This system replaces the register with a roster that can't lose
                a name, and the noticeboard with one every student actually sees
                — scoped to their own room, or the whole hostel, never both by
                accident.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Dedication ===== */}
      <section className="border-y border-indigo-100 bg-indigo-50">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10">
          <div className="flex items-start gap-4 rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                National Diploma Final Year Project
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                This Hostel Management System was designed and built by{" "}
                <span className="font-medium text-slate-900">
                  Kehinde Adegbenro
                </span>
                , submitted in partial fulfilment of the requirements for the
                award of National Diploma (ND) in Computer Science.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 sm:px-10">
          <p
            style={{ fontFamily: "var(--font-plate)" }}
            className="text-[11px] tracking-wider text-slate-400"
          >
            HOSTEL MANAGEMENT SYSTEM
          </p>

          <p className="text-xs text-slate-500">ND Computer Science Project</p>
        </div>
      </footer>
    </div>
  );
}
