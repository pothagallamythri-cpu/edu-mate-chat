create type public.app_role as enum ('student','teacher');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  class_level text default 'Class 7',
  school text default '',
  avatar_url text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable" on public.profiles for select to authenticated using (true);
create policy "update own profile" on public.profiles for update to authenticated using (id = auth.uid());
create policy "insert own profile" on public.profiles for insert to authenticated with check (id = auth.uid());

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  class_level text not null,
  subject text not null,
  resource_type text not null,
  file_path text,
  file_name text,
  mime_type text,
  teacher_id uuid references auth.users(id) on delete set null,
  teacher_name text not null default 'Teacher',
  downloads integer not null default 0,
  views integer not null default 0,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.resources to authenticated;
grant all on public.resources to service_role;
alter table public.resources enable row level security;
create policy "resources readable" on public.resources for select to authenticated using (true);
create policy "teachers insert" on public.resources for insert to authenticated with check (public.has_role(auth.uid(),'teacher') and teacher_id = auth.uid());
create policy "teachers update own" on public.resources for update to authenticated using (public.has_role(auth.uid(),'teacher') and teacher_id = auth.uid());
create policy "teachers delete own" on public.resources for delete to authenticated using (public.has_role(auth.uid(),'teacher') and teacher_id = auth.uid());

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, resource_id)
);
grant select, insert, delete on public.bookmarks to authenticated;
grant all on public.bookmarks to service_role;
alter table public.bookmarks enable row level security;
create policy "own bookmarks" on public.bookmarks for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, resource_id)
);
grant select, insert, delete on public.downloads to authenticated;
grant all on public.downloads to service_role;
alter table public.downloads enable row level security;
create policy "own downloads" on public.downloads for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.ai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.ai_chats to authenticated;
grant all on public.ai_chats to service_role;
alter table public.ai_chats enable row level security;
create policy "own chats" on public.ai_chats for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.record_download(_resource_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return; end if;
  insert into public.downloads(user_id, resource_id) values (auth.uid(), _resource_id) on conflict do nothing;
  update public.resources set downloads = downloads + 1 where id = _resource_id;
end $$;

create or replace function public.record_view(_resource_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.resources set views = views + 1 where id = _resource_id;
end $$;
grant execute on function public.record_download(uuid) to authenticated;
grant execute on function public.record_view(uuid) to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare r text;
begin
  r := coalesce(new.raw_user_meta_data->>'role','student');
  if r not in ('student','teacher') then r := 'student'; end if;
  insert into public.profiles(id, full_name, class_level, school)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
          coalesce(new.raw_user_meta_data->>'class_level','Class 7'), coalesce(new.raw_user_meta_data->>'school',''));
  insert into public.user_roles(user_id, role) values (new.id, r::app_role);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create policy "resource files read" on storage.objects for select to authenticated using (bucket_id = 'resources');
create policy "teachers upload files" on storage.objects for insert to authenticated with check (bucket_id = 'resources' and public.has_role(auth.uid(),'teacher') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "teachers delete own files" on storage.objects for delete to authenticated using (bucket_id = 'resources' and (storage.foldername(name))[1] = auth.uid()::text);

insert into public.resources (title, description, class_level, subject, resource_type, teacher_name, downloads, views, created_at) values
('Photosynthesis Complete Notes','How plants make food using sunlight, water and carbon dioxide. Includes diagrams, the chemical equation and key terms.','Class 7','Science','PDF Notes','Mrs. Lakshmi Rao',248,612, now() - interval '1 day'),
('Algebra Basics','Variables, expressions and simple equations explained step by step with solved examples.','Class 7','Mathematics','PPT Presentation','Mr. Ravi Kumar',189,430, now() - interval '2 days'),
('Parts of Speech','Nouns, pronouns, verbs, adjectives, adverbs and more — with fun practice exercises.','Class 6','English','Study Material','Ms. Priya Sharma',156,390, now() - interval '3 days'),
('Introduction to Computers','Hardware, software, input and output devices and how a computer works.','Class 8','Computer Science','PPT Presentation','Mr. Arjun Reddy',201,505, now() - interval '4 days'),
('DBMS Important Questions','Most-asked questions on databases, keys, normalization and SQL basics.','Class 10','Computer Science','Question Paper','Mr. Arjun Reddy',322,780, now() - interval '5 hours'),
('Fractions Worksheet','Practice adding, subtracting and comparing fractions.','Class 6','Mathematics','Assignment','Mr. Ravi Kumar',97,210, now() - interval '6 days'),
('Indian Freedom Struggle','Key events and leaders from 1857 to 1947 in a simple timeline.','Class 8','Social Studies','PDF Notes','Mrs. Anitha Devi',143,330, now() - interval '7 days'),
('Human Digestive System Diagram','Labelled diagram of the digestive system.','Class 7','Science','Image','Mrs. Lakshmi Rao',118,260, now() - interval '8 days'),
('Quadratic Equations Practice Paper','Model paper with 25 questions and answer key.','Class 10','Mathematics','Question Paper','Mr. Ravi Kumar',275,640, now() - interval '9 days'),
('Light and Reflection','Laws of reflection, mirrors and images with activities.','Class 9','Science','PDF Notes','Mrs. Lakshmi Rao',88,190, now() - interval '10 days');