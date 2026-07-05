import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuthForm from "@/components/AuthForm";
import QuestMap from "@/components/QuestMap";
import HeroMapParallax from "@/components/HeroMapParallax";
import WorldGameMap from "@/components/WorldGameMap";
import ActivityCarousel from "@/components/ActivityCarousel";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

function fmtDate(d: string | null) {
  if (!d) return "일정 조율 중";
  return new Date(d).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

// 실제 활동 내역 — 봉사 + 봉사자 스스로를 위한 웰니스 리트릿.
const ACTIVITIES = [
  {
    name: "플로깅",
    tag: "봉사 · 환경",
    tagType: "봉사",
    img: "/brand/activities/plogging.jpg",
    desc: "걸으며 쓰레기를 줍고, 지나는 길마다 자연을 회복시켜요.",
  },
  {
    name: "유기견 보호소 지원",
    tag: "봉사 · 동물",
    tagType: "봉사",
    img: "/brand/activities/shelter.jpg",
    desc: "보호소의 강아지들을 돌보고, 따뜻한 손길을 나눠요.",
  },
  {
    name: "웰니스 인터뷰",
    tag: "웰니스 리트릿",
    tagType: "리트릿",
    img: "/brand/activities/tea.jpg",
    desc: "서로의 회복 이야기를 묻고 들으며, 나의 웰니스를 돌아봐요.",
  },
  {
    name: "내면의 웰니스 대화",
    tag: "웰니스 리트릿",
    tagType: "리트릿",
    img: "/brand/activities/talk.jpg",
    desc: "서로의 내면을 나누며, 봉사자 스스로의 회복을 챙겨요.",
  },
];

// 앞으로 이어질 예정 활동 (To be continued)
const UPCOMING = [
  { name: "시니어 말벗 봉사", tag: "봉사 · 예정" },
  { name: "숲 명상 리트릿", tag: "리트릿 · 예정" },
  { name: "요가 명상", tag: "리트릿 · 예정" },
  { name: "원격 웰니스 캠페인", tag: "캠페인 · 예정" },
];

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .is("deleted_at", null)
    .returns<Campaign[]>();
  const all = data ?? [];

  // 모집 중 프로그램 (날짜 빠른 순)
  const campaigns = all
    .filter((c) => c.status === "open")
    .sort((a, b) => (a.activity_date ?? "").localeCompare(b.activity_date ?? ""));

  // 완료된 활동 → 여정 히스토리 (최근 순)
  const completed = all
    .filter((c) => c.status === "completed")
    .sort((a, b) => (b.activity_date ?? "").localeCompare(a.activity_date ?? ""));

  const journeyActivities = completed.map((c) => ({
    name: c.title,
    tag: c.category,
    tagType: c.category,
    desc: c.description ?? "",
    date: fmtDate(c.activity_date),
  }));

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-field relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 sm:py-24 lg:grid-cols-2">
            <div className="animate-grow-in text-center lg:text-left">
              <h1 className="font-display text-4xl leading-[1.2] text-forest text-balance sm:text-5xl sm:leading-[1.15] lg:text-[3.4rem]">
                다른 생명을 돕는 일이 곧{" "}
                <span className="text-leaf">나의 웰니스</span>가 되다
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-soft text-balance lg:mx-0">
                회복과 성장을 함께 만드는 소셜 임팩트 커뮤니티
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/#story"
                  className="w-full rounded-full bg-forest px-7 py-3.5 text-center font-medium text-white shadow-md transition-colors hover:bg-forest-deep sm:w-auto"
                >
                  여정 둘러보기
                </Link>
                <Link
                  href="/#activities"
                  className="w-full rounded-full border border-leaf/30 bg-white px-7 py-3.5 text-center font-medium text-forest transition-colors hover:bg-cream-deep sm:w-auto"
                >
                  프로그램 참여하기
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <HeroMapParallax>
                <QuestMap showProgress={false} />
              </HeroMapParallax>
            </div>
          </div>
        </section>

        {/* STORY / 세계관 — 기백씨가 마을을 돌며 씨앗을 키우는 게임보드 */}
        <section
          id="story"
          className="flex min-h-[100svh] scroll-mt-20 flex-col overflow-hidden bg-[#dcebc0]"
        >
          {/* 상단 헤드카피 */}
          <div className="px-5 pb-2 pt-14 text-center sm:pt-20">
            <p className="font-medium text-leaf">기백씨 · Give Back Seed</p>
            <h2 className="mt-2 font-display text-3xl text-forest text-balance sm:text-4xl">
              생명을 돕는 일이 나를 위한 웰니스 포인트
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft leading-relaxed">
              우리 일상에 필요한 의미와 가치를 느끼며 나만의 기백씨를 키워보세요.
            </p>

            {/* 기백씨 자기소개 · 활용법 말풍선 */}
            <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-leaf/25 bg-white/75 p-4 text-left shadow-sm backdrop-blur sm:gap-4 sm:p-5">
              <Image
                src="/brand/gibaek-thumbsup.png"
                alt="기백씨"
                width={72}
                height={66}
                className="h-14 w-auto shrink-0 object-contain sm:h-16"
              />
              <p className="text-sm leading-relaxed text-ink-soft text-pretty sm:text-[15px]">
                안녕하세요, 나는 <b className="text-forest">기백씨</b>예요. ‘Give
                Back Seed’, 베풂을 먹고 자라는 작은 씨앗이죠. 여러분이 봉사·캠페인에
                함께할 때마다 <b className="text-forest">포인트를 이고 무럭무럭</b>{" "}
                자라나요. 남을 돕는 일이 곧 나를 돕는 일, 우리 함께 회복의 숲을
                키워가요.
              </p>
            </div>
          </div>

          {/* 마을 게임보드 (남는 공간 채움) */}
          <div className="relative min-h-0 flex-1 px-4 pb-2">
            <WorldGameMap />
          </div>

          {/* 하단 CTA */}
          <div className="px-5 pb-14 pt-4 text-center">
            <Link
              href="/signup"
              className="inline-block rounded-full bg-forest px-8 py-3.5 font-medium text-white shadow-lg transition-transform hover:scale-105"
            >
              내 씨앗 만들기 →
            </Link>
          </div>
        </section>

        {/* ACTIVITIES — 우리의 활동 */}
        <section id="activities" className="scroll-mt-20 bg-cream-deep/60">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="text-center">
              <p className="font-medium text-leaf">OUR ACTIVITIES</p>
              <h2 className="mt-2 font-display text-3xl text-forest sm:text-4xl">
                이달의 소셜 커뮤니티 프로그램
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
                레스트앤라이즈만의 <b className="text-forest">웰니스스러운 봉사활동과
                모임</b>에 함께 해요.
              </p>
              <p className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1.5 text-sm text-ink-soft">
                💬 모든 프로그램은 참여 신청 후 안내 메시지를 확인해 주세요.
              </p>
            </div>

            {/* 지금 모집 중 */}
            {campaigns.length > 0 && (
              <div className="mt-10">
                <div className="mb-6 flex items-center justify-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest/50" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-forest" />
                  </span>
                  <h3 className="font-display text-2xl text-forest">
                    지금 모집 중
                  </h3>
                </div>
                <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
                  {campaigns.map((c) => (
                    <div
                      key={c.id}
                      className="flex flex-col rounded-2xl border-2 border-forest/20 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-butter px-2.5 py-1 text-xs font-semibold text-forest-deep">
                          {c.fee_label ?? "무료"}
                        </span>
                        <span className="text-xs font-semibold text-forest">
                          ● 모집 중
                        </span>
                      </div>
                      <h4 className="mt-3 font-display text-xl text-forest">
                        {c.title}
                      </h4>
                      <div className="mt-2 space-y-0.5 text-sm text-ink-soft">
                        <p>
                          📅 {fmtDate(c.activity_date)}
                          {c.activity_time ? ` ${c.activity_time}` : ""}
                        </p>
                        <p>📍 {c.location ?? "추후 안내"}</p>
                        {c.fee_note && (
                          <p className="text-ink-soft/70">🧾 {c.fee_note}</p>
                        )}
                      </div>
                      {c.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                          {c.description}
                        </p>
                      )}
                      <Link
                        href={`/campaigns/${c.id}`}
                        className="mt-5 inline-block rounded-full bg-forest px-6 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-forest-deep"
                      >
                        참여하기 →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* JOURNEY — 함께 걸어온 활동 */}
        <section id="journey" className="scroll-mt-20 bg-mist">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="text-center">
              <p className="font-medium text-leaf">OUR JOURNEY</p>
              <h2 className="mt-2 font-display text-3xl text-forest sm:text-4xl">
                정기 활동 히스토리
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
                레스트앤라이즈가 지나온 봉사와 웰니스의 순간들이에요.
              </p>
            </div>

            {/* 스와이프 카드 — 완료된 활동이 있으면 실제 데이터, 없으면 샘플 */}
            <ActivityCarousel
              activities={
                journeyActivities.length > 0 ? journeyActivities : ACTIVITIES
              }
              upcoming={UPCOMING}
            />
          </div>
        </section>

        {/* CAMPAIGN */}
        <section id="campaign" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="text-center">
              <p className="font-medium text-leaf">REST & RISE CAMPAIGN</p>
              <h2 className="mt-2 font-display text-3xl text-forest sm:text-4xl">
                밀도 높은 회복, 더 나은 변화의 힘
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: "🧘",
                  title: "REST · 회복",
                  desc: "스스로를 돌보는 밀도 높은 회복. 지친 나를 다시 일으켜 세우는 웰니스 루틴과 프로그램을 함께해요.",
                },
                {
                  icon: "🌿",
                  title: "RISE · 성장",
                  desc: "더 나은 환경으로 변화하는 힘을 키워요. 봉사와 캠페인을 통해 나와 이웃이 함께 성장합니다.",
                },
                {
                  icon: "🤝",
                  title: "SOCIAL · 나눔",
                  desc: "나를 챙기는 웰니스가 사회 전반에 도움이 되도록. 회복이 널리 퍼지는 소셜 캠페인을 만들어요.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-leaf/15 bg-cream p-7 shadow-sm"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-forest/10 text-3xl">
                    {c.icon}
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-forest">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-cream-deep/60">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="text-center">
              <h2 className="font-display text-3xl text-forest sm:text-4xl">
                이렇게 함께해요
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
                <b className="text-forest">남을 돕는 일이 곧 나를 돕는 일.</b>{" "}
                나눔이 기백씨로 쌓이고, 다시 나의 웰니스로 돌아오는 선순환이에요.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "가입하고 기백씨 받기",
                  desc: "회원가입하면 첫 씨앗과 함께 5P(50원)를 선물로 드려요.",
                },
                {
                  step: "02",
                  title: "나눔에 함께하기",
                  desc: "봉사·캠페인에 참여하고, 커뮤니티에서도 함께 나눠요.",
                },
                {
                  step: "03",
                  title: "기백씨 모으고 키우기",
                  desc: "참여가 승인될 때마다 10P씩, 기백씨가 자라며 포인트가 쌓여요.",
                },
                {
                  step: "04",
                  title: "웰니스로 돌려받기",
                  desc: "모인 기백씨로 유료 웰니스 프로그램을 할인받아요.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="relative rounded-2xl border border-leaf/15 bg-white p-7 shadow-sm"
                >
                  <span className="font-display text-4xl text-sprout">
                    {s.step}
                  </span>
                  <h3 className="mt-2 font-display text-xl text-forest">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — 바로 회원가입 */}
        <section id="join" className="scroll-mt-20 bg-forest">
          <div className="mx-auto max-w-md px-5 py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              레스트앤라이즈
              <br />
              크루 신청하기
            </h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-cream/80">
              봉사로 내 마음속 씨앗을 키우며, 회복과 성장의 여정을 함께해요.
            </p>
            <div className="mt-8 rounded-3xl bg-white p-6 text-left shadow-lg sm:p-8">
              <AuthForm mode="signup" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
