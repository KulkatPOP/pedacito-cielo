# Matriz de trazabilidad

| ID | Objetivo | Implementación | Prueba/estado |
|---|---|---|---|
| REQ-001 | Mostrar sitio público aunque Supabase falle | `useSiteData.js`, JSON locales | Build verificado; fallo remoto E2E pendiente |
| REQ-002 | Proteger el administrador | `AuthContext.jsx`, `ProtectedRoute.jsx`, `App.jsx` | Evidencia estática; navegador pendiente |
| REQ-003 | Administrar productos y promociones | `Admin.jsx`, Supabase RLS | Código presente; CRUD real pendiente |
| REQ-004 | Editar configuración del negocio | `businessSettings.js`, `CmsSectionEditor.jsx` | Código presente; persistencia real pendiente |
| REQ-005 | Administrar cuenta propia | `AccountSettings.jsx`, Supabase Auth | Código presente; cambio real pendiente |
| REQ-006 | Chatbot editable | `CmsSectionEditor.jsx`, `responses.json`, `respuestas_chatbot` | Código presente; E2E pendiente |
| REQ-007 | Responsive móvil | `global.css`, estilos administrativos | Build verificado; viewport manual pendiente |
| SEC-001 | Limitar administración a usuarios autorizados | `002_restringir_administradores_rls.sql` | Migración preparada; aplicación y pruebas pendientes |
| TEST-001 | Compilar producción | `npm run build` | VERIFICADO 2026-08-31 |
| TEST-002 | Revisar dependencias | `npm audit` | VERIFICADO, 0 hallazgos |

## Estado general

- Código y build: COMPLETADO.
- Seguridad de roles: PENDIENTE.
- QA automatizado: PENDIENTE.
- Producción/despliegue: POR VERIFICAR.
