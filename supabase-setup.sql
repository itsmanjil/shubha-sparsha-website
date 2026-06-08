-- 1. Contacts table
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  event_type text,
  message text not null,
  created_at timestamptz default now()
);

alter table contacts enable row level security;

create policy "Anyone can submit contact form"
  on contacts for insert to anon with check (true);

create policy "Authenticated users can view contacts"
  on contacts for select to authenticated using (true);

create policy "Authenticated users can delete contacts"
  on contacts for delete to authenticated using (true);

-- 2. Gallery table
create table if not exists gallery (
  id uuid default gen_random_uuid() primary key,
  title text,
  image_url text not null,
  category text default 'All',
  created_at timestamptz default now()
);

alter table gallery enable row level security;

create policy "Anyone can view gallery"
  on gallery for select to anon using (true);

create policy "Authenticated users can insert gallery"
  on gallery for insert to authenticated with check (true);

create policy "Authenticated users can delete gallery"
  on gallery for delete to authenticated using (true);

-- 3. Enable realtime
alter publication supabase_realtime add table contacts;
alter publication supabase_realtime add table gallery;

-- 4. Storage: create a public 'gallery' bucket via the Supabase dashboard
--    Dashboard → Storage → New bucket → Name: gallery → Public: ON
