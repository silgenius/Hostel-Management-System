import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const isProtectedAdmin = path.startsWith("/admin");
  const isProtectedStudent = path.startsWith("/student");
  const EXEMPTED_PATHS = ["/login/admin", "/login/student"];

  const isEexemptedPaths = () => EXEMPTED_PATHS.some((s) => s === path);

  if (
    (isProtectedAdmin || isProtectedStudent) &&
    !isEexemptedPaths() &&
    !user
  ) {
    return NextResponse.redirect(new URL("/student/login", request.url));
  }

  if (user && (isProtectedAdmin || isProtectedStudent)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (isProtectedAdmin && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
    if (isProtectedStudent && profile?.role !== "student") {
      return NextResponse.redirect(new URL("/login/student", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
