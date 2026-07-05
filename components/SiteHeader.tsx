import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { getPoints } from "@/lib/points";
import PointsBadge from "@/components/PointsBadge";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let points = 0;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = !!profile?.is_admin;
    points = (await getPoints(supabase, user.id)).balance;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-leaf/10 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/logo.png"
            alt="레스트앤라이즈"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
          <span className="font-display text-xl leading-none text-forest">
            레스트앤라이즈
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/#story"
            className="hidden rounded-full px-3 py-2 text-ink-soft transition-colors hover:text-forest sm:inline-block"
          >
            여정
          </Link>
          <Link
            href="/#activities"
            className="hidden rounded-full px-3 py-2 text-ink-soft transition-colors hover:text-forest sm:inline-block"
          >
            프로그램
          </Link>

          {user ? (
            <>
              <PointsBadge points={points} />
              <Link
                href="/dashboard"
                className="hidden rounded-full px-3 py-2 text-ink-soft transition-colors hover:text-forest sm:inline-block"
              >
                마이페이지
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-full px-3 py-2 font-medium text-forest transition-colors hover:text-forest-deep"
                >
                  관리자
                </Link>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full border border-leaf/30 px-4 py-2 text-ink-soft transition-colors hover:bg-cream-deep"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-ink-soft transition-colors hover:text-forest"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-forest px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-forest-deep"
              >
                동참하기
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
