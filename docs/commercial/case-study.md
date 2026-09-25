# Caso de estudio — Pedacito de Cielo

## Contexto

Pedacito de Cielo es una propuesta gastronómica de identidad venezolana ubicada en Viña del Mar. El proyecto buscó convertir su presencia digital en una experiencia clara para clientes y, al mismo tiempo, ofrecer al negocio herramientas para mantener información comercial sin intervenir el código.

La información utilizada en este documento procede del proyecto. No se atribuyen años de trayectoria, volúmenes de clientes, ventas ni porcentajes de conversión porque no existen mediciones confirmadas.

## Objetivos

- Comunicar con claridad la identidad venezolana del negocio.
- Presentar productos, precios y disponibilidad de forma visual.
- Facilitar consultas y pedidos mediante WhatsApp.
- Centralizar horarios, ubicación, redes y datos de contacto.
- Permitir la edición de contenido desde un panel protegido.
- Evitar que una falla de Supabase deje la página pública en blanco.
- Preparar una base mantenible, responsive y documentada.

## Solución desarrollada

### Experiencia pública

Se construyó una página con hero comercial, propuesta de valor, catálogo, destacados, historia, ubicación, redes, novedades y llamados a la acción. El catálogo mantiene productos reales del proyecto y genera enlaces de WhatsApp con contexto del producto seleccionado.

### Asistencia comercial

Cielito ofrece bienvenida, preguntas rápidas y próximos pasos hacia catálogo, ubicación, horarios o WhatsApp. Las preguntas y respuestas pueden mantenerse desde administración sin integrar servicios de IA externos.

### Administración

El panel protegido permite gestionar productos, promociones, contenido, configuración del negocio y chatbot. También presenta resúmenes operativos y estructuras locales de analítica y CRM agregado, sin almacenar datos personales.

### Continuidad de servicio

La carga pública sigue el orden Supabase → archivos locales → valores predeterminados. Un timeout controlado activa el fallback y evita que un problema de conectividad bloquee toda la experiencia.

## Decisiones técnicas

- Separar rutas públicas y administrativas mediante React Router y carga diferida.
- Conservar Supabase Auth como mecanismo de sesión.
- Delegar autorización real a RLS y una allowlist administrativa por UUID.
- Separar datos editables del diseño.
- Mantener migraciones aditivas y documentación de seguridad.
- Utilizar estados explícitos para disponibilidad y visibilidad de productos.
- No implementar seguimiento individual ni almacenamiento de prospectos sin un marco de privacidad.

## Resultados del desarrollo

- Aplicación React compilable con sitio público y CMS.
- Catálogo responsive con ocho productos locales verificados durante la auditoría.
- Enlaces oficiales de WhatsApp y redes configurados.
- Chatbot funcional con respuestas relacionadas por clave.
- Ruta `/admin` protegida y redirección al login comprobada sin sesión.
- Fallback público comprobado durante un timeout de Supabase.
- Pruebas automatizadas básicas aprobadas y auditoría de dependencias sin vulnerabilidades conocidas al 24 de septiembre de 2026.
- Documentación de arquitectura, seguridad, pruebas, mantenimiento y lanzamiento.

Estos son resultados técnicos observados. No se presentan aumentos de ventas, clientes o conversión porque no existe analítica comercial validada.

## Estado y próximos pasos

Antes de producción deben comprobarse Supabase remoto, políticas RLS, cuenta autorizada, CRUD administrativo, Storage y configuración del dominio. Después del lanzamiento se podrán definir indicadores comerciales y medir resultados con consentimiento y herramientas adecuadas.
