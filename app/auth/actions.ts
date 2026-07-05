"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않아요." };
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
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const consentPrivacy = formData.get("consent_privacy") === "on";
  const consentThirdparty = formData.get("consent_thirdparty") === "on";
  const consentMarketing = formData.get("consent_marketing") === "on";

  if (!name || !phone || !email || !password) {
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
    email,
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
      return { error: "이미 가입된 이메일이에요. 로그인해주세요." };
    }
    if (error.code === "email_address_invalid" || msg.includes("invalid")) {
      return {
        error:
          "유효한 이메일 주소를 입력해주세요. (test@ 같은 테스트용 주소는 받을 수 없어요)",
      };
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
        error:
          "가입 확인 메일 전송 한도를 초과했어요. 잠시 후 다시 시도해주세요. (반복 테스트 시 발생할 수 있어요)",
      };
    }
    return { error: "가입 중 문제가 발생했어요. 잠시 후 다시 시도해주세요." };
  }

  // 이메일 확인이 꺼져 있으면 바로 세션이 생겨요.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    message:
      "가입 확인 메일을 보냈어요. 메일함에서 인증을 완료한 뒤 로그인해주세요.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
