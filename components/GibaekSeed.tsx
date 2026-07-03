import Image from "next/image";
import { STAGES, computeGrowth } from "@/lib/growth";

export default function GibaekSeed({
  count,
  name,
}: {
  count: number;
  name?: string | null;
}) {
  const g = computeGrowth(count);
  const pct = Math.round(g.progress * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-leaf/15 bg-white p-6 shadow-sm sm:p-8">
      <div className="bg-field pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* 캐릭터 장면 */}
        <div className="relative flex h-40 w-40 shrink-0 items-end justify-center rounded-full bg-gradient-to-b from-sky/40 to-butter/50">
          <div className="absolute bottom-0 h-14 w-full rounded-b-full bg-sprout/25" />
          <Image
            src="/brand/gibaek-thumbsup.png"
            alt="기백씨"
            width={150}
            height={150}
            className="animate-float relative z-10 h-36 w-auto object-contain drop-shadow-sm"
            priority
          />
          <span className="absolute -right-1 top-2 z-20 grid h-11 w-11 place-items-center rounded-full bg-white text-2xl shadow-md">
            {g.stage.emoji}
          </span>
        </div>

        {/* 상태 */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-medium text-leaf">
            {name ? `${name} 님의 기백씨` : "나의 기백씨"}
          </p>
          <h3 className="mt-0.5 font-display text-3xl text-forest">
            {g.stage.name}
            <span className="ml-2 align-middle text-base font-sans font-medium text-ink-soft">
              Lv.{g.stageIndex + 1}
            </span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {g.stage.blurb}
          </p>

          {/* 진행 바 */}
          <div className="mt-4">
            <div className="h-3 overflow-hidden rounded-full bg-cream-deep">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sprout to-forest transition-all"
                style={{ width: `${g.next ? pct : 100}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-ink-soft">
              <span>모은 씨앗 🌰 {count}개</span>
              <span>
                {g.next
                  ? `다음 단계 '${g.next.name}'까지 ${g.toNext}회`
                  : "최고 단계 달성 🎉"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 단계 로드맵 */}
      <div className="relative mt-6 flex items-center justify-between gap-1">
        {STAGES.map((s, i) => {
          const reached = i <= g.stageIndex;
          const current = i === g.stageIndex;
          return (
            <div key={s.key} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={[
                  "grid h-10 w-10 place-items-center rounded-full text-lg transition-all",
                  reached ? "bg-sprout/20" : "bg-cream-deep",
                  current ? "ring-2 ring-forest scale-110" : "",
                ].join(" ")}
              >
                <span className={reached ? "" : "opacity-40 grayscale"}>
                  {s.emoji}
                </span>
              </div>
              <span
                className={[
                  "text-[11px]",
                  current
                    ? "font-bold text-forest"
                    : reached
                      ? "text-ink-soft"
                      : "text-ink-soft/50",
                ].join(" ")}
              >
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
