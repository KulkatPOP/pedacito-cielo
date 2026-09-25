# Preparación futura para SaaS

El proyecto actual es deliberadamente de un solo negocio. No debe considerarse multi-tenant todavía.

## Límites actuales

- `configuracion` usa una única fila `id = 1`.
- Productos, categorías, promociones y chatbot no tienen `business_id`.
- La allowlist administrativa es global.
- El bucket `imagenes` no separa propietarios por negocio.
- Realtime escucha tablas completas.
- Rutas administrativas no incluyen organización o negocio activo.

## Evolución recomendada

1. Crear una entidad `negocios` con identificador estable.
2. Relacionar contenido comercial mediante `business_id` no nulo.
3. Crear membresías `usuario_negocio` con roles mínimos.
4. Adaptar RLS para validar membresía y negocio en cada fila.
5. Separar rutas de Storage por `business_id` y validar esa carpeta en RLS.
6. Resolver el negocio por dominio, subdominio o contexto explícito.
7. Incorporar auditoría de cambios y límites por plan antes de facturación.

## Condición previa

La migración multi-tenant requiere diseño, respaldo, pruebas de aislamiento y un plan de migración de la fila única existente. No debe implementarse como una suma de campos opcionales sin revisar todas las políticas RLS.
