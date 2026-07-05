import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GibaekSeed from "@/components/GibaekSeed";
import { createClient } from "@/lib/supabase/server";
import type { Application } from "@/lib/types";
import { getPoints, wonValue } from "@/lib/points";

export const metadata: Metadata = { title: "마이페이지" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();
  const name = profile?.full_name || user.email?.split("@")[0];

  // 내가 신청한 프로그램
  const { data: apps } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const myApps = (apps ?? []) as Application[];
  const attendedCount = myApps.filter((a) => a.status === "attended").length;

  // 신청한 프로그램 제목/날짜
  const campIds = [
    ...new Set(myApps.map((a) => a.campaign_id).filter(Boolean)),
  ] as string[];
  const titleById = new Map<string, string>();
  const dateById = new Map<string, string | null>();
  if (campIds.length) {
    const { data: camps } = await supabase
      .from("campaigns")
      .select("id, title, activity_date")
      .in("id", campIds);
    for (const c of camps ?? []) {
      titleById.set(c.id, c.title);
      dateById.set(c.id, c.activity_date);
    }
  }

  const { balance, tx } = await getPoints(supabase, user.id);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-4xl space-y-10 px-5 py-10 sm:py-14">
          <div>
            <h1 className="font-display text-3xl text-forest sm:text-4xl">
              안녕하세요, {name} 님 🌿
            </h1>
            <p className="mt-2 text-ink-soft">
              오늘도 회복과 성장의 하루 되세요. 기백씨가 응원하고 있어요.
            </p>
          </div>

          {/* 내 기백씨 포인트 */}
          <section className="overflow-hidden rounded-3xl border border-leaf/15 bg-gradient-to-br from-forest to-forest-deep p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cream/80">
                  내 기백씨 포인트
                </p>
                <p className="mt-1 font-display text-5xl leading-none">
                  {balance}
                  <span className="ml-1 text-2xl">P</span>
                </p>
                <p className="mt-2 text-sm text-cream/80">
                  = {wonValue(balance).toLocaleString()}원 상당
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                <p className="text-cream/70">이렇게 모여요</p>
                <p className="mt-1">가입 선물 5P · 프로그램 참여 완료 시 지급</p>
              </div>
            </div>

            {tx.length > 0 && (
              <div className="mt-6 border-t border-white/15 pt-4">
                <p className="mb-2 text-xs font-medium text-cream/70">
                  최근 적립 내역
                </p>
                <ul className="space-y-1.5">
                  {tx.slice(0, 4).map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-cream/90">
                        {t.reason ?? "포인트"}
                      </span>
                      <span className="font-semibold">
                        {t.amount > 0 ? `+${t.amount}` : t.amount}P
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* 기백씨 성장 */}
          <GibaekSeed count={attendedCount} name={name} />

          {/* 내 참여 프로그램 */}
          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-forest">
                내 참여 프로그램
              </h2>
              <span className="text-sm text-ink-soft">
                신청 {myApps.length}건 · 참여 완료 {attendedCount}건
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              참여 완료는 현장에서 운영진이 확인해 드려요. 완료되면 기백씨 포인트가
              지급돼요.
            </p>

            {myApps.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-leaf/30 bg-white p-10 text-center">
                <p className="text-4xl">🌰</p>
                <p className="mt-3 text-ink-soft">
                  아직 신청한 프로그램이 없어요. 함께할 프로그램을 찾아보세요!
                </p>
                <Link
                  href="/#activities"
                  className="mt-4 inline-block rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-deep"
                >
                  프로그램 둘러보기 →
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                {myApps.map((a) => {
                  const title =
                    (a.campaign_id && titleById.get(a.campaign_id)) ||
                    "프로그램";
                  const date =
                    (a.campaign_id && dateById.get(a.campaign_id)) || null;
                  const attended = a.status === "attended";
                  return (
                    <div
                      key={a.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-leaf/15 bg-white p-5 shadow-sm"
                    >
                      <div>
                        <p className="font-medium text-ink">{title}</p>
                        <p className="text-sm text-ink-soft">
                          {date ?? "일정 조율 중"}
                        </p>
                      </div>
                      {attended ? (
                        <span className="rounded-full bg-sprout/20 px-3 py-1 text-sm font-semibold text-forest">
                          ✓ 참여 완료
                        </span>
                      ) : (
                        <span className="rounded-full bg-cream-deep px-3 py-1 text-sm font-medium text-ink-soft">
                          신청 완료 · 참여 대기
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
