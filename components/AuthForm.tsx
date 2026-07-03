"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, signup, type AuthState } from "@/app/auth/actions";

export default function AuthForm({
  mode,
  next,
}: {
  mode: "login" | "signup";
  next?: string;
}) {
  const action = mode === "login" ? login : signup;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      {mode === "signup" && (
        <Field
          label="이름 / 닉네임"
          name="name"
          type="text"
          placeholder="기백"
          autoComplete="name"
        />
      )}

      <Field
        label="이메일"
        name="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
      />

      <Field
        label="비밀번호"
        name="password"
        type="password"
        placeholder={mode === "signup" ? "6자 이상" : "비밀번호"}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
      />

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p className="rounded-xl bg-sprout/10 px-4 py-2.5 text-sm text-forest">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-forest px-6 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-forest-deep disabled:opacity-60"
      >
        {pending
          ? "잠시만요..."
          : mode === "login"
            ? "로그인"
            : "기백씨와 함께하기"}
      </button>

      <p className="pt-2 text-center text-sm text-ink-soft">
        {mode === "login" ? (
          <>
            아직 회원이 아니신가요?{" "}
            <Link href="/signup" className="font-medium text-forest underline">
              회원가입
            </Link>
          </>
        ) : (
          <>
            이미 함께하고 계신가요?{" "}
            <Link href="/login" className="font-medium text-forest underline">
              로그인
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-leaf/25 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-forest focus:ring-2 focus:ring-forest/20"
      />
    </label>
  );
}
