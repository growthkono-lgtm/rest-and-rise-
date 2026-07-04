"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createApplication, type ApplyState } from "@/app/campaigns/actions";

export default function ApplyForm({
  campaignId,
  defaultName = "",
  defaultEmail = "",
}: {
  campaignId: string;
  defaultName?: string;
  defaultEmail?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ApplyState, FormData>(
    createApplication,
    null,
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setDone(true);
    }
  }, [state]);

  if (done) {
    return (
      <div className="rounded-2xl border border-leaf/20 bg-sprout/10 p-8 text-center">
        <div className="text-4xl">🌱</div>
        <h3 className="mt-3 font-display text-2xl text-forest">
          신청이 접수됐어요!
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          함께해주셔서 고마워요. 자세한 안내는 곧 연락드릴게요.
          <br />
          <b className="text-forest">
            인스타그램 DM을 꼭 남겨주셔야 더블체크가 돼요.
          </b>
        </p>
        <a
          href="https://www.instagram.com/_rest.and.rise/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-deep"
        >
          인스타그램 DM 보내러 가기
        </a>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="campaign_id" value={campaignId} />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          이름 <span className="text-leaf">*</span>
        </span>
        <input
          name="name"
          required
          defaultValue={defaultName}
          placeholder="홍길동"
          className={inputCls}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          연락처 <span className="text-leaf">*</span>
        </span>
        <input
          name="phone"
          type="tel"
          required
          placeholder="010-1234-5678"
          className={inputCls}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          이메일 <span className="text-leaf">*</span>
        </span>
        <input
          name="email"
          type="email"
          required
          defaultValue={defaultEmail}
          placeholder="you@example.com"
          className={inputCls}
        />
      </label>

      <p className="rounded-xl bg-butter/40 px-4 py-2.5 text-sm text-forest-deep">
        💬 신청 후 <b>인스타그램 DM</b>을 꼭 남겨주셔야 더블체크가 돼요.
      </p>

      {/* 동의 */}
      <div className="space-y-2.5 rounded-xl border border-leaf/15 bg-cream/40 p-4">
        <label className="flex items-start gap-2.5 text-sm text-ink">
          <input
            name="consent_privacy"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 accent-forest"
          />
          <span>
            <b>[필수]</b> 개인정보 수집·이용에 동의합니다.
            <ConsentDetail>
              수집 항목: 이름, 연락처, 이메일 · 수집·이용 목적: 봉사/캠페인
              참여 신청 및 안내 · 보유 기간: 활동 종료 후 1년 · 수집자(사업자):
              레스트앤라이즈 (대표 송건호). 동의를 거부할 권리가 있으나, 거부 시
              신청이 제한됩니다.
            </ConsentDetail>
          </span>
        </label>

        <label className="flex items-start gap-2.5 text-sm text-ink">
          <input
            name="consent_thirdparty"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 accent-forest"
          />
          <span>
            <b>[필수]</b> 개인정보 제3자 제공에 동의합니다.
            <ConsentDetail>
              제공받는 자: 해당 봉사·캠페인 운영 협력 기관 · 제공 항목: 이름,
              연락처, 이메일 · 제공 목적: 활동 참여자 확인 및 현장 운영 · 보유
              기간: 활동 종료 후 1년. 제공자(사업자): 레스트앤라이즈 (대표
              송건호).
            </ConsentDetail>
          </span>
        </label>
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-forest px-6 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-forest-deep disabled:opacity-60"
      >
        {pending ? "제출 중..." : "참여 신청하기"}
      </button>
    </form>
  );
}

function ConsentDetail({ children }: { children: React.ReactNode }) {
  return (
    <details className="mt-1">
      <summary className="cursor-pointer text-xs text-leaf">자세히 보기</summary>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">{children}</p>
    </details>
  );
}

const inputCls =
  "w-full rounded-xl border border-leaf/25 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-forest focus:ring-2 focus:ring-forest/20";
