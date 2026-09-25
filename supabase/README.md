# Preparación de Supabase

1. Crea un proyecto en Supabase y abre **SQL Editor**.
2. Ejecuta `schema.sql` una sola vez.
3. Ejecuta `migrations/001_cms_configuracion.sql` para completar el CMS.
4. Ejecuta `seed-productos.sql` solamente si necesitas cargar el catálogo inicial.
5. En **Authentication > Users**, crea la única cuenta administradora inicial.
6. Ejecuta inmediatamente `migrations/002_restringir_administradores_rls.sql`. El esquema inicial contiene políticas de escritura transitorias; esta migración obligatoria las reemplaza por la allowlist administrativa segura.
7. Ejecuta `migrations/003_gestion_comercial_productos.sql` para habilitar estado, etiqueta, orden y periodos de promociones.
8. Copia `.env.example` como `.env` y completa la URL y la clave pública anon.
9. Reinicia `npm run dev` y entra en `/admin/login`.

No expongas una clave `service_role` en el navegador. Verifica en **Database → Policies** que las políticas administrativas terminan en `_admin_restringido` antes de utilizar el CMS.

La carpeta `future/` contiene únicamente documentación de referencia para una posible arquitectura multi-negocio. No es una migración y no debe ejecutarse.

## Configuración del negocio

Para instalaciones existentes, ejecuta `migrations/001_cms_configuracion.sql` desde **Supabase → SQL Editor**. Es la migración consolidada del CMS: reutiliza las tablas actuales, agrega únicamente campos faltantes, completa las políticas RLS y prepara el bucket `imagenes`. Puede ejecutarse más de una vez sin borrar datos.

Después de la migración consolidada, ejecuta `migrations/002_restringir_administradores_rls.sql`. Esta segunda migración reemplaza las políticas de escritura para que solo los UUID registrados en `public.administradores` puedan modificar datos o imágenes. La lectura pública del sitio se conserva.

La migración de seguridad no usa correos ni secretos en el navegador. Si `auth.users` contiene más de una cuenta y la allowlist aún está vacía, aborta sin aplicar cambios; en ese caso debe registrarse explícitamente el UUID autorizado antes de repetirla.

## Migraciones históricas

`001_ampliar_configuracion.sql` y `20260827_extender_configuracion.sql` se conservan para trazabilidad de instalaciones anteriores. En una instalación nueva utiliza la migración consolidada `001_cms_configuracion.sql`; no es necesario ejecutar además las dos migraciones históricas.
