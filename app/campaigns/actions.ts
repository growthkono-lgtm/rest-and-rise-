"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

// ── 관리자 전용 ─────────────────────────────────────────────────────
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return null;
  return supabase;
}

export async function createCampaign(formData: FormData) {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  const category = String(formData.get("category") || "봉사");
  const activity_date = String(formData.get("activity_date") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const capacityRaw = String(formData.get("capacity") || "").trim();

  await supabase.from("campaigns").insert({
    title,
    category: ["봉사", "리트릿", "캠페인"].includes(category) ? category : "봉사",
    activity_date: activity_date || null,
    location: location || null,
    description: description || null,
    capacity: capacityRaw ? Number(capacityRaw) : null,
    status: "open",
  });

  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}

export async function setCampaignStatus(formData: FormData) {
  const supabase = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !["open", "closed"].includes(status)) return;

  await supabase.from("campaigns").update({ status }).eq("id", id);
  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}
