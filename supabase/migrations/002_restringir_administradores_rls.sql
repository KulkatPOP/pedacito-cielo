-- SEC-001: restringe todas las escrituras administrativas a una allowlist.
-- Migración transaccional: no elimina datos y aborta si no puede identificar
-- de forma inequívoca a la cuenta administrativa inicial.

begin;

create table if not exists public.administradores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.administradores enable row level security;

-- La allowlist no se expone al navegador. Solo el propietario de la base de
-- datos/service role puede administrarla desde un entorno seguro.
revoke all on table public.administradores from anon, authenticated;

create or replace function public.es_administrador()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.administradores
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.es_administrador() from public;
grant execute on function public.es_administrador() to authenticated;

-- Bootstrap seguro para el estado actual declarado: exactamente una cuenta.
-- Si auth.users tiene cero o más de una fila y todavía no existe una allowlist,
-- se aborta toda la migración antes de reemplazar las políticas.
do $$
declare
  auth_user_count integer;
  initial_admin uuid;
begin
  if not exists (select 1 from public.administradores) then
    select count(*)
      into auth_user_count
      from auth.users;

    if auth_user_count <> 1 then
      raise exception
        'Bootstrap administrativo cancelado: se esperaba exactamente 1 usuario en auth.users y se encontraron %.',
        auth_user_count;
    end if;

    select id
      into initial_admin
      from auth.users
      limit 1;

    insert into public.administradores (user_id)
    values (initial_admin);
  end if;
end $$;

-- Elimina todas las políticas que puedan autorizar escrituras en las cinco
-- tablas objetivo, cualquiera sea su nombre. Las políticas SELECT permanecen.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'categorias',
        'productos',
        'configuracion',
        'promociones',
        'respuestas_chatbot'
      )
      and cmd <> 'SELECT'
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end $$;

create policy cms_categorias_admin_restringido
  on public.categorias
  for all
  to authenticated
  using ((select public.es_administrador()))
  with check ((select public.es_administrador()));

create policy cms_productos_admin_restringido
  on public.productos
  for all
  to authenticated
  using ((select public.es_administrador()))
  with check ((select public.es_administrador()));

create policy cms_configuracion_admin_restringido
  on public.configuracion
  for all
  to authenticated
  using ((select public.es_administrador()))
  with check ((select public.es_administrador()));

create policy cms_promociones_admin_restringido
  on public.promociones
  for all
  to authenticated
  using ((select public.es_administrador()))
  with check ((select public.es_administrador()));

create policy cms_chatbot_admin_restringido
  on public.respuestas_chatbot
  for all
  to authenticated
  using ((select public.es_administrador()))
  with check ((select public.es_administrador()));

-- Storage contenía el mismo patrón amplio. Se mantiene la lectura pública del
-- bucket y se restringen únicamente INSERT, UPDATE y DELETE.
drop policy if exists "Admin sube imágenes" on storage.objects;
drop policy if exists "Admin edita imágenes" on storage.objects;
drop policy if exists "Admin elimina imágenes" on storage.objects;
drop policy if exists cms_imagenes_insertar on storage.objects;
drop policy if exists cms_imagenes_actualizar on storage.objects;
drop policy if exists cms_imagenes_eliminar on storage.objects;
drop policy if exists cms_imagenes_insertar_admin on storage.objects;
drop policy if exists cms_imagenes_actualizar_admin on storage.objects;
drop policy if exists cms_imagenes_eliminar_admin on storage.objects;

create policy cms_imagenes_insertar_admin
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'imagenes'
    and (select public.es_administrador())
  );

create policy cms_imagenes_actualizar_admin
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'imagenes'
    and (select public.es_administrador())
  )
  with check (
    bucket_id = 'imagenes'
    and (select public.es_administrador())
  );

create policy cms_imagenes_eliminar_admin
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'imagenes'
    and (select public.es_administrador())
  );

notify pgrst, 'reload schema';

commit;
