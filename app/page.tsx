import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import QuestMap from "@/components/QuestMap";
import { createClient } from "@/lib/supabase/server";
import type { Campaign } from "@/lib/types";

const CAT_BADGE: Record<string, string> = {
  봉사: "bg-forest text-white",
  리트릿: "bg-gold text-forest-deep",
  캠페인: "bg-leaf text-white",
};

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
    .eq("status", "open")
    .order("activity_date", { ascending: true })
    .returns<Campaign[]>();
  const campaigns = data ?? [];

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-field relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 sm:py-24 lg:grid-cols-2">
            <div className="animate-grow-in text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-forest">
                🌱 Give Back Seed · 소셜 웰니스 리트릿
              </span>
              <h1 className="mt-5 font-display text-4xl leading-tight text-forest text-balance sm:text-5xl lg:text-6xl">
                남을 돕는 여정에서
                <br />
                <span className="text-leaf">진짜 웰니스</span>를 만나다
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-soft lg:mx-0">
                베풂을 먹고 자라는 씨앗, <b className="text-forest">기백씨</b>.
                돌봄이 필요한 곳에 함께하고 그 자리에서{" "}
                <b className="text-forest">웰니스 리트릿</b>을 나누며, 남을 돕는
                일이 곧 나의 회복이 되는 순간을 경험해요.
              </p>
              <div className="mx-auto mt-5 inline-flex max-w-md items-center gap-2 rounded-2xl border border-gold/40 bg-butter/40 px-4 py-2.5 text-sm text-forest-deep lg:mx-0">
                <span className="text-lg">🎟️</span>
                <span>
                  참여할수록 기백씨가 <b>5P·10P씩</b> 쌓여,{" "}
                  <b>유료 웰니스 프로그램 할인</b>으로 돌아와요.
                </span>
              </div>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/signup"
                  className="w-full rounded-full bg-forest px-7 py-3.5 text-center font-medium text-white shadow-md transition-colors hover:bg-forest-deep sm:w-auto"
                >
                  기백씨와 함께하기
                </Link>
                <Link
                  href="/#story"
                  className="w-full rounded-full border border-leaf/30 bg-white px-7 py-3.5 text-center font-medium text-forest transition-colors hover:bg-cream-deep sm:w-auto"
                >
                  세계관 살펴보기
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <QuestMap />
            </div>
          </div>
        </section>

        {/* STORY / 세계관 */}
        <section id="story" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-2 flex justify-center lg:order-1">
                <Image
                  src="/brand/gibaek-thumbsup.png"
                  alt="기백씨"
                  width={420}
                  height={420}
                  className="h-auto w-64 object-contain sm:w-80"
                />
              </div>
              <div className="order-1 lg:order-2">
                <p className="font-medium text-leaf">기백씨 · Give Back Seed</p>
                <h2 className="mt-2 font-display text-3xl text-forest sm:text-4xl">
                  돌려줄수록 자라나는 씨앗
                </h2>
                <div className="mt-5 space-y-4 text-ink-soft leading-relaxed">
                  <p>
                    기백씨는 <b className="text-forest">‘Give Back Seed’</b>,
                    베풂을 먹고 자라는 작은 씨앗이에요. 처음엔 곤히 잠들어 있지만,
                    당신이 봉사와 캠페인에 참여할 때마다 조금씩 눈을 뜹니다.
                  </p>
                  <p>
                    가장 높은 차원의 자기 성찰은 남을 돕고 나를 돕는 일에서
                    가능하다고 믿어요. 한 번의 활동이 하나의 씨앗이 되고, 그
                    씨앗이 모여 <b className="text-forest">회복의 숲</b>이 됩니다.
                  </p>
                  <p>
                    나를 위한 웰니스가 우리 사회를 위한 웰니스로. 그게
                    레스트앤라이즈의 세계관이에요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVITIES — 우리의 활동 */}
        <section id="activities" className="scroll-mt-20 bg-cream-deep/50">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="text-center">
              <p className="font-medium text-leaf">OUR ACTIVITIES</p>
              <h2 className="mt-2 font-display text-3xl text-forest sm:text-4xl">
                봉사, 그리고 우리를 위한 웰니스 리트릿
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
                돌봄이 필요한 곳에 함께하고, 봉사자들끼리도 스스로를 챙겨요. 남을
                돕는 여정 속에서 함께 회복하는 레스트앤라이즈의 활동이에요.
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
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            CAT_BADGE[c.category] ?? "bg-forest text-white"
                          }`}
                        >
                          {c.category}
                        </span>
                        <span className="text-xs font-semibold text-forest">
                          ● 모집 중
                        </span>
                      </div>
                      <h4 className="mt-3 font-display text-xl text-forest">
                        {c.title}
                      </h4>
                      <div className="mt-2 space-y-0.5 text-sm text-ink-soft">
                        <p>📅 {fmtDate(c.activity_date)}</p>
                        <p>📍 {c.location ?? "추후 안내"}</p>
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

                <h3 className="mt-16 text-center font-display text-2xl text-forest">
                  함께 걸어온 활동
                </h3>
              </div>
            )}

            {/* 스와이프 카드 */}
            <div className="mt-12">
              <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ACTIVITIES.map((a) => (
                  <div
                    key={a.name}
                    className="group w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-leaf/15 bg-white shadow-sm transition-shadow hover:shadow-md sm:w-[300px]"
                  >
                    {/* 활동 사진 */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={a.img}
                        alt={a.name}
                        fill
                        sizes="300px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                          a.tagType === "봉사"
                            ? "bg-forest text-white"
                            : "bg-gold text-forest-deep"
                        }`}
                      >
                        {a.tag}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl text-forest">
                        {a.name}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                        {a.desc}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 예정 활동 박스 */}
                {UPCOMING.map((u) => (
                  <div
                    key={u.name}
                    className="flex w-[280px] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border-2 border-dashed border-leaf/30 bg-cream/40 p-6 text-center sm:w-[300px]"
                  >
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-ink-soft">
                      {u.tag}
                    </span>
                    <p className="mt-4 font-display text-xl text-forest/70">
                      {u.name}
                    </p>
                    <p className="mt-2 text-sm text-ink-soft">
                      곧 함께할 예정이에요
                    </p>
                  </div>
                ))}

                {/* To be continued */}
                <div className="flex w-[220px] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border-2 border-dashed border-leaf/25 p-6 text-center">
                  <span className="text-3xl">🌱</span>
                  <p className="mt-3 font-display text-lg text-forest/60">
                    To be continued…
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    더 많은 활동이 이어져요
                  </p>
                </div>
              </div>

              <p className="mt-2 text-center text-xs text-ink-soft/60">
                ← 옆으로 넘겨보세요 →
              </p>
            </div>
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
        <section className="bg-cream-deep/50">
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

        {/* CTA */}
        <section className="bg-forest">
          <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-white text-balance sm:text-4xl">
              당신의 첫 씨앗을 심어볼까요?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-cream/80">
              곧 더 많은 분들과 함께할 준비를 마쳤어요. 지금 기백씨와 함께 회복과
              성장의 여정을 시작해보세요.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-full bg-gold px-8 py-3.5 font-medium text-forest-deep shadow-md transition-transform hover:scale-105"
            >
              무료로 함께하기
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
