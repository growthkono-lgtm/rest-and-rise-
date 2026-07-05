import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "회원가입" };

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="bg-field flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <Image
              src="/brand/gibaek-thumbsup.png"
              alt="기백씨"
              width={96}
              height={96}
              className="h-24 w-auto object-contain"
            />
            <span className="font-display text-2xl text-forest">
              레스트앤라이즈 동료 가입하기
            </span>
          </Link>
          <p className="mt-2 text-sm text-ink-soft">
            봉사로 내 마음속 씨앗을 키우며 회복과 성장의 여정을 함께해요.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-leaf/15 bg-white p-7 shadow-sm">
          <AuthForm mode="signup" />
        </div>
      </div>
    </main>
  );
}
