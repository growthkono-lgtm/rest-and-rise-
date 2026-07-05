import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AddSubAdminForm from "@/components/AddSubAdminForm";
import { removeSubAdmin } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import { ROLE_LABEL, type Profile } from "@/lib/types";

export const metadata: Metadata = { title: "운영진 관리" };

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/staff");

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "owner") redirect("/admin");

  const { data: profs } = await supabase
    .from("profiles")
    .select("id, email, full_name, nickname, phone, role, created_at")
    .in("role", ["owner", "manager"])
    .order("role", { ascending: true });
  const staff = (profs ?? []) as Profile[];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-3xl space-y-8 px-5 py-10 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-medium text-leaf">ADMIN</p>
              <h1 className="mt-1 font-display text-3xl text-forest sm:text-4xl">
                운영진 관리
              </h1>
              <p className="mt-2 text-ink-soft">
                부관리자는 프로그램을 추가·수정·삭제(휴지통)할 수 있어요. 지정·해제는
                관리자만 할 수 있어요.
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-full border border-leaf/25 bg-white px-4 py-2 text-sm text-ink-soft hover:bg-cream-deep"
            >
              ← 관리자 홈
            </Link>
          </div>

          {/* 부관리자 지정 */}
          <section className="rounded-2xl border border-leaf/15 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl text-forest">부관리자 지정</h2>
            <p className="mt-1 mb-4 text-sm text-ink-soft">
              먼저 그 분이 회원가입(연락처)을 마친 뒤, 아래에 연락처를 입력하면 돼요.
            </p>
            <AddSubAdminForm />
          </section>

          {/* 운영진 리스트 */}
          <section>
            <h2 className="font-display text-xl text-forest">
              운영진 ({staff.length})
            </h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-leaf/15 bg-white shadow-sm">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-leaf/10 text-ink-soft">
                  <tr>
                    <th className="px-4 py-3 font-medium">이름</th>
                    <th className="px-4 py-3 font-medium">아이디(연락처)</th>
                    <th className="px-4 py-3 font-medium">권한</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((p) => (
                    <tr key={p.id} className="border-b border-leaf/5">
                      <td className="px-4 py-3 font-medium text-ink">
                        {p.full_name || "이름없음"}
                        {p.nickname && (
                          <span className="ml-1 text-ink-soft/60">
                            ({p.nickname})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        {p.phone || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            p.role === "owner"
                              ? "bg-forest text-white"
                              : "bg-sprout/20 text-forest",
                          ].join(" ")}
                        >
                          {ROLE_LABEL[p.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.role === "manager" && (
                          <form action={removeSubAdmin}>
                            <input type="hidden" name="id" value={p.id} />
                            <button
                              type="submit"
                              className="text-sm font-medium text-red-600 hover:underline"
                            >
                              해제
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
