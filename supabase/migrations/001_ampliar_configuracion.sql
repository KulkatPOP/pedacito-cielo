-- Amplía la tabla existente public.configuracion para el CMS.
-- No crea tablas, no elimina columnas y no modifica productos ni promociones.

alter table public.configuracion
  add column if not exists nombre text,
  add column if not exists descripcion text,
  add column if not exists slogan text,
  add column if not exists historia text,
  add column if not exists historia_venezolana text,
  add column if not exists propuesta_nombre text,
  add column if not exists frase_marca text,
  add column if not exists descripcion_cultural text,
  add column if not exists mensaje_bienvenida text,
  add column if not exists hero_titulo text,
  add column if not exists hero_descripcion text,
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
  add column if not exists categorias_destacadas text,
  add column if not exists galeria_productos text default '[]',
  add column if not exists galeria_local text default '[]',
  add column if not exists galeria_promociones text default '[]',
  add column if not exists contenido_pagina jsonb default '{}'::jsonb,
  add column if not exists updated_at timestamptz default now();

-- Garantiza que la fila única de configuración exista sin reemplazar datos.
insert into public.configuracion (
  id,
  nombre,
  descripcion,
  slogan,
  hero_titulo,
  hero_descripcion,
  hero_destacado,
  direccion,
  telefono,
  whatsapp,
  horario_semana,
  horario_domingo,
  color_principal,
  color_secundario,
  color_fondo,
  color_destacado,
  chatbot_nombre,
  chatbot_mensaje
)
select
  1,
  'Pedacito de Cielo',
  'Panadería venezolana artesanal con sabores que reúnen a la familia.',
  'Un pedacito de Venezuela en cada bocado',
  'Un pedacito de Venezuela',
  'Ven a disfrutar preparaciones frescas, tradición venezolana y la calidez de nuestra mesa.',
  'en cada bocado.',
  'Quillota 849, Viña del Mar',
  '+56 9 0000 0000',
  '56900000000',
  'Lunes - Sábado: 09:00 AM a 06:00 PM',
  'Domingos y feriados: 09:00 AM a 03:00 PM',
  '#173a5e',
  '#c94a3a',
  '#fff8e8',
  '#e7b83f',
  'Cielito',
  '¡Hola! Soy Cielito. Puedo ayudarte a conocer nuestros sabores venezolanos.'
where not exists (
  select 1 from public.configuracion where id = 1
);

alter table public.configuracion enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'configuracion'
      and policyname = 'cms_configuracion_lectura_publica'
  ) then
    create policy cms_configuracion_lectura_publica
      on public.configuracion
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'configuracion'
      and policyname = 'cms_configuracion_administrar'
  ) then
    create policy cms_configuracion_administrar
      on public.configuracion
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;

notify pgrst, 'reload schema';
