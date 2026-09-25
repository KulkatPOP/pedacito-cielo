# Auditoría local de Supabase

No se ejecutaron consultas ni cambios contra el proyecto remoto.

## Estado observado

- `schema.sql` crea las tablas base, lectura pública, políticas administrativas transitorias y bucket de imágenes.
- `001_cms_configuracion.sql` consolida columnas y recursos del CMS.
- `002_restringir_administradores_rls.sql` crea `administradores`, `es_administrador()` y reemplaza escrituras amplias.
- `003_gestion_comercial_productos.sql` agrega estado, etiqueta, orden y vigencia de promociones sin cambiar RLS.
- Dos migraciones históricas adicionales amplían configuración y se conservan por trazabilidad.

## Riesgos

- Ejecutar `schema.sql` sin la migración 002 deja escrituras disponibles para cualquier usuario autenticado.
- No existe evidencia local de qué migraciones fueron aplicadas remotamente.
- El esquema base y las migraciones consolidadas duplican algunas definiciones, por lo que el orden debe respetarse.
- La configuración singleton y políticas globales impiden aislamiento multi-tenant.
- Los límites de tipo y tamaño de Storage dependen parcialmente de validación cliente.

## Verificación manual requerida

En Supabase confirma:

1. Existencia de `public.administradores` y `public.es_administrador()`.
2. Políticas de escritura con sufijo `_admin_restringido`.
3. Ausencia de políticas de escritura `authenticated using (true)`.
4. Lectura pública intacta para las cinco tablas públicas.
5. Políticas de Storage restringidas al administrador autorizado.
6. Columnas incorporadas por la migración 003.
