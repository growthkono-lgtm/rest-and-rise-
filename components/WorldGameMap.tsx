"use client";

import { useEffect, useState } from "react";

/**
 * 레스트앤라이즈 마을 게임보드 (2번 섹션).
 * 바깥 링에 봉사 스팟(어르신·유기동물·아이들·환경·이웃), 가운데엔 다 같이
 * 모여 쉬는 "웰니스 경험" 집. 기백씨 무리가 함께 길을 돌며 봉사할 때마다
 * 포인트(+30/+50/+100)가 하나 팝 떴다 사라지고, 조금씩 자란다.
 */

type Spot = {
  key: string;
  emoji: string;
  label: string;
  x: number;
  y: number;
  gain: number;
};

const SPOTS: Spot[] = [
  { key: "senior", emoji: "🧓", label: "어르신 말벗", x: 270, y: 300, gain: 30 },
  { key: "animal", emoji: "🐶", label: "유기동물 보호소", x: 540, y: 220, gain: 50 },
  { key: "kids", emoji: "🧒", label: "보육원 아이들", x: 810, y: 300, gain: 50 },
  { key: "nature", emoji: "🌳", label: "자연·환경", x: 710, y: 540, gain: 100 },
  { key: "neighbor", emoji: "🤝", label: "이웃 나눔", x: 370, y: 540, gain: 30 },
];

// 함께 다니는 기백씨 무리 (대·중·소)
const CREW = [
  { dx: 0, dy: 0, s: 1.0, delay: 0 },
  { dx: -48, dy: 15, s: 0.74, delay: 0.25 },
  { dx: 46, dy: 11, s: 0.68, delay: 0.5 },
];

// 길가 마을 소품 (동선 주변, 바깥쪽) — 은은하게만
const PROPS: { e: string; x: number; y: number; s: number }[] = [
  { e: "🌳", x: 175, y: 235, s: 32 },
  { e: "🌳", x: 905, y: 400, s: 32 },
  { e: "🪑", x: 540, y: 625, s: 28 },
];

// 어슬렁거리는 주민·동물 (링과 가운데 집 사이 빈 공간) — 소수만
const VILLAGERS: { e: string; x: number; y: number; s: number; delay: number }[] = [
  { e: "👵", x: 385, y: 300, s: 27, delay: 0 },
  { e: "👴", x: 685, y: 300, s: 27, delay: 1.4 },
  { e: "🐕", x: 540, y: 500, s: 24, delay: 0.6 },
];

const WALK_MS = 1400;
const PAUSE_MS = 1100;
const VB_W = 1080;
const VB_H = 720;

const LOOP_D = "M270 300 L540 220 L810 300 L710 540 L370 540 Z";

export default function WorldGameMap() {
  const [reduced, setReduced] = useState(false);
  const [pos, setPos] = useState(0);
  const [done, setDone] = useState<boolean[]>(() => SPOTS.map(() => false));
  const [pop, setPop] = useState<{ id: number; gain: number }>({ id: 0, gain: 0 });

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const arrive = setTimeout(() => {
      setDone((d) => {
        const n = [...d];
        n[pos] = true;
        return n;
      });
      setPop((prev) => ({ id: prev.id + 1, gain: SPOTS[pos].gain }));
    }, WALK_MS);
    const next = setTimeout(() => {
      const ni = (pos + 1) % SPOTS.length;
      if (ni === 0) setDone(SPOTS.map(() => false));
      setPos(ni);
    }, WALK_MS + PAUSE_MS);
    return () => {
      clearTimeout(arrive);
      clearTimeout(next);
    };
  }, [pos, reduced]);

  const p = SPOTS[pos];
  const doneCount = done.filter(Boolean).length;
  const grow = 0.7 + doneCount * 0.09; // 씨앗 → 성장

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="block h-full w-full"
      role="img"
      aria-label="레스트앤라이즈 활동 지도 — 기백씨들이 함께 봉사하며 자라나요"
    >
      <defs>
        <radialGradient id="ground" cx="50%" cy="45%" r="72%">
          <stop offset="0%" stopColor="#f1f6e0" />
          <stop offset="100%" stopColor="#dcebc0" />
        </radialGradient>
      </defs>

      {/* 바닥 */}
      <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#ground)" />
      <g opacity="0.5">
        <ellipse cx="250" cy="220" rx="220" ry="140" fill="#d6e9ac" />
        <ellipse cx="860" cy="230" rx="210" ry="140" fill="#e6edb2" />
        <ellipse cx="240" cy="560" rx="210" ry="140" fill="#d8e9b4" />
        <ellipse cx="860" cy="560" rx="220" ry="140" fill="#d0e6ae" />
      </g>

      {/* 순환 길 */}
      <path d={LOOP_D} fill="none" stroke="#fbf7e9" strokeWidth="26" strokeLinejoin="round" strokeLinecap="round" />
      <path d={LOOP_D} fill="none" stroke="#cde0a3" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1 24" />

      {/* 길가 마을 소품 */}
      {PROPS.map((n, i) => (
        <text key={`prop-${i}`} x={n.x} y={n.y} fontSize={n.s} textAnchor="middle">
          {n.e}
        </text>
      ))}

      {/* 어슬렁거리는 주민·동물 */}
      {VILLAGERS.map((v, i) => (
        <g key={`vil-${i}`} transform={`translate(${v.x} ${v.y})`}>
          <ellipse cx="0" cy={v.s * 0.42} rx={v.s * 0.32} ry={v.s * 0.12} fill="#1f7a4d" opacity="0.12" />
          <g className={reduced ? "" : "village-wander"} style={{ animationDelay: `${v.delay}s` }}>
            <text x="0" y={v.s * 0.34} fontSize={v.s} textAnchor="middle">
              {v.e}
            </text>
          </g>
        </g>
      ))}

      {/* 가운데 — 다 같이 모여 쉬는 "웰니스 경험" 집 */}
      <g transform="translate(540 372)">
        <ellipse cx="0" cy="78" rx="120" ry="26" fill="#1f7a4d" opacity="0.08" />
        <ellipse cx="0" cy="14" rx="122" ry="92" fill="#fbf6de" stroke="#8fc63d" strokeWidth="3" />
        {/* 집 */}
        <text x="0" y="0" fontSize="60" textAnchor="middle">🏡</text>
        {/* 모여 쉬는 사람들 */}
        <text x="-40" y="54" fontSize="26" textAnchor="middle">👵</text>
        <text x="0" y="58" fontSize="24" textAnchor="middle">🧒</text>
        <text x="40" y="54" fontSize="26" textAnchor="middle">🧑</text>
        {/* 라벨 */}
        <g transform="translate(0 104)">
          <rect x="-58" y="-15" width="116" height="30" rx="15" fill="#1f7a4d" />
          <text x="0" y="5" fontSize="16" fontWeight="700" fill="#ffffff" textAnchor="middle">
            웰니스 경험
          </text>
        </g>
      </g>

      {/* 봉사 스팟 */}
      {SPOTS.map((s, i) => {
        const cleared = done[i];
        const pillW = s.label.length * 16 + 22;
        return (
          <g key={s.key} transform={`translate(${s.x} ${s.y})`}>
            <ellipse cx="0" cy="42" rx="40" ry="11" fill="#1f7a4d" opacity="0.12" />
            <circle cx="0" cy="0" r="38" fill="#ffffff" stroke={cleared ? "#1f7a4d" : "#8fc63d"} strokeWidth={cleared ? 5 : 3} />
            <text x="0" y="13" fontSize="34" textAnchor="middle">
              {s.emoji}
            </text>
            {cleared && (
              <g key={`chk-${i}`} className="pin-pop" transform="translate(27 -27)">
                <circle cx="0" cy="0" r="12" fill="#1f7a4d" stroke="#fff" strokeWidth="3" />
                <text x="0" y="4" fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle">
                  ✓
                </text>
              </g>
            )}
            <g transform="translate(0 66)">
              <rect
                x={-pillW / 2}
                y="-15"
                width={pillW}
                height="30"
                rx="15"
                fill={cleared ? "#1f7a4d" : "#ffffff"}
                stroke={cleared ? "#1f7a4d" : "#dbe9c2"}
                strokeWidth="2"
              />
              <text x="0" y="5" fontSize="15" fontWeight="700" fill={cleared ? "#ffffff" : "#1f7a4d"} textAnchor="middle">
                {s.label}
              </text>
            </g>
          </g>
        );
      })}

      {/* 기백씨 무리 — 함께 마을을 돌며 성장 */}
      <g
        style={{
          transform: `translate(${p.x}px, ${p.y}px)`,
          transition: reduced ? undefined : `transform ${WALK_MS}ms cubic-bezier(0.5,0.02,0.35,1)`,
        }}
      >
        {/* 도착 시 포인트 하나 팝 → 사라짐 (위치용 g + 애니메이션용 g 분리) */}
        {pop.id > 0 && (
          <g transform="translate(0 -132)">
            <g key={pop.id} className={reduced ? "" : "point-pop"}>
              <rect x="-27" y="-15" width="54" height="28" rx="14" fill="#1f7a4d" />
              <text x="0" y="5" fontSize="18" fontWeight="700" fill="#ffffff" textAnchor="middle">
                +{pop.gain}
              </text>
            </g>
          </g>
        )}

        {/* 기백씨 무리 (뒤→앞 순서로 그림) */}
        {CREW.map((c, i) => {
          const sc = grow * c.s;
          return (
            <g key={i} transform={`translate(${c.dx} ${c.dy})`}>
              <ellipse cx="0" cy="4" rx={26 * sc} ry={7 * sc} fill="#1f7a4d" opacity="0.16" />
              <g
                className={reduced ? "" : "village-wander"}
                style={{ animationDelay: `${c.delay}s` }}
              >
                <g
                  style={{
                    transform: `scale(${sc})`,
                    transformBox: "fill-box",
                    transformOrigin: "50% 100%",
                    transition: reduced ? undefined : "transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  <image href="/brand/gibaek-thumbsup.png" x="-60" y="-108" width="120" height="108" />
                </g>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
