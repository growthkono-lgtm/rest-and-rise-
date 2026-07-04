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
  is_admin boolean not null default false,
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
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email = 'ceo@h-grs.com'  -- ADMIN_EMAIL
  )
  on conflict (id) do nothing;
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

drop policy if exists "proofs - public read" on storage.objects;
create policy "proofs - public read"
  on storage.objects for select
  using (bucket_id = 'proofs');

drop policy if exists "proofs - authenticated upload" on storage.objects;
create policy "proofs - authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'proofs');
