"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** 우상단 프로필 옆 기백씨 포인트 뱃지 + 최초 1회 "내 기백씨 확인하기" 알림 */
export default function PointsBadge({ points }: { points: number }) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("rr_points_hint_seen")) return;
    setShowHint(true);
    sessionStorage.setItem("rr_points_hint_seen", "1");
    const t = setTimeout(() => setShowHint(false), 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative">
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 rounded-full border border-leaf/25 bg-white px-3 py-2 text-sm font-semibold text-forest shadow-sm transition-colors hover:bg-cream-deep"
        aria-label={`내 기백씨 포인트 ${points}P`}
      >
        <span aria-hidden>🌱</span>
        {points}
        <span className="text-xs font-medium text-leaf">P</span>
      </Link>

      {showHint && (
        <div className="absolute right-0 top-full z-50 mt-2 w-max animate-grow-in rounded-xl bg-forest px-3 py-2 text-xs font-medium text-white shadow-lg">
          <span className="absolute -top-1 right-6 h-2 w-2 rotate-45 bg-forest" />
          🌱 내 기백씨 확인하기 →
        </div>
      )}
    </div>
  );
}
