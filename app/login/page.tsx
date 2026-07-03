import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next || "/dashboard");

  return (
    <main className="bg-field flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <Image
              src="/brand/logo.png"
              alt="레스트앤라이즈"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover shadow-sm"
            />
            <span className="font-display text-2xl text-forest">
              다시 만나 반가워요
            </span>
          </Link>
          <p className="mt-2 text-sm text-ink-soft">
            기백씨가 당신을 기다리고 있었어요 🌱
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-leaf/15 bg-white p-7 shadow-sm">
          <AuthForm mode="login" next={next} />
        </div>
      </div>
    </main>
  );
}
