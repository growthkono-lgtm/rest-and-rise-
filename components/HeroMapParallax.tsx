"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 히어로의 원형 맵이 스크롤을 내릴 때 아래로 이동하며 커지도록 하는 래퍼.
 * 아래 2번 섹션의 마을 지도로 이어지는 느낌을 준다.
 */
export default function HeroMapParallax({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0); // 0(히어로 상단) → 1(히어로 벗어남)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const vh = window.innerHeight || 1;
        // 요소가 화면 상단으로 밀려 올라간 정도(0~1)
        const top = el.getBoundingClientRect().top;
        const prog = Math.min(1, Math.max(0, (vh * 0.35 - top) / (vh * 0.7)));
        setP(prog);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-md"
      style={{
        transform: `translateY(${p * 70}px) scale(${1 + p * 0.16})`,
        transition: "transform 0.15s linear",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
