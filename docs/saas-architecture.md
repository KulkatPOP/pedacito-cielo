# Arquitectura futura SaaS multi-negocio

Estado: propuesta de diseño. No es una migración y no modifica Supabase remoto. La instalación actual de Pedacito de Cielo continúa siendo de un solo negocio.

## 1. Arquitectura actual

### Datos

| Tabla | Propósito actual | Propietario implícito |
| --- | --- | --- |
| `categorias` | Clasificación del catálogo | Único negocio |
| `productos` | Catálogo, precio, estado, etiqueta y orden | Único negocio |
| `configuracion` | Identidad, contacto, contenido, colores y chatbot | Fila global `id = 1` |
| `promociones` | Contenido promocional y vigencia | Único negocio |
| `respuestas_chatbot` | Respuestas por clave | Único negocio |
| `administradores` | Allowlist de escritura | Plataforma completa |

`productos.categoria_id` es la única relación comercial explícita. No existe una entidad de negocio ni una columna que permita aislar filas entre clientes.

### Autenticación y autorización

El flujo actual es:

```text
Supabase Auth user
        ↓
public.administradores
        ↓ es_administrador()
Acceso administrativo global
```

`ProtectedRoute` verifica sesión en el navegador. La autorización real de datos depende de RLS. Una cuenta autorizada puede administrar todas las filas porque todas pertenecen al mismo negocio.

### Storage

El bucket público `imagenes` utiliza carpetas por tipo, como productos o promociones. Las políticas comprueban bucket y condición administrativa global; no validan propietario del objeto.

### Lectura pública

Las cinco tablas de contenido permiten lectura pública global. Esto es correcto para una sola tienda, pero en SaaS necesitará filtrar por negocio publicado y por estado visible.

## 2. Arquitectura objetivo

```text
auth.users
    ↓
business_memberships ──→ businesses
    ↓ role                         ↓
permisos RLS             datos con business_id
                                  ↓
                    configuración, catálogo, contenido y Storage
```

Cada solicitud debe resolver un negocio explícito por dominio, subdominio o identificador público. Ninguna consulta administrativa puede depender únicamente de que el usuario esté autenticado.

## 3. Entidades propuestas

### `businesses`

- `id uuid` como clave primaria.
- `slug text` único y estable.
- `name text`.
- `status text`: preparación, activo, suspendido o archivado.
- `created_at`, `updated_at`.

No debe almacenar secretos. El slug no sustituye el UUID en relaciones internas.

### `business_memberships`

- `business_id` referencia `businesses`.
- `user_id` referencia `auth.users`.
- `role` con valores controlados.
- `created_at`, `updated_at`.
- clave primaria compuesta `(business_id, user_id)`.

Esta tabla reemplazaría gradualmente la allowlist global. Un usuario podría pertenecer a uno o varios negocios sin obtener permisos sobre otros.

### Roles propuestos

| Rol | Alcance sugerido |
| --- | --- |
| `owner` | Configuración, miembros, contenido y eliminación controlada del negocio |
| `admin` | Contenido, productos, promociones, chatbot e imágenes |
| `editor` | Crear y editar contenido comercial, sin miembros ni seguridad |
| `viewer` | Lectura administrativa sin escritura |

Los permisos deben resolverse en base de datos, no mediante etiquetas confiadas al frontend.

### Configuración por negocio

La futura `business_settings` tendría una fila por `business_id`, con clave primaria o restricción única sobre ese campo. Puede mantener JSONB para contenido editorial flexible, pero identidad, contacto y campos usados en filtros deben permanecer tipados.

### Tablas comerciales

Agregarían `business_id not null`:

- categorías;
- productos;
- promociones;
- respuestas del chatbot;
- novedades persistentes futuras;
- eventos agregados, si se implementan;
- cualquier entidad de pedidos o clientes futura.

Las restricciones únicas deben volverse compuestas. Ejemplos: categoría `(business_id, nombre)`, chatbot `(business_id, clave)` y ordenamientos dentro de cada negocio.

## 4. Resolución del negocio

Opciones válidas:

1. dominio personalizado asociado a `businesses`;
2. subdominio basado en slug;
3. ruta explícita para entornos internos o preview.

La resolución debe ocurrir antes de consultar datos. El cliente puede enviar un identificador público, pero RLS debe volver a comprobar acceso y pertenencia. Nunca se debe aceptar un `business_id` del navegador como autorización suficiente.

## 5. Autenticación futura

Flujo objetivo:

```text
Usuario autenticado
        ↓
Membresías activas
        ↓
Negocio seleccionado
        ↓
Rol y permisos
        ↓
Operación permitida por RLS
```

`AuthContext` seguiría resolviendo la sesión, pero un contexto separado resolvería negocio activo y membresía. `ProtectedRoute` continuaría exigiendo sesión; una segunda capa impediría entrar al panel sin membresía válida.

No se deben guardar roles administrables en `user_metadata`, porque el propio usuario puede influir en esos datos. Las decisiones críticas deben usar tablas protegidas o claims emitidos mediante un proceso confiable.

## 6. RLS futura

Funciones conceptuales:

- `is_business_member(business_id)`.
- `has_business_role(business_id, allowed_roles[])`.
- `can_manage_business(business_id)`.

Patrón de escritura conceptual:

```text
business_id de la fila
        =
una membresía activa de auth.uid()
        +
rol permitido para la operación
```

La lectura pública debe exigir que el negocio esté activo y que la fila sea publicable. Los borradores y productos ocultos no deberían quedar accesibles solo porque la tabla tiene una política SELECT pública.

Las funciones `security definer` deben fijar `search_path`, recibir el negocio explícitamente, tener permisos mínimos y contar con pruebas de aislamiento cruzado.

## 7. Storage futuro

Ruta recomendada:

```text
businesses/{business_id}/{resource_type}/{uuid}.{extension}
```

Las políticas deben extraer y validar el primer segmento del objeto contra la membresía. La lectura pública puede limitarse a negocios activos o usar un bucket público solo para recursos realmente publicados. Archivos internos deberían utilizar un bucket privado con URLs firmadas.

## 8. Plan de migración

### Etapa 0 — Preparación

- respaldar Database y Storage;
- inventariar políticas y datos remotos reales;
- crear pruebas de aislamiento y rollback;
- congelar cambios de esquema durante la migración.

### Etapa 1 — Entidades base

- crear `businesses` y `business_memberships` mediante una migración nueva;
- registrar Pedacito de Cielo como negocio inicial;
- convertir la cuenta autorizada actual en `owner`;
- mantener temporalmente `administradores` para compatibilidad.

### Etapa 2 — Pertenencia aditiva

- agregar `business_id` inicialmente nullable a las tablas comerciales;
- rellenar todas las filas actuales con el negocio inicial;
- agregar índices y restricciones únicas compuestas;
- comprobar que no quedan filas huérfanas.

### Etapa 3 — Aplicación compatible

- resolver negocio activo;
- incluir `business_id` en consultas y escrituras;
- introducir lectura dual controlada solamente durante la transición;
- actualizar rutas de Storage para nuevas cargas.

### Etapa 4 — RLS por negocio

- crear funciones de membresía;
- agregar políticas nuevas en un entorno de prueba;
- probar owner, admin, editor, viewer, usuario ajeno y visitante;
- retirar políticas globales solo después de validar aislamiento.

### Etapa 5 — Restricciones finales

- hacer `business_id not null`;
- retirar compatibilidad con la fila global `configuracion.id = 1`;
- migrar objetos antiguos de Storage con inventario verificable;
- retirar `administradores` y `es_administrador()` cuando no tengan consumidores.

### Etapa 6 — Operación SaaS

- aprovisionamiento controlado;
- auditoría de cambios;
- límites por negocio;
- observabilidad y backups;
- suspensión, exportación y eliminación segura.

Cada etapa necesita migración, verificación y procedimiento de rollback propios. No debe ejecutarse como una única migración grande.

## 9. Decisiones

- UUID como identidad interna del negocio; slug solo para resolución pública.
- Membresía explícita y roles mínimos en base de datos.
- `business_id` obligatorio en cada dato comercial.
- Aislamiento aplicado por RLS y Storage, no solo por filtros React.
- Pedacito de Cielo será el tenant inicial durante una migración futura.
- Ninguna migración histórica será editada.
- La arquitectura actual permanece activa hasta completar pruebas multi-negocio.

## 10. Riesgos

- Filtrar en frontend sin RLS produciría exposición entre clientes.
- Una restricción única global impediría nombres o claves iguales en negocios diferentes.
- Storage sin prefijo validado permitiría modificar imágenes ajenas.
- Migrar configuración global sin backfill podría dejar el sitio vacío.
- Claims o metadata desactualizados podrían conservar permisos revocados.
- Realtime sin filtro por negocio podría transmitir cambios cruzados.
- Jobs, analítica, logs y backups también deben aislarse.
- Un rollback incompleto podría dejar aplicación y políticas en versiones incompatibles.

## 11. Condición de SaaS-ready real

La plataforma solo podrá llamarse multi-tenant después de probar que dos negocios pueden usar nombres, categorías y contenido similares sin leer, modificar, escuchar o eliminar datos del otro. Esta documentación prepara ese trabajo; no afirma que el aislamiento exista hoy.
