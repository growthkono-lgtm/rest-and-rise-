"use client";

import Image from "next/image";
import { useRef } from "react";

type Activity = {
  name: string;
  tag: string;
  tagType: string;
  img: string;
  desc: string;
};

type Upcoming = { name: string; tag: string };

export default function ActivityCarousel({
  activities,
  upcoming,
}: {
  activities: Activity[];
  upcoming: Upcoming[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="mt-12">
      <div className="relative">
        {/* 좌우 화살표 */}
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="이전 활동 보기"
          className="absolute left-1 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest shadow-md ring-1 ring-forest/10 backdrop-blur transition hover:bg-white hover:shadow-lg"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="다음 활동 보기"
          className="absolute right-1 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest shadow-md ring-1 ring-forest/10 backdrop-blur transition hover:bg-white hover:shadow-lg"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          ref={trackRef}
          className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {activities.map((a) => (
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
                <h3 className="font-display text-xl text-forest">{a.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {a.desc}
                </p>
              </div>
            </div>
          ))}

          {/* 예정 활동 박스 */}
          {upcoming.map((u) => (
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
              <p className="mt-2 text-sm text-ink-soft">곧 함께할 예정이에요</p>
            </div>
          ))}

          {/* To be continued */}
          <div className="flex w-[220px] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border-2 border-dashed border-leaf/25 p-6 text-center">
            <span className="text-3xl">🌱</span>
            <p className="mt-3 font-display text-lg text-forest/60">
              To be continued…
            </p>
            <p className="mt-1 text-xs text-ink-soft">더 많은 활동이 이어져요</p>
          </div>
        </div>
      </div>

      {/* 인스타그램 채널 구독 */}
      <div className="mt-4 text-center">
        <a
          href="https://www.instagram.com/_rest.and.rise/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-forest shadow-sm ring-1 ring-forest/15 transition hover:shadow-md"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-gold via-leaf to-forest text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
            </svg>
          </span>
          소식 둘러보기
        </a>
      </div>
    </div>
  );
}
