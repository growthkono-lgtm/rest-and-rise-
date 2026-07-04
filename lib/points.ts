import type { SupabaseClient } from "@supabase/supabase-js";

/** 기백씨 포인트 환산: 1P = 10원 */
export const WON_PER_POINT = 10;

/** 활동별 지급 포인트 */
export const POINTS = {
  signup: 5, // 가입 선물
  approvedActivity: 10, // 봉사/캠페인 참여 승인
};

export type PointTx = {
  id: string;
  amount: number;
  reason: string | null;
  created_at: string;
};

export async function getPoints(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("point_transactions")
    .select("id, amount, reason, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  const tx = (data ?? []) as PointTx[];
  const balance = tx.reduce((sum, t) => sum + t.amount, 0);
  return { balance, tx };
}

export function wonValue(points: number) {
  return points * WON_PER_POINT;
}
