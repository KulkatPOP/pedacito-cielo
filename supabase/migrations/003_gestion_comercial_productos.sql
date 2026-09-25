-- Fase 8: gestión comercial avanzada.
-- Migración aditiva e idempotente. No elimina tablas, columnas ni datos.

begin;

alter table public.productos
  add column if not exists estado text,
  add column if not exists etiqueta text,
  add column if not exists orden integer;

-- Conserva el significado del booleano histórico para los productos actuales.
update public.productos
set estado = case when disponible is false then 'agotado' else 'disponible' end
where estado is null;

alter table public.productos
  alter column estado set default 'disponible';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'productos_estado_valido'
      and conrelid = 'public.productos'::regclass
  ) then
    alter table public.productos
      add constraint productos_estado_valido
      check (estado in ('disponible', 'agotado', 'oculto'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'productos_etiqueta_valida'
      and conrelid = 'public.productos'::regclass
  ) then
    alter table public.productos
      add constraint productos_etiqueta_valida
      check (etiqueta is null or etiqueta in ('Más vendido', 'Favorito', 'Recomendado', 'Nuevo'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'productos_orden_no_negativo'
      and conrelid = 'public.productos'::regclass
  ) then
    alter table public.productos
      add constraint productos_orden_no_negativo
      check (orden is null or orden >= 0);
  end if;
end $$;

alter table public.promociones
  add column if not exists fecha_inicio date,
  add column if not exists fecha_termino date;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'promociones_periodo_valido'
      and conrelid = 'public.promociones'::regclass
  ) then
    alter table public.promociones
      add constraint promociones_periodo_valido
      check (fecha_inicio is null or fecha_termino is null or fecha_termino >= fecha_inicio);
  end if;
end $$;

-- No se crean ni reemplazan políticas: las políticas RLS administrativas
-- restringidas existentes continúan protegiendo estas mismas tablas.
notify pgrst, 'reload schema';

commit;
