import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  setCampaignStatus,
} from "@/app/campaigns/actions";
import { createClient } from "@/lib/supabase/server";
import type { Application, Campaign } from "@/lib/types";

export const metadata: Metadata = { title: "프로그램 관리" };

export default async function AdminCampaignsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/campaigns");

  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!me?.is_admin) redirect("/dashboard");

  const { data: camps } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });
  const campaigns = (camps ?? []) as Campaign[];

  const { data: apps } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  const applications = (apps ?? []) as Application[];

  const titleById = new Map(campaigns.map((c) => [c.id, c.title]));
  const appCount = new Map<string, number>();
  for (const a of applications) {
    if (a.campaign_id)
      appCount.set(a.campaign_id, (appCount.get(a.campaign_id) ?? 0) + 1);
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-5xl space-y-10 px-5 py-10 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-medium text-leaf">ADMIN</p>
              <h1 className="mt-1 font-display text-3xl text-forest sm:text-4xl">
                프로그램 · 신청 관리
              </h1>
            </div>
            <Link
              href="/admin"
              className="rounded-full border border-leaf/25 bg-white px-4 py-2 text-sm text-ink-soft hover:bg-cream-deep"
            >
              참여 제출 관리 →
            </Link>
          </div>

          {/* 새 캠페인 등록 */}
          <section className="rounded-2xl border border-leaf/15 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl text-forest">새 일정 열기</h2>
            <form
              action={createCampaign}
              className="mt-4 grid gap-4 sm:grid-cols-2"
            >
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-ink">
                  제목 <span className="text-leaf">*</span>
                </span>
                <input name="title" required className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  분류
                </span>
                <select name="category" className={inputCls}>
                  <option value="봉사">봉사</option>
                  <option value="리트릿">리트릿</option>
                  <option value="캠페인">캠페인</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  활동 날짜
                </span>
                <input name="activity_date" type="date" className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  활동 시간
                </span>
                <input name="activity_time" type="time" className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  장소
                </span>
                <input name="location" className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  모집 인원
                </span>
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  비용 표기
                </span>
                <input
                  name="fee_label"
                  placeholder="무료 / 실비 1/n"
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  비용 안내
                </span>
                <input
                  name="fee_note"
                  placeholder="예: 방진복 제공 · 식사비만 실비 1/n"
                  className={inputCls}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-ink">
                  내용
                </span>
                <textarea
                  name="description"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-full bg-forest px-8 py-3 font-medium text-white transition-colors hover:bg-forest-deep"
                >
                  일정 등록 (모집 시작)
                </button>
              </div>
            </form>
          </section>

          {/* 프로그램 목록 */}
          <section>
            <h2 className="font-display text-xl text-forest">
              프로그램 ({campaigns.length})
            </h2>
            <div className="mt-4 grid gap-3">
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-leaf/15 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-cream-deep px-2 py-0.5 text-xs font-medium text-forest">
                          {c.category}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            c.status === "open"
                              ? "text-forest"
                              : "text-ink-soft/60"
                          }`}
                        >
                          {c.status === "open" ? "● 모집 중" : "○ 마감"}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-ink">{c.title}</p>
                      <p className="text-sm text-ink-soft">
                        {c.activity_date ?? "일정 미정"}
                        {c.activity_time ? ` ${c.activity_time}` : ""} ·{" "}
                        {c.location ?? "-"} · 신청 {appCount.get(c.id) ?? 0}명
                      </p>
                    </div>
                    <form action={setCampaignStatus}>
                      <input type="hidden" name="id" value={c.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={c.status === "open" ? "closed" : "open"}
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-leaf/25 px-4 py-2 text-sm text-ink-soft hover:bg-cream-deep"
                      >
                        {c.status === "open" ? "마감하기" : "다시 열기"}
                      </button>
                    </form>
                  </div>

                  {/* 수정 · 삭제 */}
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-forest">
                      수정 · 삭제
                    </summary>
                    <div className="mt-3 border-t border-leaf/10 pt-4">
                      <form
                        action={updateCampaign}
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="status" value={c.status} />
                        <label className="block sm:col-span-2">
                          <span className={labelCls}>제목 *</span>
                          <input
                            name="title"
                            required
                            defaultValue={c.title}
                            className={inputCls}
                          />
                        </label>
                        <label className="block">
                          <span className={labelCls}>분류</span>
                          <select
                            name="category"
                            defaultValue={c.category}
                            className={inputCls}
                          >
                            <option value="봉사">봉사</option>
                            <option value="리트릿">리트릿</option>
                            <option value="캠페인">캠페인</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className={labelCls}>모집 인원</span>
                          <input
                            name="capacity"
                            type="number"
                            min="1"
                            defaultValue={c.capacity ?? ""}
                            className={inputCls}
                          />
                        </label>
                        <label className="block">
                          <span className={labelCls}>활동 날짜</span>
                          <input
                            name="activity_date"
                            type="date"
                            defaultValue={c.activity_date ?? ""}
                            className={inputCls}
                          />
                        </label>
                        <label className="block">
                          <span className={labelCls}>활동 시간</span>
                          <input
                            name="activity_time"
                            type="time"
                            defaultValue={c.activity_time ?? ""}
                            className={inputCls}
                          />
                        </label>
                        <label className="block">
                          <span className={labelCls}>장소</span>
                          <input
                            name="location"
                            defaultValue={c.location ?? ""}
                            className={inputCls}
                          />
                        </label>
                        <label className="block">
                          <span className={labelCls}>비용 표기</span>
                          <input
                            name="fee_label"
                            defaultValue={c.fee_label ?? ""}
                            placeholder="무료 / 실비 1/n"
                            className={inputCls}
                          />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className={labelCls}>비용 안내</span>
                          <input
                            name="fee_note"
                            defaultValue={c.fee_note ?? ""}
                            placeholder="예: 방진복 제공 · 식사비만 실비 1/n"
                            className={inputCls}
                          />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className={labelCls}>내용</span>
                          <textarea
                            name="description"
                            rows={3}
                            defaultValue={c.description ?? ""}
                            className={`${inputCls} resize-none`}
                          />
                        </label>
                        <div className="sm:col-span-2">
                          <button
                            type="submit"
                            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-deep"
                          >
                            저장
                          </button>
                        </div>
                      </form>
                      <form
                        action={deleteCampaign}
                        className="mt-3 border-t border-leaf/10 pt-3"
                      >
                        <input type="hidden" name="id" value={c.id} />
                        <button
                          type="submit"
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          이 프로그램 삭제
                        </button>
                      </form>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </section>

          {/* 신청자 목록 */}
          <section>
            <h2 className="font-display text-xl text-forest">
              신청자 ({applications.length})
            </h2>
            {applications.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-leaf/30 bg-white p-8 text-center text-ink-soft">
                아직 신청자가 없어요.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-leaf/15 bg-white shadow-sm">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-leaf/10 text-ink-soft">
                    <tr>
                      <th className="px-4 py-3 font-medium">이름</th>
                      <th className="px-4 py-3 font-medium">연락처</th>
                      <th className="px-4 py-3 font-medium">이메일</th>
                      <th className="px-4 py-3 font-medium">신청 프로그램</th>
                      <th className="px-4 py-3 font-medium">제3자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((a) => (
                      <tr key={a.id} className="border-b border-leaf/5">
                        <td className="px-4 py-3 font-medium text-ink">
                          {a.name}
                        </td>
                        <td className="px-4 py-3 text-ink-soft">{a.phone}</td>
                        <td className="px-4 py-3 text-ink-soft">{a.email}</td>
                        <td className="px-4 py-3 text-ink-soft">
                          {(a.campaign_id && titleById.get(a.campaign_id)) ||
                            "-"}
                        </td>
                        <td className="px-4 py-3 text-ink-soft">
                          {a.consent_thirdparty ? "동의" : "미동의"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-leaf/25 bg-white px-4 py-2.5 text-ink outline-none transition-colors focus:border-forest focus:ring-2 focus:ring-forest/20";

const labelCls = "mb-1 block text-sm font-medium text-ink";
