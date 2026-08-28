alter table public.configuracion
add column if not exists logo text,
add column if not exists imagen_portada text,
add column if not exists color_principal text default '#4b2618',
add column if not exists color_secundario text default '#d96b2b',
add column if not exists color_fondo text default '#fff7ec',
add column if not exists chatbot_nombre text default 'Cielito',
add column if not exists chatbot_mensaje text default 'Hola, soy Cielito. ¿En qué puedo ayudarte?',
add column if not exists historia_venezolana text,
add column if not exists categorias_destacadas text default 'Arepas,Tequeños,Cachapas,Empanadas venezolanas,Pan de jamón,Golfeados',
add column if not exists propuesta_nombre text default 'Sabores venezolanos hechos con cariño',
add column if not exists frase_marca text default 'Un pedacito de Venezuela',
add column if not exists descripcion_cultural text,
add column if not exists mensaje_bienvenida text,
add column if not exists color_destacado text default '#e7b83f',
add column if not exists galeria_productos text default '[]',
add column if not exists galeria_local text default '[]',
add column if not exists galeria_promociones text default '[]',
add column if not exists contenido_pagina jsonb default '{}'::jsonb;

insert into public.categorias(nombre, orden) values
('Arepas', 20), ('Tequeños', 21), ('Cachapas', 22),
('Empanadas venezolanas', 23), ('Golfeados', 24),
('Pan de jamón', 25), ('Dulces venezolanos', 26)
on conflict (nombre) do nothing;

insert into public.respuestas_chatbot(clave, respuesta) values
('venezolanos', 'Consulta nuestra selección de sabores venezolanos disponibles hoy.'),
('tequenos', 'Escríbenos para confirmar formatos y disponibilidad de tequeños.'),
('tortas', 'Preparamos tortas tradicionales y personalizadas para tus celebraciones.')
on conflict (clave) do nothing;
