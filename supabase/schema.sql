-- La Gota de Alegría — esquema Supabase (Postgres)
--
-- Esqueleto de tablas propuesto en brief-la-gota.md. Todavía NO está
-- conectado a la app (Feed/Challenges/Profiles leen de lib/data.ts como
-- seed local) — esto es el punto de partida para el próximo paso
-- ("Meter Supabase: esquema de tablas + auth liviana").
--
-- Decisión de diseño clave — ANONIMATO REAL para "spill the tea" y
-- "premios": esos posts van a `anon_posts`, una tabla separada de
-- `posts` que:
--   * no tiene columna author_id ni ninguna FK a `friends`,
--   * no guarda IP, user-agent, ni ningún id de sesión vinculable,
--   * guarda solo `fecha` (date, sin hora) para minimizar correlación
--     temporal con una sesión de auth.
-- El insert a `anon_posts` tiene que hacerse con la anon key desde el
-- cliente (no autenticado, o autenticado pero sin que el backend
-- persista de qué sesión vino) para que ni Belén como admin pueda
-- reconstruir el autor mirando la base.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- friends: perfiles públicos de las 22 pussies
-- ---------------------------------------------------------------
create table if not exists friends (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nickname text,
  fact text,
  photo_url text,
  avatar_color text,
  -- ilustración estilo Pascualina/agenda (ver Belu en public/profiles/belu.jpg
  -- del front) — se produce a mano/por encargo por persona, no es un upload
  -- de usuaria; queda null hasta que se cargue la de cada una.
  illustration_url text,
  -- ficha editable desde "Mi Perfil" en cualquier momento (no solo onboarding)
  apodo text,
  hijos text,
  palabra text,
  secreto text,
  electro text,
  favorita text,
  random_fact text,
  -- para el magic link: el mail de cada amiga
  email text unique,
  -- se completa recién cuando esa persona entra por primera vez con el
  -- magic link (ver policies más abajo) — así se puede pre-cargar el
  -- resto de los datos de una friend (nombre, fact, ilustración) sin
  -- que todavía haya iniciado sesión ninguna vez.
  auth_user_id uuid unique references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- posts: feed general CON autor (onthisday, challenge, diario,
-- recomendaciones, cringe, carta a una pussie). Todo lo que NO
-- necesita ser anónimo.
-- ---------------------------------------------------------------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  pillar text not null check (
    pillar in (
      'onthisday', 'diario', 'recomendaciones', 'cringe', 'carta',
      'encuesta', 'capsula', 'playlist'
    )
  ),
  author_id uuid references friends (id) on delete set null,
  -- desnormalizado para no depender de un join al mostrar el feed
  -- (y para que un post no "desaparezca" si se borra el perfil)
  author_name text,
  text_content text,
  media_url text,
  -- destinatarie de "carta a una pussie" (no aplica a otros pilares)
  recipient_id uuid references friends (id) on delete set null,
  reactions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- anon_posts: "spill the tea" y nominaciones a premios.
-- Sin author_id, sin FK a friends, sin metadata identificable.
-- ---------------------------------------------------------------
create table if not exists anon_posts (
  id uuid primary key default gen_random_uuid(),
  pillar text not null check (pillar in ('tea', 'premio')),
  categoria text, -- solo para premio_nominacion, ej. "más cambiada del año"
  text_content text not null,
  posted_on date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- pillar_schedule: catálogo de actividades + cuáles están "confirmadas"
-- (participan de la rotación de notificaciones) vs. "propuestas" (ideas
-- nuevas, ver lib/activities.ts en el front, todavía sin activar).
-- La rotación real (3 por semana) hoy vive como función pura en el
-- front (lib/activities.ts::getWeekActivities) — cuando se conecte el
-- cron de push, esa misma lógica pasa a leer de esta tabla.
-- `cadence` queda configurable para poder pasar "diario de la semana"
-- de weekly a monthly sin tocar código.
-- ---------------------------------------------------------------
create table if not exists pillar_schedule (
  id uuid primary key default gen_random_uuid(),
  pillar text not null unique check (
    pillar in (
      'diario', 'recomendaciones', 'cringe', 'tea', 'carta', 'premio',
      'encuesta', 'capsula', 'playlist'
    )
  ),
  label text not null,
  emoji text,
  weekday int check (weekday between 0 and 6), -- 0=domingo..6=sábado; null = rotativo/sin día fijo
  cadence text not null default 'weekly' check (
    cadence in ('weekly', 'biweekly', 'monthly', 'adhoc')
  ),
  -- confirmada (participa de la rotación) vs. propuesta (idea nueva, inactiva)
  active boolean not null default true
);

insert into pillar_schedule (pillar, label, emoji, weekday, cadence, active)
values
  ('diario', 'Diario de la semana', '📓', 1, 'weekly', true),
  ('recomendaciones', 'Recomendaciones', '🍿', 2, 'weekly', true),
  ('cringe', 'Cringe challenge', '🤳', 3, 'weekly', true),
  ('tea', 'Spill the tea', '🍵', 5, 'weekly', true),
  ('carta', 'Carta a una pussie', '💌', null, 'adhoc', true),
  ('premio', 'Premios', '🏆', null, 'adhoc', true),
  -- propuestas nuevas (ver lib/activities.ts) — inactivas hasta confirmar
  ('encuesta', 'Encuesta relámpago', '🗳️', null, 'adhoc', false),
  ('capsula', 'Cápsula del tiempo', '📼', null, 'adhoc', false),
  ('playlist', 'Playlist colectiva', '🎧', null, 'adhoc', false)
on conflict (pillar) do nothing;

-- ---------------------------------------------------------------
-- push_subscriptions: suscripciones Web Push por dispositivo.
-- friend_id es opcional a propósito: alguien puede instalar la PWA
-- y aceptar notificaciones antes de completar el onboarding.
-- ---------------------------------------------------------------
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  friend_id uuid references friends (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Row Level Security — auth = magic link de Supabase Auth.
-- Idea general: lectura abierta al grupo (cualquier sesión autenticada
-- ve a las 22), escritura de `anon_posts` abierta a la key anon SIN
-- exponer nada que permita reconstruir quién lo mandó.
-- ---------------------------------------------------------------
alter table friends enable row level security;
alter table posts enable row level security;
alter table anon_posts enable row level security;
alter table pillar_schedule enable row level security;
alter table push_subscriptions enable row level security;

create policy "friends: lectura para el grupo" on friends
  for select using (true);

-- "Reclamar" un perfil pre-cargado (auth_user_id todavía null, el mail
-- coincide con el de la sesión) O actualizar el propio perfil ya
-- reclamado. Es la misma policy para las dos operaciones porque Postgres
-- evalúa `using` sobre la fila ANTES del update: en el claim todavía no
-- tiene auth_user_id, en una edición posterior ya lo tiene.
create policy "friends: reclamar o editar mi ficha" on friends
  for update
  using (auth_user_id = auth.uid() or (auth_user_id is null and email = auth.email()))
  with check (auth_user_id = auth.uid());

-- Si alguien entra con un mail que Belén todavía no precargó en
-- `friends`, se crea su fila en el momento (self-signup).
create policy "friends: crear mi propio registro" on friends
  for insert
  with check (auth_user_id = auth.uid());

create policy "posts: lectura para el grupo" on posts
  for select using (true);

-- Solo se puede postear como uno mismo (author_id = la friend ligada a
-- mi sesión) — evita que alguien postee en nombre de otra.
create policy "posts: insertar como uno mismo" on posts
  for insert
  with check (
    auth.role() = 'authenticated'
    and author_id in (select id from friends where auth_user_id = auth.uid())
  );

-- Se manda con la ANON key desde un cliente separado que nunca inició
-- sesión (ver lib/supabase/anonClient.ts) — así ni siquiera viaja un
-- JWT identificable en el request, más allá de que la tabla ya no
-- tiene ninguna columna de autor.
create policy "anon_posts: insertar sin auth" on anon_posts
  for insert with check (true);

create policy "anon_posts: lectura agregada" on anon_posts
  for select using (true);

create policy "pillar_schedule: lectura para el grupo" on pillar_schedule
  for select using (true);

create policy "push_subscriptions: cada quien la suya" on push_subscriptions
  for all
  using (friend_id in (select id from friends where auth_user_id = auth.uid()))
  with check (friend_id in (select id from friends where auth_user_id = auth.uid()));

-- ---------------------------------------------------------------
-- Storage — fotos de "Sumar" (nunca para pilares anónimos: eso se
-- valida en el front, no se sube nada en esos casos).
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('posts-media', 'posts-media', true)
on conflict (id) do nothing;

create policy "posts-media: lectura pública" on storage.objects
  for select using (bucket_id = 'posts-media');

create policy "posts-media: subir autenticade" on storage.objects
  for insert
  with check (bucket_id = 'posts-media' and auth.role() = 'authenticated');
