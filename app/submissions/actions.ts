"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SubmissionStatus } from "@/lib/types";
import { POINTS } from "@/lib/points";

export type SubmitState = { error?: string; ok?: boolean } | null;

export async function createSubmission(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요해요." };

  const campaign_name = String(formData.get("campaign_name") || "").trim();
  const activity_date = String(formData.get("activity_date") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const hoursRaw = String(formData.get("hours") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const proofLink = String(formData.get("proof_link") || "").trim();
  const proofFile = formData.get("proof_file");

  if (!campaign_name || !activity_date) {
    return { error: "캠페인명과 활동 날짜는 필수예요." };
  }

  const hours = hoursRaw ? Number(hoursRaw) : null;
  if (hours !== null && (Number.isNaN(hours) || hours < 0)) {
    return { error: "활동 시간을 올바르게 입력해주세요." };
  }

  // 인증 이미지 업로드 (선택)
  let proof_url: string | null = proofLink || null;
  if (proofFile instanceof File && proofFile.size > 0) {
    if (proofFile.size > 5 * 1024 * 1024) {
      return { error: "인증 이미지는 5MB 이하로 올려주세요." };
    }
    const ext = proofFile.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("proofs")
      .upload(path, proofFile, { upsert: false });
    if (upErr) {
      return { error: "이미지 업로드에 실패했어요. 링크로 첨부해도 좋아요." };
    }
    const { data } = supabase.storage.from("proofs").getPublicUrl(path);
    proof_url = data.publicUrl;
  }

  const { error } = await supabase.from("submissions").insert({
    user_id: user.id,
    campaign_name,
    activity_date,
    location: location || null,
    hours,
    description: description || null,
    proof_url,
  });

  if (error) {
    return { error: "제출 중 문제가 발생했어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { ok: true };
}

// ── 관리자: 제출 상태 변경 ──────────────────────────────────────────
export async function updateSubmissionStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as SubmissionStatus;
  if (!id || !["pending", "approved", "rejected"].includes(status)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return;

  await supabase.from("submissions").update({ status }).eq("id", id);

  // 승인 시 기백씨 포인트 지급 (submission_id 유니크 → 중복 지급 방지)
  if (status === "approved") {
    const { data: sub } = await supabase
      .from("submissions")
      .select("user_id")
      .eq("id", id)
      .single();
    if (sub?.user_id) {
      await supabase.from("point_transactions").insert({
        user_id: sub.user_id,
        amount: POINTS.approvedActivity,
        reason: "봉사·캠페인 참여 승인",
        submission_id: id,
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
}
