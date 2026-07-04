import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ApplyForm from "@/components/ApplyForm";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

const CATEGORY_STYLE: Record<string, string> = {
  봉사: "bg-forest text-white",
  리트릿: "bg-gold text-forest-deep",
  캠페인: "bg-leaf text-white",
};

export default async function CampaignApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 신청은 로그인 필수
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/campaigns/${id}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single<Campaign>();

  if (!campaign) notFound();

  const dateLabel = campaign.activity_date
    ? new Date(campaign.activity_date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      })
    : "일정 조율 중";

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream-deep/30">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <Link
            href="/#activities"
            className="text-sm text-ink-soft transition-colors hover:text-forest"
          >
            ← 활동 목록으로
          </Link>

          {/* 캠페인 정보 */}
          <div className="mt-4 rounded-3xl border border-leaf/15 bg-white p-7 shadow-sm sm:p-9">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                CATEGORY_STYLE[campaign.category] ?? "bg-forest text-white"
              }`}
            >
              {campaign.category}
              {campaign.status === "closed" ? " · 마감" : " · 모집 중"}
            </span>
            <h1 className="mt-3 font-display text-3xl text-forest sm:text-4xl">
              {campaign.title}
            </h1>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="📅 활동 날짜" value={dateLabel} />
              <Info label="📍 장소" value={campaign.location ?? "추후 안내"} />
              {campaign.capacity ? (
                <Info label="👥 모집 인원" value={`${campaign.capacity}명`} />
              ) : null}
            </dl>

            {campaign.description && (
              <p className="mt-5 whitespace-pre-line rounded-2xl bg-cream/60 p-5 text-sm leading-relaxed text-ink-soft">
                {campaign.description}
              </p>
            )}
          </div>

          {/* 신청 폼 */}
          <div className="mt-6 rounded-3xl border border-leaf/15 bg-white p-7 shadow-sm sm:p-9">
            {campaign.status === "closed" ? (
              <p className="text-center text-ink-soft">
                이번 모집은 마감됐어요. 다음 기회에 함께해요 🌱
              </p>
            ) : (
              <>
                <h2 className="font-display text-2xl text-forest">참여 신청</h2>
                <p className="mt-1 mb-5 text-sm text-ink-soft">
                  아래 정보를 남겨주시면 참여 신청이 완료돼요.
                </p>
                <ApplyForm
                  campaignId={campaign.id}
                  defaultName={profile?.full_name ?? ""}
                  defaultEmail={profile?.email ?? user.email ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-leaf/10 bg-cream/40 px-4 py-3">
      <dt className="text-xs font-medium text-leaf">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  );
}
