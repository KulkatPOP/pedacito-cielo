# Pedacito de Cielo

Proyecto React + Vite listo para Visual Studio Code.

## Ejecutar localmente

1. Abre esta carpeta en Visual Studio Code.
2. Abre **Terminal > Nuevo terminal**.
3. Ejecuta `npm install`.
4. Ejecuta `npm run dev`.
5. Abre la dirección local indicada por Vite.

## Editar contenido

- Productos, precios, imágenes y disponibilidad: `data/productos.json`.
- Dirección, horarios, WhatsApp y redes: `data/negocio.json`.
- Respuestas del chatbot: `src/chatbot/responses.json`.
- Estilos generales: `src/styles/global.css`.

Antes de usarlo con clientes, reemplaza el WhatsApp provisional y los enlaces `#` de las redes sociales en `data/negocio.json`.

## Panel administrador y Supabase

El sitio ahora incluye un CMS en `/admin/login`. Sigue `supabase/README.md` para crear las tablas, Storage y el primer usuario administrador. Mientras Supabase no esté configurado, la web pública continúa funcionando con los JSON locales como respaldo.
