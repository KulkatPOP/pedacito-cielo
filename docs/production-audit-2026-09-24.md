# Auditoría de preparación para producción

Fecha: 2026-09-24. Alcance local; sin cambios en Supabase remoto, commits, push ni despliegues.

## Resultado

El sitio público compila y funciona con fallback local, y `/admin` está protegido. Antes de entregar deben validarse el CMS con la cuenta autorizada, Supabase remoto y los elementos dependientes del dominio.

## Supabase y datos

La prioridad es Supabase → JSON local → valores predeterminados. Durante la prueba, Supabase agotó el tiempo y el fallback evitó una pantalla en blanco. Se corrigió el teléfono de ejemplo en `data/negocio.json` y en la semilla de nuevas instalaciones de `supabase/schema.sql`. No se tocaron migraciones históricas ya potencialmente aplicadas; conservan números de ejemplo y no deben usarse como fuente comercial.

Datos esperados: WhatsApp `56941827093`, teléfono `+56 9 4182 7093`, Quillota 849 (Viña del Mar), lunes-sábado 09:00–18:00 y domingos/feriados 09:00–15:00.

## Seguridad

- `.env` está ignorado y `.env.example` contiene placeholders.
- El frontend usa clave anónima; no se encontró `service_role`.
- `ProtectedRoute` espera la sesión y redirige a `/admin/login` sin usuario.
- RLS remoto no fue inspeccionado ni modificado. Deben verificarse `002_restringir_administradores_rls.sql` y `public.administradores`.

## Pruebas en navegador

- Inicio, catálogo de ocho productos, imágenes, ubicación, novedades y footer.
- WhatsApp correcto y mensaje con producto; Instagram y Facebook oficiales.
- Cielito abre, saluda y responde **Ver productos** usando productos reales.
- `/admin` sin sesión redirige al login.
- Sin desbordamiento en 390×844, 768×1024 y 1440×900; catálogo 1/2/4 columnas.

No se probaron login real, CRUD, Storage ni autorización negativa por no usar credenciales del cliente y no disponer de conexión remota funcional.

## SEO y riesgos

Hay idioma, title, description, robots, Open Graph, imagen social y Schema.org `Bakery`. Con dominio definitivo faltan canonical, `og:url`, `og:image` absoluta, sitemap y robots.txt. La imagen social pesa aproximadamente 1.3 MB.

Riesgos: RLS remoto sin validar (alto); CMS autenticado sin prueba integral (alto); timeout de Supabase local (medio); números de ejemplo en migraciones históricas (medio); SEO dependiente del dominio (medio); ausencia de E2E, lint y typecheck (bajo).
