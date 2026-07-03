import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { STAGES } from "@/lib/growth";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-field relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 sm:py-24 lg:grid-cols-2">
            <div className="animate-grow-in text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-forest">
                🌱 소셜 웰니스 캠페인 프로젝트
              </span>
              <h1 className="mt-5 font-display text-4xl leading-tight text-forest text-balance sm:text-5xl lg:text-6xl">
                진짜 웰니스가 필요한 이들을 위한
                <br />
                <span className="text-leaf">회복과 성장</span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-soft lg:mx-0">
                나를 챙기는 웰니스가 사회 전반에도 도움이 되도록. 봉사에
                참여할수록 자라나는 씨앗, <b className="text-forest">기백씨</b>와
                함께 회복의 숲을 키워가요.
              </p>
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
              <div className="animate-float">
                <Image
                  src="/brand/gibaek-sign.jpeg"
                  alt="REST&RISE 팻말을 든 기백씨"
                  width={520}
                  height={560}
                  className="h-auto w-[78%] max-w-md object-contain mix-blend-multiply sm:w-full"
                  priority
                />
              </div>
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

        {/* GROWTH STAGES */}
        <section className="bg-cream-deep/50">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
            <div className="text-center">
              <h2 className="font-display text-3xl text-forest sm:text-4xl">
                봉사할수록 자라나는 기백씨
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-ink-soft">
                참여가 승인될 때마다 기백씨는 다음 단계로 성장해요. 씨앗에서
                시작해 하나의 숲이 될 때까지.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {STAGES.map((s, i) => (
                <div
                  key={s.key}
                  className="flex flex-col items-center rounded-2xl border border-leaf/15 bg-white p-5 text-center shadow-sm"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-sprout/15 text-3xl">
                    {s.emoji}
                  </div>
                  <p className="mt-3 font-display text-xl text-forest">
                    {s.name}
                  </p>
                  <p className="mt-1 text-xs font-medium text-leaf">
                    {i === STAGES.length - 1
                      ? `활동 ${s.min}회+`
                      : `활동 ${s.min}회`}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                    {s.blurb}
                  </p>
                </div>
              ))}
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
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "가입하고 기백씨 받기",
                  desc: "회원가입하면 나만의 기백씨 씨앗이 심어져요.",
                },
                {
                  step: "02",
                  title: "봉사·캠페인 참여 제출",
                  desc: "활동 내용과 인증을 남기면 우리가 확인해요.",
                },
                {
                  step: "03",
                  title: "기백씨 성장 지켜보기",
                  desc: "활동이 승인될 때마다 씨앗이 무럭무럭 자라나요.",
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
