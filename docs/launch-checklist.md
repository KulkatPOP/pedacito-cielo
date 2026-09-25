# Checklist de lanzamiento

## Código y entorno

- [ ] Trabajar desde una copia limpia y respaldada.
- [ ] Ejecutar `npm ci`, `npm test`, `npm run build` y `npm audit --omit=dev`.
- [ ] Configurar solo `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`; nunca publicar `.env` ni `service_role`.
- [ ] Confirmar HTTPS y fallback de rutas SPA a `index.html`.

## Supabase

- [ ] Aplicar migraciones en el orden de `supabase/README.md`.
- [ ] Confirmar RLS activo y políticas administrativas terminadas en `_admin_restringido`.
- [ ] Confirmar la cuenta autorizada en `public.administradores`.
- [ ] Revisar `configuracion` id 1: negocio, teléfono, WhatsApp, dirección, horarios, redes e imágenes.
- [ ] Probar lectura pública y escrituras con admin; comprobar rechazo de visitante y usuario no autorizado.
- [ ] Verificar permisos, tipos y límites del bucket `imagenes`.

## Público y administrador

- [x] Inicio, catálogo, imágenes, WhatsApp, chatbot, redes y novedades funcionan con fallback local.
- [x] `/admin` sin sesión redirige a `/admin/login`.
- [ ] Repetir pruebas con Supabase remoto disponible.
- [ ] Validar login, persistencia, logout y CRUD de productos, promociones, contenido y chatbot.

## Responsive, accesibilidad y SEO

- [x] Sin desbordamiento de página en 390 px, 768 px y 1440 px; catálogo 1/2/4 columnas.
- [ ] Probar teclado, lector de pantalla, contraste y dispositivos físicos iOS/Android.
- [x] Title, description, robots, Open Graph y Schema.org básico presentes.
- [ ] Con dominio definitivo, agregar canonical, `og:url`, `og:image` absoluta, `robots.txt` y `sitemap.xml`.

## Salida y recuperación

- [ ] Respaldar base de datos y Storage.
- [ ] Registrar versión, responsable y fecha del despliegue.
- [ ] Definir rollback y contacto de soporte.
- [ ] Ejecutar prueba de humo tras publicar.
