-- ──────────────────────────────────────────────────────────────────────────────
-- 001_safer_communities_schema.sql
-- Safer Communities — Full database schema with RLS policies.
-- Run via: supabase db push  OR  paste into Supabase SQL Editor.
-- ──────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────────────────────────
-- Mirrors auth.users. Created/updated automatically via AuthContext.jsx.

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin', 'moderator')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── REPORTS ───────────────────────────────────────────────────────────────────
-- Incident reports submitted by community members.

create table if not exists public.reports (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete set null,
  title       text not null,
  description text,
  category    text not null,
  severity    text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  status      text not null default 'pending' check (status in ('pending', 'reviewing', 'resolved', 'dismissed')),
  location    text,
  latitude    double precision,
  longitude   double precision,
  image_url   text,
  anonymous   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Anyone can insert a report"
  on public.reports for insert
  with check (true);

create policy "Anyone can read non-anonymous reports"
  on public.reports for select
  using (true);

create policy "Users can update their own reports"
  on public.reports for update
  using (auth.uid() = user_id);

create policy "Admins can update any report"
  on public.reports for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── SOS ALERTS ────────────────────────────────────────────────────────────────
-- Emergency SOS broadcasts with GPS coordinates.

create table if not exists public.sos_alerts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete set null,
  latitude    double precision not null,
  longitude   double precision not null,
  message     text,
  status      text not null default 'active' check (status in ('active', 'responded', 'resolved')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.sos_alerts enable row level security;

create policy "Anyone can insert an SOS alert"
  on public.sos_alerts for insert
  with check (true);

create policy "Anyone can read SOS alerts"
  on public.sos_alerts for select
  using (true);

create policy "Admins can update SOS alerts"
  on public.sos_alerts for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── COMMUNITY ALERTS ─────────────────────────────────────────────────────────
-- Official alerts broadcast by admins/moderators.

create table if not exists public.community_alerts (
  id          uuid primary key default uuid_generate_v4(),
  author_id   uuid references public.profiles(id) on delete set null,
  title       text not null,
  description text,
  category    text,
  severity    text default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  status      text not null default 'active' check (status in ('active', 'resolved', 'dismissed')),
  location    text,
  latitude    double precision,
  longitude   double precision,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.community_alerts enable row level security;

create policy "Anyone can read community alerts"
  on public.community_alerts for select
  using (true);

create policy "Admins can insert community alerts"
  on public.community_alerts for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'moderator')
    )
  );

create policy "Admins can update community alerts"
  on public.community_alerts for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'moderator')
    )
  );

-- ── EVIDENCE FILES ────────────────────────────────────────────────────────────
-- Metadata tracking for uploaded evidence images.

create table if not exists public.evidence_files (
  id          uuid primary key default uuid_generate_v4(),
  report_id   uuid references public.reports(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete set null,
  file_path   text not null,
  file_name   text,
  mime_type   text,
  size_bytes  bigint,
  public_url  text,
  created_at  timestamptz not null default now()
);

alter table public.evidence_files enable row level security;

create policy "Anyone can insert evidence"
  on public.evidence_files for insert
  with check (true);

create policy "Users can read evidence for their reports"
  on public.evidence_files for select
  using (auth.uid() = user_id);

create policy "Admins can read all evidence"
  on public.evidence_files for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── STORAGE BUCKET ────────────────────────────────────────────────────────────
-- Run this in the Supabase dashboard Storage settings, or via API:
-- Create a bucket named "evidence-files" and set it to public.
-- Alternatively uncomment and adapt for supabase-js v2 storage management.

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('evidence-files', 'evidence-files', true)
-- ON CONFLICT (id) DO NOTHING;

-- ── UPDATED_AT TRIGGERS ───────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_reports
  before update on public.reports
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_sos_alerts
  before update on public.sos_alerts
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_community_alerts
  before update on public.community_alerts
  for each row execute procedure public.handle_updated_at();

-- ── INDEXES ───────────────────────────────────────────────────────────────────

create index if not exists idx_reports_category on public.reports(category);
create index if not exists idx_reports_status on public.reports(status);
create index if not exists idx_reports_user_id on public.reports(user_id);
create index if not exists idx_sos_status on public.sos_alerts(status);
create index if not exists idx_community_status on public.community_alerts(status);
create index if not exists idx_community_category on public.community_alerts(category);

-- ── REALTIME ──────────────────────────────────────────────────────────────────
-- Enable realtime for the alerts table (CommunityAlertsPage subscribes to it).

alter publication supabase_realtime add table public.community_alerts;
alter publication supabase_realtime add table public.sos_alerts;
