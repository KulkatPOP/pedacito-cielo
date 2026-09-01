# Tecnologías

## React

- **Categoría:** frontend.
- **Versión instalada:** determinada por `package-lock.json` mediante la dependencia `latest`.
- **Uso:** componentes, estado, formularios y renderizado del sitio/CMS.
- **Motivo original:** no documentado.
- **Justificación técnica:** permite una interfaz componentizada y reactiva.
- **Impacto:** dependencia central de mantenimiento y rendimiento.

## Vite

- **Categoría:** build y servidor de desarrollo.
- **Uso:** `npm run dev`, `npm run build` y `npm run preview`.
- **Motivo original:** no documentado.
- **Justificación técnica:** build rápido y configuración pequeña para React.

## React Router

- **Categoría:** navegación SPA.
- **Uso:** `/`, `/admin/login` y `/admin`.
- **Motivo original:** no documentado.
- **Seguridad:** la ruta protegida mejora la UX, pero la autorización de datos debe permanecer en Supabase RLS.

## Supabase JS

- **Categoría:** backend como servicio.
- **Uso:** Auth, PostgreSQL, Realtime y Storage.
- **Configuración:** `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- **Seguridad:** la clave anónima es pública por diseño; la seguridad depende de Auth y RLS. Nunca debe usarse una `service_role` en el frontend.
- **Resiliencia:** el contenido público cuenta con fallback local.

## CSS

- **Categoría:** presentación.
- **Uso:** estilos globales, administrativos, configuración de cuenta, identidad y responsive.
- **Impacto:** no existe preprocesador ni sistema de tokens externo; se utilizan variables CSS.

## Alternativas

Las alternativas (Next.js, backend propio, otro BaaS o framework CSS) no deben adoptarse sin una decisión arquitectónica y pruebas de regresión. El proyecto actual no necesita una migración tecnológica para funcionar.

