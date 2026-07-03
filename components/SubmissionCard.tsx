import { STATUS_LABEL, STATUS_STYLE, type Submission } from "@/lib/types";

export default function SubmissionCard({
  submission: s,
  children,
}: {
  submission: Submission;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-leaf/15 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg text-forest">
            {s.campaign_name}
          </h3>
          <p className="mt-0.5 text-sm text-ink-soft">
            {s.activity_date}
            {s.location ? ` · ${s.location}` : ""}
            {s.hours != null ? ` · ${s.hours}시간` : ""}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[s.status]}`}
        >
          {STATUS_LABEL[s.status]}
        </span>
      </div>

      {s.description && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
          {s.description}
        </p>
      )}

      {s.proof_url && (
        <a
          href={s.proof_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-leaf underline"
        >
          📎 인증 자료 보기
        </a>
      )}

      {children}
    </div>
  );
}
