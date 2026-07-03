"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createSubmission, type SubmitState } from "@/app/submissions/actions";

export default function SubmitForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(
    createSubmission,
    null,
  );
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setJustSaved(true);
      const t = setTimeout(() => setJustSaved(false), 4000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            캠페인 · 봉사활동명 <span className="text-leaf">*</span>
          </span>
          <input
            name="campaign_name"
            required
            placeholder="예) 한강 플로깅 캠페인"
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            활동 날짜 <span className="text-leaf">*</span>
          </span>
          <input name="activity_date" type="date" required className={inputCls} />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            활동 시간 (시간)
          </span>
          <input
            name="hours"
            type="number"
            min="0"
            step="0.5"
            placeholder="예) 2"
            className={inputCls}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink">장소</span>
          <input
            name="location"
            placeholder="예) 서울 여의도 한강공원"
            className={inputCls}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            활동 내용
          </span>
          <textarea
            name="description"
            rows={3}
            placeholder="어떤 활동을 했는지 자유롭게 적어주세요."
            className={`${inputCls} resize-none`}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            인증 이미지 (선택)
          </span>
          <input
            name="proof_file"
            type="file"
            accept="image/*"
            className="w-full rounded-xl border border-leaf/25 bg-white px-4 py-2.5 text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-1.5 file:text-white"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            인증 링크 (선택)
          </span>
          <input
            name="proof_link"
            type="url"
            placeholder="사진/영상 클라우드 링크 (이미지 대신)"
            className={inputCls}
          />
        </label>
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {justSaved && (
        <p className="rounded-xl bg-sprout/10 px-4 py-2.5 text-sm text-forest">
          제출 완료! 심사 후 승인되면 기백씨가 자라나요 🌱
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-forest px-6 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-forest-deep disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {pending ? "제출 중..." : "참여 제출하기"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-leaf/25 bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-forest focus:ring-2 focus:ring-forest/20";
