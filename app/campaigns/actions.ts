"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireOwner } from "@/lib/auth";

export type ApplyState = { error?: string; ok?: boolean } | null;

export async function createApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const campaign_id = String(formData.get("campaign_id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const consent_privacy = formData.get("consent_privacy") === "on";
  const consent_thirdparty = formData.get("consent_thirdparty") === "on";

  if (!name || !phone || !email) {
    return { error: "이름·연락처·이메일을 모두 입력해주세요." };
  }
  if (!/^[\d-]{9,13}$/.test(phone.replace(/\s/g, ""))) {
    return { error: "연락처를 올바르게 입력해주세요. (예: 010-1234-5678)" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "이메일 형식을 확인해주세요." };
  }
  if (!consent_privacy) {
    return { error: "개인정보 수집·이용 동의가 필요해요." };
  }
  if (!consent_thirdparty) {
    return { error: "제3자 제공 동의가 필요해요." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "로그인 후 신청할 수 있어요." };
  }

  const { error } = await supabase.from("applications").insert({
    campaign_id: campaign_id || null,
    user_id: user.id,
    name,
    phone,
    email,
    consent_privacy,
    consent_thirdparty,
  });

  if (error) {
    return { error: "신청 중 문제가 발생했어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/admin/campaigns");
  return { ok: true };
}

// ── 운영진(오너·부관리자) 전용 ──────────────────────────────────────
export async function createCampaign(formData: FormData) {
  const ctx = await requireStaff();
  if (!ctx) return;

  const fields = readCampaignFields(formData);
  if (!fields) return;

  // 등록 시 상태 선택: 모집 시작(open) 또는 완료된 지난 활동(completed)
  const statusRaw = String(formData.get("status") || "open");
  const status = statusRaw === "completed" ? "completed" : "open";

  await ctx.supabase.from("campaigns").insert({ ...fields, status });

  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}

export async function updateCampaign(formData: FormData) {
  const ctx = await requireStaff();
  if (!ctx) return;

  const id = String(formData.get("id") || "");
  if (!id) return;
  const fields = readCampaignFields(formData);
  if (!fields) return;
  const status = String(formData.get("status") || "open");

  await ctx.supabase
    .from("campaigns")
    .update({
      ...fields,
      status: ["open", "closed", "completed"].includes(status) ? status : "open",
    })
    .eq("id", id);

  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}

// 삭제 = 휴지통으로 이동(소프트 삭제). 운영진 누구나 가능, 복원 가능.
export async function deleteCampaign(formData: FormData) {
  const ctx = await requireStaff();
  if (!ctx) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  await ctx.supabase
    .from("campaigns")
    .update({ deleted_at: new Date().toISOString(), deleted_by: ctx.user.id })
    .eq("id", id);
  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}

// 휴지통에서 복원(롤백). 운영진 누구나 가능.
export async function restoreCampaign(formData: FormData) {
  const ctx = await requireStaff();
  if (!ctx) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  await ctx.supabase
    .from("campaigns")
    .update({ deleted_at: null, deleted_by: null })
    .eq("id", id);
  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}

// 완전 삭제(휴지통 비우기) — 오너만. 되돌릴 수 없음.
export async function purgeCampaign(formData: FormData) {
  const ctx = await requireOwner();
  if (!ctx) return;

  const id = String(formData.get("id") || "");
  if (!id) return;

  await ctx.supabase.from("campaigns").delete().eq("id", id);
  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}

export async function setCampaignStatus(formData: FormData) {
  const ctx = await requireStaff();
  if (!ctx) return;

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["open", "closed", "completed"].includes(status)) return;

  await ctx.supabase.from("campaigns").update({ status }).eq("id", id);
  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}

// 생성·수정 공통 입력 파싱
function readCampaignFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return null;
  const category = String(formData.get("category") || "봉사");
  const activity_date = String(formData.get("activity_date") || "").trim();
  const activity_time = String(formData.get("activity_time") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const capacityRaw = String(formData.get("capacity") || "").trim();
  const fee_label = String(formData.get("fee_label") || "").trim();
  const fee_note = String(formData.get("fee_note") || "").trim();
  const rewardRaw = String(formData.get("reward_points") || "").trim();

  return {
    title,
    category: ["봉사", "리트릿", "캠페인"].includes(category) ? category : "봉사",
    activity_date: activity_date || null,
    activity_time: activity_time || null,
    location: location || null,
    description: description || null,
    capacity: capacityRaw ? Number(capacityRaw) : null,
    fee_label: fee_label || "무료",
    fee_note: fee_note || null,
    reward_points: rewardRaw ? Math.max(0, Math.floor(Number(rewardRaw))) : 0,
  };
}
