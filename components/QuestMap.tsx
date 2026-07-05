"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * 히어로용 게임 맵 애니메이션.
 * 원형 맵(logo.png)을 게임판으로 삼아, 기백씨가 존과 존 사이를
 * 통통 뛰어다니며 퀘스트를 하나씩 클리어한다. 무한 반복.
 * 좌표는 맵 컨테이너(정사각형) 대비 % 값이다.
 */

type Quest = {
  emoji: string;
  short: string; // 맵에 항상 보이는 짧은 라벨
  label: string; // 도착 시 말풍선 문구
  x: number; // 0~100 (%)
  y: number; // 0~100 (%)
};

// 맵의 각 존 위에 배치 — 실제 봉사 대상(스팟)을 나타낸다. 링을 돌며 하나씩 방문.
const QUESTS: Quest[] = [
  { emoji: "🧓", short: "어르신", label: "어르신 말벗", x: 17, y: 51 },
  { emoji: "🐶", short: "유기동물", label: "유기동물 돌봄", x: 33, y: 23 },
  { emoji: "🌳", short: "자연·환경", label: "자연·환경 지킴", x: 55, y: 15 },
  { emoji: "🧒", short: "아이들", label: "보육원 아이들", x: 85, y: 45 },
  { emoji: "🤝", short: "이웃 나눔", label: "이웃 나눔", x: 49, y: 84 },
];

const WALK_MS = 1300; // 이동 시간 (CSS transition과 맞춤)
const PAUSE_MS = 1200; // 도착 후 퀘스트 클리어 연출 시간

// 링 형태로 잇는 경로 세그먼트 (마지막→처음 닫음)
const SEGMENTS = QUESTS.map((q, i) => {
  const next = QUESTS[(i + 1) % QUESTS.length];
  return { x1: q.x, y1: q.y, x2: next.x, y2: next.y };
});

export default function QuestMap({
  showProgress = true,
  className,
}: {
  showProgress?: boolean;
  className?: string;
}) {
  const [pos, setPos] = useState(0); // 기백씨가 향하는 퀘스트 index
  const [walking, setWalking] = useState(false);
  const [done, setDone] = useState<boolean[]>(() =>
    QUESTS.map((_, i) => i === 0),
  );
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (reduced) return;

    // pos로 걸어가는 중 → 도착하면 클리어 표시 → 잠시 후 다음 퀘스트로
    const arrive = setTimeout(() => {
      setWalking(false);
      setDone((d) => {
        const n = [...d];
        n[pos] = true;
        return n;
      });
    }, WALK_MS);

    const next = setTimeout(() => {
      const nextIdx = (pos + 1) % QUESTS.length;
      if (nextIdx === 0) setDone(QUESTS.map(() => false)); // 새 랩 시작 → 초기화
      setWalking(true);
      setPos(nextIdx);
    }, WALK_MS + PAUSE_MS);

    return () => {
      clearTimeout(arrive);
      clearTimeout(next);
    };
  }, [pos, reduced]);

  const current = QUESTS[pos];
  const arrived = !walking && done[pos];

  // 봉사를 깰수록 기백씨가 조금씩 자란다. (한 바퀴 리셋되면 다시 씨앗부터)
  const clearedCount = done.filter(Boolean).length;
  const growScale = 0.7 + clearedCount * 0.1; // 0.7(씨앗) → 1.2(다 자람)

  return (
    <div
      className={`relative mx-auto aspect-square w-full ${
        className ?? "animate-grow-in max-w-md"
      }`}
    >
      {/* 부드럽게 떠다니는 맵 보드 */}
      <div className="animate-float relative h-full w-full">
        {/* 맵 그림자 */}
        <div className="absolute inset-x-6 bottom-1 -z-10 h-8 rounded-[50%] bg-forest/15 blur-xl" />

        {/* 원형 맵 */}
        <Image
          src="/brand/logo.png"
          alt="레스트앤라이즈 세계 지도"
          fill
          priority
          sizes="(max-width: 640px) 90vw, 420px"
          className="rounded-full object-contain drop-shadow-sm select-none"
        />

        {/* 퀘스트를 잇는 게임 보드 경로 */}
        <svg
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          {SEGMENTS.map((s, i) => {
            const traveled = seg_done(done, i);
            return (
              <line
                key={i}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke={traveled ? "#5fa425" : "#ffffff"}
                strokeOpacity={traveled ? 0.9 : 0.7}
                strokeWidth={traveled ? 1.6 : 1.3}
                strokeLinecap="round"
                strokeDasharray="0.1 4"
              />
            );
          })}
        </svg>

        {/* 봉사 스팟 (핀 + 이름) */}
        {QUESTS.map((q, i) => {
          const isTarget = i === pos && walking;
          const cleared = done[i];
          const labelAbove = q.y > 70; // 하단 스팟은 라벨을 위로
          return (
            <div
              key={q.short}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${q.x}%`, top: `${q.y}%` }}
            >
              {isTarget && (
                <span className="pin-ring absolute inset-0 rounded-full border-2 border-forest" />
              )}

              {/* 스팟 아이콘 (클리어돼도 정체성 유지) */}
              <div
                className={`relative grid h-9 w-9 place-items-center rounded-full text-base shadow-md ring-2 transition-all sm:h-10 sm:w-10 ${
                  cleared
                    ? "bg-white ring-forest"
                    : "bg-white/95 ring-forest/25"
                }`}
              >
                <span>{q.emoji}</span>
                {cleared && (
                  <span
                    key={`c-${i}-${cleared}`}
                    className="pin-pop absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-forest text-[9px] font-bold text-white ring-2 ring-white"
                  >
                    ✓
                  </span>
                )}
              </div>

              {/* 항상 보이는 스팟 이름 */}
              <span
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm ring-1 transition-colors sm:text-xs ${
                  cleared
                    ? "bg-forest text-white ring-forest"
                    : "bg-white/90 text-forest ring-forest/15"
                } ${labelAbove ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}
              >
                {q.short}
              </span>
            </div>
          );
        })}

        {/* 기백씨 — 퀘스트 지점 사이를 이동 */}
        <div
          className="absolute z-10"
          style={{
            left: `${current.x}%`,
            top: `${current.y}%`,
            transform: "translate(-50%, -78%)",
            transition: reduced
              ? undefined
              : `left ${WALK_MS}ms cubic-bezier(0.5,0.02,0.35,1), top ${WALK_MS}ms cubic-bezier(0.5,0.02,0.35,1)`,
          }}
        >
          {/* 발밑 그림자 */}
          <span
            className={`absolute left-1/2 top-[100%] h-2 w-10 -translate-x-1/2 rounded-[50%] bg-forest/25 blur-[2px] sm:w-12 ${
              walking ? "shadow-pulse" : ""
            }`}
          />

          {/* 도착 시 퀘스트 이름 말풍선 */}
          {arrived && (
            <div
              key={`toast-${pos}-${done[pos]}`}
              className="quest-toast absolute -top-9 left-1/2 whitespace-nowrap rounded-full bg-forest px-3 py-1 text-xs font-medium text-white shadow-lg"
            >
              {current.emoji} {current.label} 완료!
            </div>
          )}

          {/* 도착 시 반짝이 파편 */}
          {arrived && (
            <div
              key={`spark-${pos}`}
              className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2"
            >
              {SPARKS.map((s, i) => (
                <span
                  key={i}
                  className="sparkle absolute text-sm"
                  style={
                    {
                      "--sx": `${s.x}px`,
                      "--sy": `${s.y}px`,
                      animationDelay: `${s.d}ms`,
                    } as React.CSSProperties
                  }
                >
                  {s.c}
                </span>
              ))}
            </div>
          )}

          {/* 성장: 클리어할수록 스케일 업 (발밑 기준으로 커짐) */}
          <div
            style={{
              transform: `scale(${growScale})`,
              transformOrigin: "bottom center",
              transition: reduced
                ? undefined
                : "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className={walking ? "gibaek-hop" : "gibaek-idle"}>
              <Image
                src="/brand/gibaek-thumbsup.png"
                alt="기백씨"
                width={220}
                height={200}
                priority
                className="h-auto w-24 select-none object-contain sm:w-28"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 진행 상태 캡션 */}
      {showProgress && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-soft">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-sprout" />
          함께 봉사할수록 기백씨가 무럭무럭 자라나요
          <span className="font-semibold text-forest">
            {clearedCount}/{QUESTS.length}
          </span>
        </div>
      )}
    </div>
  );
}

// 세그먼트가 "지나간 길"인지 (양 끝 퀘스트 모두 클리어)
function seg_done(done: boolean[], i: number) {
  return done[i] && done[(i + 1) % done.length];
}

const SPARKS = [
  { c: "✨", x: -26, y: -22, d: 0 },
  { c: "🌱", x: 24, y: -18, d: 80 },
  { c: "✨", x: -14, y: -34, d: 160 },
  { c: "⭐", x: 18, y: -32, d: 120 },
  { c: "✨", x: 30, y: -8, d: 40 },
];
