-- Migración consolidada del CMS Pedacito de Cielo.
-- Es idempotente: no elimina tablas, columnas ni datos existentes.

create extension if not exists "pgcrypto";

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text unique not null,
  orden integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio integer not null default 0,
  categoria_id uuid references public.categorias(id) on delete set null,
  imagen text,
  disponible boolean default true,
  destacado boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.configuracion (
  id integer primary key default 1,
  nombre text,
  updated_at timestamptz default now()
);

create table if not exists public.promociones (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  imagen text,
  fecha date default current_date,
  activa boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.respuestas_chatbot (
  id uuid primary key default gen_random_uuid(),
  clave text unique not null,
  respuesta text not null,
  updated_at timestamptz default now()
);

alter table public.categorias
  add column if not exists nombre text,
  add column if not exists orden integer default 0,
  add column if not exists created_at timestamptz default now();

alter table public.productos
  add column if not exists nombre text,
  add column if not exists descripcion text,
  add column if not exists precio integer default 0,
  add column if not exists categoria_id uuid,
  add column if not exists imagen text,
  add column if not exists disponible boolean default true,
  add column if not exists destacado boolean default false,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table public.promociones
  add column if not exists titulo text,
  add column if not exists descripcion text,
  add column if not exists imagen text,
  add column if not exists fecha date default current_date,
  add column if not exists activa boolean default true,
  add column if not exists created_at timestamptz default now();

alter table public.respuestas_chatbot
  add column if not exists clave text,
  add column if not exists respuesta text,
  add column if not exists updated_at timestamptz default now();

alter table public.configuracion
  add column if not exists nombre text,
  add column if not exists descripcion text,
  add column if not exists historia text,
  add column if not exists historia_venezolana text,
  add column if not exists slogan text,
  add column if not exists hero_titulo text,
  add column if not exists hero_destacado text,
  add column if not exists hero_imagen text,
  add column if not exists logo text,
  add column if not exists imagen_portada text,
  add column if not exists direccion text,
  add column if not exists telefono text,
  add column if not exists whatsapp text,
  add column if not exists horario_semana text,
  add column if not exists horario_domingo text,
  add column if not exists instagram text,
  add column if not exists facebook text,
  add column if not exists tiktok text,
  add column if not exists color_principal text default '#173a5e',
  add column if not exists color_secundario text default '#c94a3a',
  add column if not exists color_fondo text default '#fff8e8',
  add column if not exists color_destacado text default '#e7b83f',
  add column if not exists chatbot_nombre text default 'Cielito',
  add column if not exists chatbot_mensaje text,
  add column if not exists propuesta_nombre text,
  add column if not exists frase_marca text,
  add column if not exists descripcion_cultural text,
  add column if not exists mensaje_bienvenida text,
  add column if not exists categorias_destacadas text,
  add column if not exists galeria_productos text default '[]',
  add column if not exists galeria_local text default '[]',
  add column if not exists galeria_promociones text default '[]',
  add column if not exists contenido_pagina jsonb default '{}'::jsonb,
  add column if not exists updated_at timestamptz default now();

insert into public.configuracion (
  id, nombre, descripcion, slogan, hero_titulo, hero_destacado,
  direccion, whatsapp, horario_semana, horario_domingo,
  color_principal, color_secundario, color_fondo, color_destacado,
  chatbot_nombre, chatbot_mensaje
)
select
  1, 'Pedacito de Cielo',
  'Panadería venezolana artesanal con sabores que reúnen a la familia.',
  'Un pedacito de Venezuela en cada bocado',
  'Un pedacito de Venezuela', 'en cada bocado.',
  'Quillota 849, Viña del Mar', '56900000000',
  'Lunes a sábado · 09:00 — 20:00', 'Domingo · 09:00 — 15:00',
  '#173a5e', '#c94a3a', '#fff8e8', '#e7b83f',
  'Cielito', '¡Hola! Soy Cielito. Puedo ayudarte a conocer nuestros sabores venezolanos.'
where not exists (select 1 from public.configuracion where id = 1);

insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do update set public = true;

alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.configuracion enable row level security;
alter table public.promociones enable row level security;
alter table public.respuestas_chatbot enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='categorias' and policyname='cms_categorias_lectura') then
    create policy cms_categorias_lectura on public.categorias for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='categorias' and policyname='cms_categorias_admin') then
    create policy cms_categorias_admin on public.categorias for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='productos' and policyname='cms_productos_lectura') then
    create policy cms_productos_lectura on public.productos for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='productos' and policyname='cms_productos_admin') then
    create policy cms_productos_admin on public.productos for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='configuracion' and policyname='cms_configuracion_lectura') then
    create policy cms_configuracion_lectura on public.configuracion for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='configuracion' and policyname='cms_configuracion_admin') then
    create policy cms_configuracion_admin on public.configuracion for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='promociones' and policyname='cms_promociones_lectura') then
    create policy cms_promociones_lectura on public.promociones for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='promociones' and policyname='cms_promociones_admin') then
    create policy cms_promociones_admin on public.promociones for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='respuestas_chatbot' and policyname='cms_chatbot_lectura') then
    create policy cms_chatbot_lectura on public.respuestas_chatbot for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='respuestas_chatbot' and policyname='cms_chatbot_admin') then
    create policy cms_chatbot_admin on public.respuestas_chatbot for all to authenticated using (true) with check (true);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='cms_imagenes_lectura') then
    create policy cms_imagenes_lectura on storage.objects for select to anon, authenticated using (bucket_id = 'imagenes');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='cms_imagenes_insertar') then
    create policy cms_imagenes_insertar on storage.objects for insert to authenticated with check (bucket_id = 'imagenes');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='cms_imagenes_actualizar') then
    create policy cms_imagenes_actualizar on storage.objects for update to authenticated using (bucket_id = 'imagenes') with check (bucket_id = 'imagenes');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='cms_imagenes_eliminar') then
    create policy cms_imagenes_eliminar on storage.objects for delete to authenticated using (bucket_id = 'imagenes');
  end if;
end $$;

insert into public.respuestas_chatbot (clave, respuesta)
select seed.clave, seed.respuesta
from (values
  ('horarios', 'Consulta nuestros horarios actualizados en la sección de contacto.'),
  ('direccion', 'Estamos en Quillota 849, Viña del Mar.'),
  ('productos', 'Revisa nuestro catálogo para conocer la disponibilidad del día.'),
  ('venezolanos', 'Consulta nuestra selección de productos venezolanos disponibles.'),
  ('tequenos', 'Escríbenos para confirmar la disponibilidad de tequeños.'),
  ('tortas', 'Preparamos tortas tradicionales y personalizadas.'),
  ('personalizados', 'Cuéntanos tu idea por WhatsApp para preparar una cotización.'),
  ('compra', 'Puedes reservar por WhatsApp y retirar en el local.')
) as seed(clave, respuesta)
where not exists (
  select 1 from public.respuestas_chatbot existing where existing.clave = seed.clave
);

notify pgrst, 'reload schema';
