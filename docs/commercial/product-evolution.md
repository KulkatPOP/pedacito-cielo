# Evolución hacia producto reutilizable y SaaS

## Estado actual

El proyecto está configurado para un único negocio. `configuracion` utiliza una fila principal, los datos no tienen `business_id`, la allowlist administrativa es global y Storage no separa propietarios por organización. Por ello, no es correcto vender la versión actual como SaaS multi-tenant.

## Etapa 1 — Plantilla reutilizable

- Extraer textos, colores, logos, contacto, horarios y redes a una configuración validada.
- Definir un catálogo de componentes y variantes de contenido soportadas.
- Crear un proceso reproducible de instalación, carga inicial, QA y entrega.
- Mantener un proyecto Supabase independiente por cliente para asegurar aislamiento simple.
- Preparar checklist de marca, contenido, dominio y responsabilidades.

Esta etapa permite repetir implementaciones sin compartir datos entre clientes.

## Etapa 2 — Producto configurable

- Reducir valores comerciales acoplados al código.
- Versionar el esquema de configuración y sus migraciones.
- Definir roles, permisos y límites de uso.
- Incorporar observabilidad, respaldos y restauración probada.
- Automatizar pruebas de regresión y aprovisionamiento de entornos.

## Etapa 3 — SaaS multi-tenant

- Crear entidad `negocios` y membresías `usuario_negocio`.
- Agregar `business_id` obligatorio a todo dato comercial.
- Resolver negocio por dominio, subdominio o contexto explícito.
- Aplicar RLS por membresía y tenant a cada tabla.
- Separar Storage por negocio y validar rutas mediante políticas.
- Aislar Realtime, logs, auditoría y métricas por tenant.
- Diseñar planes, límites, facturación y ciclo de baja.
- Preparar migración segura de clientes existentes.

## Condiciones antes de avanzar

- Pruebas automáticas de aislamiento entre negocios.
- Modelo de amenazas y revisión independiente de RLS.
- Política de privacidad, términos y procesos de atención de datos.
- Backups, recuperación, monitoreo y respuesta a incidentes.
- Definición contractual de soporte y disponibilidad.

## Principio de comercialización

Vender primero lo que ya está comprobado: una solución configurable para un negocio. La reutilización puede estandarizar la implementación; el SaaS requiere aislamiento técnico y operativo real, no solo agregar un selector de negocio.
