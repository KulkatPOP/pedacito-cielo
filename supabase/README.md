# Preparación de Supabase

1. Crea un proyecto en Supabase y abre **SQL Editor**.
2. Ejecuta `schema.sql` una sola vez y luego `seed-productos.sql` para migrar el catálogo inicial.
3. En **Authentication > Users**, crea el usuario administrador.
4. Copia `.env.example` como `.env` y completa la URL y la clave pública anon.
5. Reinicia `npm run dev` y entra en `/admin/login`.

## Configuración del negocio

Para instalaciones existentes, ejecuta `migrations/001_cms_configuracion.sql` desde **Supabase → SQL Editor**. Es la migración consolidada del CMS: reutiliza las tablas actuales, agrega únicamente campos faltantes, completa las políticas RLS y prepara el bucket `imagenes`. Puede ejecutarse más de una vez sin borrar datos.

Las políticas permiten lectura pública del sitio y escritura únicamente a usuarios autenticados. Para producción con varios usuarios, se recomienda agregar una tabla de perfiles con rol `admin` y restringir las políticas a ese rol.
