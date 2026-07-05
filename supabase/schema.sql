-- =====================================================================
-- 레스트앤라이즈 (REST&RISE) — Supabase schema
-- 실행: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run
--       또는  supabase db push (마이그레이션으로 사용할 경우)
-- =====================================================================

-- ── profiles (먼저 생성: 아래 is_admin 함수가 이 테이블을 참조하므로 순서 중요) ─
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  nickname text,
  phone text,
  is_admin boolean not null default false,
  consent_privacy boolean not null default false,
  consent_thirdparty boolean not null default false,
  consent_at timestamptz,
  consent_marketing boolean not null default false,
  consent_marketing_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── 관리자 판별 함수 (RLS 재귀 방지: SECURITY DEFINER) ──────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "own profile - select" on public.profiles;
create policy "own profile - select"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "own profile - update" on public.profiles;
create policy "own profile - update"
  on public.profiles for update
  using (auth.uid() = id);

-- ── submissions (봉사활동/캠페인 참여 제출) ─────────────────────────
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  campaign_name text not null,
  activity_date date not null,
  location text,
  hours numeric,
  description text,
  proof_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists submissions_user_id_idx on public.submissions (user_id);
create index if not exists submissions_status_idx on public.submissions (status);

alter table public.submissions enable row level security;

-- 본인 제출은 본인이 CRUD, 관리자는 전체 조회/수정
drop policy if exists "submissions - select" on public.submissions;
create policy "submissions - select"
  on public.submissions for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "submissions - insert" on public.submissions;
create policy "submissions - insert"
  on public.submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "submissions - update" on public.submissions;
create policy "submissions - update"
  on public.submissions for update
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "submissions - delete" on public.submissions;
create policy "submissions - delete"
  on public.submissions for delete
  using (auth.uid() = user_id or public.is_admin());

-- ── 신규 가입 시 프로필 자동 생성 트리거 ────────────────────────────
-- ⚠️ 관리자 이메일을 아래 ADMIN_EMAIL 에 맞게 바꿔주세요.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, full_name, nickname, phone, is_admin,
    consent_privacy, consent_thirdparty, consent_at,
    consent_marketing, consent_marketing_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'nickname', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    new.email = 'ceo@h-grs.com',  -- ADMIN_EMAIL
    coalesce((new.raw_user_meta_data->>'consent_privacy')::boolean, false),
    coalesce((new.raw_user_meta_data->>'consent_thirdparty')::boolean, false),
    case when (new.raw_user_meta_data->>'consent_privacy') = 'true' then now() else null end,
    coalesce((new.raw_user_meta_data->>'consent_marketing')::boolean, false),
    case when (new.raw_user_meta_data->>'consent_marketing') = 'true' then now() else null end
  )
  on conflict (id) do nothing;

  -- 가입 선물 5P
  insert into public.point_transactions (user_id, amount, reason)
  values (new.id, 5, '가입 선물');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 인증 이미지 저장용 Storage 버킷 ────────────────────────────────
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict (id) do nothing;

-- 참고: 공개 버킷이라 직접 URL 접근은 정책 없이 동작한다.
-- 목록(열거) 노출을 막기 위해 별도의 broad SELECT 정책은 두지 않는다.

drop policy if exists "proofs - authenticated upload" on storage.objects;
create policy "proofs - authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'proofs');

-- ── campaigns (모집 캠페인/일정) ────────────────────────────────────
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '봉사' check (category in ('봉사', '리트릿', '캠페인')),
  activity_date date,
  activity_time text,
  location text,
  description text,
  capacity int,
  fee_label text default '무료',
  fee_note text,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;

drop policy if exists "campaigns - public read" on public.campaigns;
create policy "campaigns - public read"
  on public.campaigns for select using (true);

drop policy if exists "campaigns - admin write" on public.campaigns;
create policy "campaigns - admin write"
  on public.campaigns for all
  using (public.is_admin()) with check (public.is_admin());

-- ── applications (캠페인 신청 — 게스트 제출) ────────────────────────
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns on delete set null,
  user_id uuid references auth.users on delete set null,
  name text not null,
  phone text not null,
  email text not null,
  consent_privacy boolean not null default false,
  consent_thirdparty boolean not null default false,
  created_at timestamptz not null default now(),
  constraint applications_privacy_required check (consent_privacy = true)
);

create index if not exists applications_campaign_id_idx on public.applications (campaign_id);

alter table public.applications enable row level security;

-- 로그인 사용자가 본인 명의로만 신청
drop policy if exists "applications - insert own" on public.applications;
create policy "applications - insert own"
  on public.applications for insert with check (auth.uid() = user_id);

drop policy if exists "applications - own read" on public.applications;
create policy "applications - own read"
  on public.applications for select using (auth.uid() = user_id or public.is_admin());

-- ── point_transactions (기백씨 포인트 원장 · 1P = 10원) ──────────────
create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  amount int not null,
  reason text,
  submission_id uuid references public.submissions on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists point_tx_submission_uniq
  on public.point_transactions (submission_id) where submission_id is not null;
create index if not exists point_tx_user_idx on public.point_transactions (user_id);

alter table public.point_transactions enable row level security;

drop policy if exists "points - own read" on public.point_transactions;
create policy "points - own read" on public.point_transactions
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "points - admin insert" on public.point_transactions;
create policy "points - admin insert" on public.point_transactions
  for insert with check (public.is_admin());
