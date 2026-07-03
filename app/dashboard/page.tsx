import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GibaekSeed from "@/components/GibaekSeed";
import SubmitForm from "@/components/SubmitForm";
import SubmissionCard from "@/components/SubmissionCard";
import { createClient } from "@/lib/supabase/server";
import type { Submission } from "@/lib/types";

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

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = (submissions ?? []) as Submission[];
  const approvedCount = list.filter((s) => s.status === "approved").length;
  const name = profile?.full_name || user.email?.split("@")[0];

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

          {/* 기백씨 성장 */}
          <GibaekSeed count={approvedCount} name={name} />

          {/* 참여 제출 */}
          <section className="rounded-3xl border border-leaf/15 bg-cream-deep/40 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-forest">
              봉사·캠페인 참여 제출
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              참여한 활동을 남겨주세요. 승인되면 기백씨가 한 뼘 더 자라나요.
            </p>
            <div className="mt-6">
              <SubmitForm />
            </div>
          </section>

          {/* 내 제출 내역 */}
          <section>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl text-forest">
                내 참여 내역
              </h2>
              <span className="text-sm text-ink-soft">
                총 {list.length}건 · 승인 {approvedCount}건
              </span>
            </div>

            {list.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-leaf/30 bg-white p-10 text-center">
                <p className="text-4xl">🌰</p>
                <p className="mt-3 text-ink-soft">
                  아직 제출한 활동이 없어요. 첫 활동을 남기고 기백씨를 깨워보세요!
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {list.map((s) => (
                  <SubmissionCard key={s.id} submission={s} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
