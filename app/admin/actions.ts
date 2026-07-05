"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";

export type StaffState = { error?: string; ok?: string } | null;

// 연락처로 부관리자 지정 (오너 전용)
export async function addSubAdmin(
  _prev: StaffState,
  formData: FormData,
): Promise<StaffState> {
  const ctx = await requireOwner();
  if (!ctx) return { error: "권한이 없어요." };

  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return { error: "연락처를 입력해주세요." };

  const { data, error } = await ctx.supabase.rpc("promote_manager_by_phone", {
    p_phone: phone,
  });
  if (error) return { error: "처리 중 문제가 발생했어요." };

  switch (data as string) {
    case "ok":
      revalidatePath("/admin/staff");
      return { ok: "부관리자로 지정했어요." };
    case "already":
      return { error: "이미 부관리자예요." };
    case "is_owner":
      return { error: "관리자 계정이에요." };
    case "notfound":
      return { error: "그 연락처로 가입한 회원이 없어요. 먼저 가입이 필요해요." };
    case "invalid":
      return { error: "연락처를 올바르게 입력해주세요." };
    default:
      return { error: "권한이 없어요." };
  }
}

// 부관리자 해제 → 일반으로 (오너 전용)
export async function removeSubAdmin(formData: FormData) {
  const ctx = await requireOwner();
  if (!ctx) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  await ctx.supabase.rpc("demote_to_member", { p_id: id });
  revalidatePath("/admin/staff");
}
