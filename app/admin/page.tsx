import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SubmissionCard from "@/components/SubmissionCard";
import { updateSubmissionStatus } from "@/app/submissions/actions";
import { createClient } from "@/lib/supabase/server";
import {
  STATUS_LABEL,
  type Profile,
  type Submission,
  type SubmissionStatus,
} from "@/lib/types";

export const metadata: Metadata = { title: "관리자" };

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "심사중" },
  { key: "approved", label: "승인됨" },
  { key: "rejected", label: "반려됨" },
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filter = "all" } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!me?.is_admin) redirect("/dashboard");

  // 전체 제출 + 제출자 프로필
  const { data: subs } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  const submissions = (subs ?? []) as Submission[];

  const { data: profs } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_admin, created_at");
  const profileMap = new Map<string, Profile>(
    ((profs ?? []) as Profile[]).map((p) => [p.id, p]),
  );

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  const visible =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-5xl space-y-8 px-5 py-10 sm:py-14">
          <div>
            <p className="font-medium text-leaf">ADMIN</p>
            <h1 className="mt-1 font-display text-3xl text-forest sm:text-4xl">
              참여 제출 관리
            </h1>
            <p className="mt-2 text-ink-soft">
              모든 봉사·캠페인 참여 제출을 확인하고 승인/반려할 수 있어요.
            </p>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="전체" value={counts.all} />
            <Stat label="심사중" value={counts.pending} accent="gold" />
            <Stat label="승인됨" value={counts.approved} accent="forest" />
            <Stat label="반려됨" value={counts.rejected} />
          </div>

          {/* 필터 */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <Link
                  key={f.key}
                  href={f.key === "all" ? "/admin" : `/admin?status=${f.key}`}
                  className={[
                    "rounded-full px-4 py-2 text-sm transition-colors",
                    active
                      ? "bg-forest text-white"
                      : "border border-leaf/25 bg-white text-ink-soft hover:bg-cream-deep",
                  ].join(" ")}
                >
                  {f.label} ({counts[f.key as keyof typeof counts]})
                </Link>
              );
            })}
          </div>

          {/* 목록 */}
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-leaf/30 bg-white p-12 text-center text-ink-soft">
              해당하는 제출이 없어요.
            </div>
          ) : (
            <div className="grid gap-4">
              {visible.map((s) => {
                const p = profileMap.get(s.user_id);
                return (
                  <SubmissionCard key={s.id} submission={s}>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-leaf/10 pt-3">
                      <p className="text-sm text-ink-soft">
                        제출자:{" "}
                        <span className="font-medium text-ink">
                          {p?.full_name || "이름없음"}
                        </span>{" "}
                        <span className="text-ink-soft/70">
                          ({p?.email || "-"})
                        </span>
                      </p>
                      <AdminActions id={s.id} current={s.status} />
                    </div>
                  </SubmissionCard>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "gold" | "forest";
}) {
  const color =
    accent === "gold"
      ? "text-yellow-700"
      : accent === "forest"
        ? "text-forest"
        : "text-ink";
  return (
    <div className="rounded-2xl border border-leaf/15 bg-white p-4 text-center shadow-sm">
      <p className={`font-display text-3xl ${color}`}>{value}</p>
      <p className="mt-0.5 text-sm text-ink-soft">{label}</p>
    </div>
  );
}

function AdminActions({
  id,
  current,
}: {
  id: string;
  current: SubmissionStatus;
}) {
  const targets: SubmissionStatus[] = ["approved", "pending", "rejected"];
  return (
    <div className="flex gap-2">
      {targets.map((t) => (
        <form key={t} action={updateSubmissionStatus}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={t} />
          <button
            type="submit"
            disabled={current === t}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              current === t
                ? "cursor-default bg-cream-deep text-ink-soft/60"
                : t === "approved"
                  ? "bg-sprout/20 text-forest hover:bg-sprout/30"
                  : t === "rejected"
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gold/20 text-yellow-700 hover:bg-gold/30",
            ].join(" ")}
          >
            {current === t ? `${STATUS_LABEL[t]} ✓` : STATUS_LABEL[t]}
          </button>
        </form>
      ))}
    </div>
  );
}
