"use client";

import { useActionState } from "react";
import { addSubAdmin, type StaffState } from "@/app/admin/actions";

export default function AddSubAdminForm() {
  const [state, formAction, pending] = useActionState<StaffState, FormData>(
    addSubAdmin,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="block flex-1">
        <span className="mb-1 block text-sm font-medium text-ink">
          부관리자로 지정할 연락처
        </span>
        <input
          name="phone"
          type="tel"
          placeholder="010-1234-5678"
          className="w-full rounded-xl border border-leaf/25 bg-white px-4 py-2.5 text-ink outline-none transition-colors focus:border-forest focus:ring-2 focus:ring-forest/20"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-forest px-6 py-2.5 font-medium text-white transition-colors hover:bg-forest-deep disabled:opacity-60"
      >
        {pending ? "지정 중..." : "부관리자 지정"}
      </button>
      {state?.error && (
        <p className="text-sm text-red-600 sm:self-center">{state.error}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-forest sm:self-center">{state.ok}</p>
      )}
    </form>
  );
}
