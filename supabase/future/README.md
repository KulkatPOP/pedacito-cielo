# Referencia futura multi-negocio

Esta carpeta contiene diseño no ejecutable para una posible evolución SaaS. No forma parte del orden de migraciones actual y no debe copiarse al SQL Editor.

## Principios

- No editar ni mover migraciones existentes.
- Crear cada cambio futuro como migración nueva, aditiva y reversible cuando sea posible.
- Probar primero con al menos dos negocios y usuarios con roles diferentes.
- Considerar Database, Auth, Storage, Realtime, funciones, logs y backups como parte del aislamiento.
- Mantener Pedacito de Cielo operativo durante cualquier transición.

## Mapa de pertenencia futuro

| Recurso actual | Pertenencia futura |
| --- | --- |
| `configuracion` | `business_settings.business_id` |
| `categorias` | `categorias.business_id` |
| `productos` | `productos.business_id` y categoría del mismo negocio |
| `promociones` | `promociones.business_id` |
| `respuestas_chatbot` | `respuestas_chatbot.business_id` |
| `administradores` | reemplazo gradual por `business_memberships` |
| `storage.objects` | prefijo `businesses/{business_id}/...` |

## Matriz mínima de pruebas futura

1. Owner A administra A y no B.
2. Admin A administra contenido A pero no miembros.
3. Editor A no cambia seguridad ni miembros.
4. Viewer A no escribe.
5. Usuario B no lee borradores ni archivos privados de A.
6. Visitante solo lee contenido publicado de negocios activos.
7. Usuario sin membresía no entra a ningún panel.
8. Revocar una membresía elimina acceso inmediatamente.
9. Realtime solo entrega eventos del negocio autorizado.
10. Las rutas de Storage impiden sustitución cruzada.

La propuesta completa está en `docs/saas-architecture.md`.
