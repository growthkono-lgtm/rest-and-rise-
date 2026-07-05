import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-leaf/10 bg-cream-deep/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/logo.png"
            alt="레스트앤라이즈"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="font-display text-lg text-forest">레스트앤라이즈</p>
            <p className="text-sm text-ink-soft">
              회복과 성장을 함께 만드는 소셜 임팩트 커뮤니티
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm text-ink-soft sm:items-end">
          <a
            href="https://www.instagram.com/_rest.and.rise/"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-forest"
          >
            @_rest.and.rise
          </a>
          <div className="flex gap-4">
            <Link href="/signup" className="transition-colors hover:text-forest">
              동참하기
            </Link>
            <Link href="/login" className="transition-colors hover:text-forest">
              로그인
            </Link>
          </div>
          <p className="mt-1 text-xs text-ink-soft/70">
            © {new Date().getFullYear()} REST&RISE · 기백씨와 함께
          </p>
        </div>
      </div>
    </footer>
  );
}
