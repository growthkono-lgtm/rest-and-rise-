# 레스트앤라이즈 · REST&RISE 🌱

진짜 웰니스가 필요한 이들을 위한 **회복과 성장의 소셜 웰니스 캠페인** 홈페이지.
봉사·캠페인에 참여할수록 자라나는 씨앗 캐릭터 **기백씨(Give Back Seed)** 와 함께합니다.

## ✨ 주요 기능

- **브랜드 랜딩** — 로고·기백씨 세계관, 회복(Rest)·성장(Rise) 캠페인 소개
- **회원가입 / 로그인** — Supabase Auth (이메일)
- **봉사활동 참여 제출** — 캠페인명·날짜·장소·시간·내용·인증(이미지/링크)
- **기백씨 성장** — 승인된 활동 수에 따라 씨앗 → 새싹 → 어린나무 → 나무 → 숲
- **관리자 페이지** — 전체 제출 조회, 승인/반려, 통계 (지정 이메일만 접근)

## 🛠 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Auth·DB·Storage) · Vercel

## 🚀 로컬 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

## 🔑 환경 변수

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

## 🗄 Supabase 설정

1. [supabase.com](https://supabase.com) 에서 프로젝트 생성
2. **SQL Editor** 에서 [`supabase/schema.sql`](supabase/schema.sql) 실행
   - `profiles`, `submissions` 테이블 + RLS 정책
   - 신규 가입 시 프로필 자동 생성 트리거
   - 인증 이미지용 `proofs` 스토리지 버킷
3. `schema.sql` 안의 `ADMIN_EMAIL`(기본 `ceo@h-grs.com`)을 관리자 이메일로 수정
   - 해당 이메일로 가입하면 자동으로 관리자 권한이 부여됩니다
4. **Project Settings > API** 에서 URL·anon key 를 `.env.local` 에 입력

> 이메일 인증을 끄려면 Authentication > Providers > Email 에서 "Confirm email" 을 해제하면
> 가입 즉시 로그인됩니다.

## 📁 구조

```
app/
  page.tsx               랜딩 (세계관·기백씨·캠페인)
  login, signup/         인증 페이지
  dashboard/             마이페이지 (기백씨 성장 + 참여 제출 + 내역)
  admin/                 관리자 제출 관리
  auth/actions.ts        로그인·회원가입·로그아웃 서버 액션
  submissions/actions.ts 제출 생성 / 관리자 상태 변경
components/              헤더·푸터·폼·기백씨 성장 UI
lib/
  supabase/              브라우저·서버 클라이언트, 세션 프록시
  growth.ts              기백씨 성장 단계 로직
  types.ts               공용 타입
supabase/schema.sql      DB 스키마 · RLS · 트리거 · 스토리지
```
