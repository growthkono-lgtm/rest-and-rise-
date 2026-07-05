"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login, signup, type AuthState } from "@/app/auth/actions";

// 개인정보 보호법에 따른 동의 약관 전문
const PRIVACY_TERMS = `레스트앤라이즈(이하 '회사')는 「개인정보 보호법」에 따라 아래와 같이 개인정보를 수집·이용합니다.

▪ 수집 항목: 이름, 닉네임, 휴대전화번호, 비밀번호
▪ 수집·이용 목적: 회원 식별 및 관리, 봉사·캠페인 참여 신청·확인, 서비스 제공 및 공지사항 전달
▪ 보유·이용 기간: 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존이 필요한 경우 해당 기간까지 보관)
▪ 귀하는 개인정보 수집·이용 동의를 거부할 권리가 있으며, 필수 항목 동의를 거부하실 경우 회원 가입 및 서비스 이용이 제한됩니다.`;

const THIRDPARTY_TERMS = `회사는 봉사·캠페인의 원활한 진행과 참여 확인을 위해 아래와 같이 개인정보를 제3자에게 제공합니다.

▪ 제공받는 자: 각 봉사·캠페인을 함께 운영하는 협력 기관 및 단체
▪ 제공 목적: 참여자 확인, 활동 운영 및 현장 안전 관리
▪ 제공 항목: 이름, 닉네임, 휴대전화번호
▪ 보유·이용 기간: 제공 목적 달성 시까지
▪ 귀하는 개인정보 제3자 제공 동의를 거부할 권리가 있으며, 거부 시 일부 봉사·캠페인 참여가 제한될 수 있습니다.`;

const MARKETING_TERMS = `레스트앤라이즈는 봉사·캠페인 소식, 이벤트 및 혜택 안내 등 광고성 정보를 전송하기 위해 개인정보를 이용합니다.

▪ 이용 목적: 신규 봉사·캠페인 및 이벤트 안내, 혜택·소식 등 광고성 정보 전송
▪ 전송 방법: 문자메시지(SMS) 등
▪ 이용 항목: 이름, 닉네임, 휴대전화번호
▪ 보유·이용 기간: 동의 철회 시 또는 회원 탈퇴 시까지
▪ 본 동의는 선택 사항이며, 동의하지 않으셔도 회원 가입 및 서비스 이용에 제한이 없습니다. 동의하신 후에도 언제든지 수신을 거부(철회)하실 수 있습니다.`;

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
        <>
          <Field
            label="이름"
            name="name"
            type="text"
            placeholder="홍기백"
            autoComplete="name"
          />
          <Field
            label="닉네임"
            name="nickname"
            type="text"
            placeholder="활동할 때 불릴 이름"
            autoComplete="nickname"
          />
        </>
      )}

      {mode === "signup" ? (
        <Field
          label="연락처"
          name="phone"
          type="tel"
          placeholder="010-1234-5678"
          autoComplete="tel"
        />
      ) : (
        <Field
          label="연락처 또는 이메일"
          name="identifier"
          type="text"
          placeholder="010-1234-5678"
          autoComplete="username"
        />
      )}

      <Field
        label="비밀번호"
        name="password"
        type="password"
        placeholder={mode === "signup" ? "6자 이상" : "비밀번호"}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
      />

      {mode === "signup" && (
        <div className="space-y-3 rounded-2xl bg-cream-deep/40 px-4 py-3.5">
          <Consent
            name="consent_privacy"
            title="개인정보 수집·이용 동의"
            purpose="회원 식별·관리 및 봉사·캠페인 참여를 위해 이용해요."
            terms={PRIVACY_TERMS}
          />
          <Consent
            name="consent_thirdparty"
            title="개인정보 제3자 제공 동의"
            purpose="봉사·캠페인 협력기관의 참여 확인·운영을 위해 제공해요. (광고 목적 아님)"
            terms={THIRDPARTY_TERMS}
          />
          <Consent
            name="consent_marketing"
            title="광고성 정보 수신 동의"
            purpose="이벤트·혜택 등 마케팅 소식을 받아볼 수 있어요."
            terms={MARKETING_TERMS}
            required={false}
          />
        </div>
      )}

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
        {pending ? "잠시만요..." : mode === "login" ? "로그인" : "가입 완료"}
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

function Consent({
  name,
  title,
  purpose,
  terms,
  required = true,
}: {
  name: string;
  title: string;
  purpose: string;
  terms: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-2.5 text-sm">
        <input
          id={name}
          type="checkbox"
          name={name}
          required={required}
          className="h-4 w-4 shrink-0 accent-forest"
        />
        <label htmlFor={name} className="flex-1 cursor-pointer">
          {required ? (
            <b className="font-semibold text-forest">[필수]</b>
          ) : (
            <b className="font-semibold text-ink-soft/70">[선택]</b>
          )}{" "}
          <span className="font-medium text-ink">{title}</span>
        </label>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 text-xs text-ink-soft/70 underline underline-offset-2 transition-colors hover:text-forest"
          aria-expanded={open}
        >
          {open ? "접기" : "약관 보기"}
        </button>
      </div>
      <p className="ml-[26px] mt-1 text-xs text-ink-soft/70">{purpose}</p>
      {open && (
        <div className="mt-2 max-h-44 overflow-y-auto whitespace-pre-line rounded-xl bg-white px-3.5 py-3 text-[11px] leading-relaxed text-ink-soft/85 ring-1 ring-leaf/15">
          {terms}
        </div>
      )}
    </div>
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
