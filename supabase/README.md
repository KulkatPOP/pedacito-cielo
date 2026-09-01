# Preparación de Supabase

1. Crea un proyecto en Supabase y abre **SQL Editor**.
2. Ejecuta `schema.sql` una sola vez y luego `seed-productos.sql` para migrar el catálogo inicial.
3. En **Authentication > Users**, crea el usuario administrador.
4. Ejecuta `migrations/002_restringir_administradores_rls.sql`. La migración exige que exista exactamente un usuario inicial y lo registra en la allowlist administrativa.
5. Copia `.env.example` como `.env` y completa la URL y la clave pública anon.
6. Reinicia `npm run dev` y entra en `/admin/login`.

## Configuración del negocio

Para instalaciones existentes, ejecuta `migrations/001_cms_configuracion.sql` desde **Supabase → SQL Editor**. Es la migración consolidada del CMS: reutiliza las tablas actuales, agrega únicamente campos faltantes, completa las políticas RLS y prepara el bucket `imagenes`. Puede ejecutarse más de una vez sin borrar datos.

Después de la migración consolidada, ejecuta `migrations/002_restringir_administradores_rls.sql`. Esta segunda migración reemplaza las políticas de escritura para que solo los UUID registrados en `public.administradores` puedan modificar datos o imágenes. La lectura pública del sitio se conserva.

La migración de seguridad no usa correos ni secretos en el navegador. Si `auth.users` contiene más de una cuenta y la allowlist aún está vacía, aborta sin aplicar cambios; en ese caso debe registrarse explícitamente el UUID autorizado antes de repetirla.
