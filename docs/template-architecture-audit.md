# Auditoría de arquitectura de plantilla

Fecha: 2026-09-24. Esta revisión se realizó antes de mover archivos; se decidió no mover componentes grandes porque el beneficio no compensaba el riesgo de regresión.

## Componentes reutilizables

- `App.jsx`: enrutamiento público y administrativo con carga diferida.
- `ProtectedRoute.jsx` y `AuthContext.jsx`: acceso y sesión administrativa.
- `BakerySite.jsx`: composición de la experiencia pública.
- `CmsSectionEditor.jsx`, `BusinessSettings.jsx`, `NewsSettings.jsx` e `IdentitySettings.jsx`: edición de contenido.
- `AnalyticsPanel.jsx` y `CrmPanel.jsx`: información agregada local.
- Servicios Supabase, utilidades de prioridad y medición.

`BakerySite.jsx` y `Admin.jsx` continúan siendo componentes grandes. No se dividieron en esta fase porque hacerlo exigiría una prueba E2E administrativa más completa.

## Capas vigentes

### Configuración

`src/config/siteConfig.js` es la puerta de entrada local para datos del negocio, branding, contenido, respuestas del chatbot y módulos. No sustituye Supabase: en ejecución, la configuración remota conserva prioridad.

### Contenido

Los textos y colecciones editables viven en `data/contenido.json`, `data/productos.json` y `src/chatbot/responses.json`. Las referencias venezolanas pertenecen al caso actual y deben mantenerse como contenido, no como reglas del sistema.

### Lógica común

Rutas, autenticación, CRUD, Storage, RLS, estados, fallback y medición son independientes de la marca y no deben modificarse durante un onboarding visual.

## Sistema de módulos

`data/modulos.json` declara módulos activables. Todos están habilitados para Pedacito de Cielo. La ausencia de un valor o cualquier valor distinto de `false` se considera activo, preservando compatibilidad.

Los módulos públicos se desactivan mediante clases del contenedor principal, sin desmontar datos ni alterar Supabase. Analítica, CRM, promociones, novedades y chatbot pueden ocultarse de la navegación administrativa mediante el mismo manifiesto. Desactivar un módulo no elimina datos.

## Clasificación de referencias específicas

### Mantener como contenido

- Identidad venezolana, historia, categorías y productos.
- Nombre del negocio dentro de textos editoriales.
- Mensajes y respuestas locales de Cielito.
- Semillas históricas y documentación del caso de estudio.

### Extraer como configuración

- Nombre, nombre corto y sigla.
- Contacto, horarios, dirección y redes.
- Logo, portada y colores.
- Módulos habilitados.
- Nombre y bienvenida predeterminada del asistente.

### Pendientes deliberados

- `index.html` mantiene SEO y Schema estáticos por cliente.
- Algunas etiquetas del login y CMS conservan la marca actual.
- Las migraciones históricas no se parametrizan ni editan.

## Decisión

La base es reutilizable como una instalación independiente por negocio. No es multi-tenant y no comparte datos, usuarios o Storage entre clientes.
