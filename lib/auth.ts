import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

/**
 * 현재 로그인 사용자의 역할을 확인한다.
 * owner = 관리자(최고권한), manager = 부관리자, member = 일반.
 */
export async function getViewer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: "member" as Role };

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { supabase, user, role: (data?.role as Role) ?? "member" };
}

/** 운영진(오너 또는 부관리자)만 통과. 아니면 null. */
export async function requireStaff() {
  const ctx = await getViewer();
  if (!ctx.user || (ctx.role !== "owner" && ctx.role !== "manager")) return null;
  return { supabase: ctx.supabase, user: ctx.user, role: ctx.role };
}

/** 오너(관리자)만 통과. 아니면 null. */
export async function requireOwner() {
  const ctx = await getViewer();
  if (!ctx.user || ctx.role !== "owner") return null;
  return { supabase: ctx.supabase, user: ctx.user, role: ctx.role };
}
