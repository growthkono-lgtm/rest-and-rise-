"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

// 로그인 ID로는 Supabase가 이메일을 요구하므로, 연락처(숫자만)로
// 내부용 이메일을 만들어 사용한다. 사용자에게는 노출되지 않는다.
function phoneToLoginEmail(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `u${digits}@members.rest-and-rise.app`;
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  if (!phone || !password) {
    return { error: "연락처와 비밀번호를 입력해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: phoneToLoginEmail(phone),
    password,
  });

  if (error) {
    return { error: "연락처 또는 비밀번호가 올바르지 않아요." };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const nickname = String(formData.get("nickname") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const consentPrivacy = formData.get("consent_privacy") === "on";
  const consentThirdparty = formData.get("consent_thirdparty") === "on";
  const consentMarketing = formData.get("consent_marketing") === "on";

  if (!name || !phone || !password) {
    return { error: "모든 항목을 입력해주세요." };
  }
  if (!/^[\d-]{9,13}$/.test(phone.replace(/\s/g, ""))) {
    return { error: "연락처를 올바르게 입력해주세요. (예: 010-1234-5678)" };
  }
  if (password.length < 6) {
    return { error: "비밀번호는 6자 이상이어야 해요." };
  }
  if (!consentPrivacy || !consentThirdparty) {
    return { error: "필수 동의 항목에 모두 체크해주세요." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: phoneToLoginEmail(phone),
    password,
    options: {
      data: {
        full_name: name,
        nickname,
        phone,
        consent_privacy: consentPrivacy,
        consent_thirdparty: consentThirdparty,
        consent_marketing: consentMarketing,
      },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("registered") || error.code === "user_already_exists") {
      return { error: "이미 가입된 연락처예요. 로그인해주세요." };
    }
    if (msg.includes("weak") || msg.includes("password")) {
      return { error: "비밀번호가 너무 약해요. 더 안전한 비밀번호를 써주세요." };
    }
    if (
      error.code === "over_email_send_rate_limit" ||
      error.status === 429 ||
      msg.includes("rate limit")
    ) {
      return {
        error: "잠시 후 다시 시도해주세요. (요청이 잠깐 몰렸어요)",
      };
    }
    return { error: "가입 중 문제가 발생했어요. 잠시 후 다시 시도해주세요." };
  }

  // 세션이 바로 생기면 가입 완료 → 대시보드로.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    message: "가입이 접수됐어요. 잠시 후 로그인해주세요.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
