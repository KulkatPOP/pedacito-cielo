# Guía de despliegue

No hay un proveedor de producción definido en el repositorio. Esta guía describe requisitos, no ejecuta un despliegue.

## Variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Solo deben configurarse variables públicas. Nunca expongas `service_role`.

## Build

```bash
npm ci
npm test
npm run build
```

Publica exclusivamente el contenido de `dist/`. El hosting debe redirigir rutas SPA a `index.html`; existe `public/_redirects` para proveedores compatibles.

## Verificaciones previas

1. Confirmar que todas las migraciones requeridas fueron aplicadas.
2. Confirmar que las políticas administrativas usan `es_administrador()`.
3. Confirmar usuario administrador y recuperación de acceso.
4. Revisar dominio, HTTPS, headers de seguridad y caché de imágenes.
5. Probar página pública y panel en una ventana sin sesión.

## Recuperación

Conserva el build anterior y un respaldo de la base antes de migraciones. Los JSON locales mantienen disponible el sitio público ante fallos de lectura, pero no sustituyen Auth, Storage ni operaciones del CMS.
