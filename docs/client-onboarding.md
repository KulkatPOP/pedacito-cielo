# Onboarding de un nuevo cliente

Esta guía describe una nueva instalación basada en la plantilla. Cada cliente debe utilizar un proyecto y entorno independientes; no se implementa multi-tenant.

## 1. Descubrimiento y alcance

Confirma por escrito:

- nombre legal y comercial;
- descripción, propuesta de valor e historia;
- dirección, teléfono, WhatsApp y horarios;
- redes oficiales;
- productos, categorías, precios y disponibilidad;
- logo, colores y fotografías autorizadas;
- módulos requeridos;
- responsable de contenido, dominio, hosting y soporte.

No inventes testimonios, antigüedad, promociones, precios ni métricas.

## 2. Crear la instalación

1. Duplica la plantilla en una carpeta y repositorio independientes.
2. Crea un proyecto Supabase exclusivo para el cliente.
3. Copia `.env.example` como `.env` y configura solo URL y clave anónima pública.
4. Nunca coloques `service_role` en el frontend.
5. Instala dependencias con `npm ci`.

## 3. Configuración inicial

Edita `data/negocio.json` con identidad, contacto, branding y asistente. Define `sigla`, aunque exista logo, para conservar un fallback accesible.

Revisa `data/modulos.json`. Todos los módulos vienen activos. Establece `false` solamente después de validar que el alcance no lo necesita:

- `catalogo`
- `chatbot`
- `analytics`
- `promociones`
- `crm`
- `novedades`
- `comunidad`
- `testimonios`
- `instagram`

Desactivar un módulo solo lo oculta; no elimina datos ni modifica permisos.

## 4. Carga de contenido

- Edita `data/contenido.json` con textos confirmados.
- Sustituye `data/productos.json` por un catálogo de respaldo coherente.
- Actualiza `src/chatbot/responses.json` y conserva claves únicas.
- Agrega imágenes optimizadas a `public/images/`.
- Actualiza favicon e imagen social.
- Edita `index.html`: title, description, theme color, Open Graph y Schema.org.

Los archivos locales son respaldo. Después de configurar Supabase, carga la misma información mediante el CMS o una semilla nueva para evitar discrepancias.

## 5. Base de datos y seguridad

1. Revisa `supabase/README.md` y usa un ambiente de prueba.
2. Aplica esquema y migraciones en el orden documentado.
3. Crea la cuenta administrativa autorizada.
4. Verifica la allowlist y las políticas RLS restrictivas.
5. Prueba lectura pública y rechazo de escrituras no autorizadas.
6. Comprueba el bucket de imágenes y sus políticas.

No reutilices datos comerciales de migraciones históricas. Para un cliente nuevo, crea una semilla o migración aditiva propia.

## 6. Revisión funcional

- Inicio, navegación y contenido.
- Catálogo, filtros, precios, estados e imágenes.
- WhatsApp con número, nombre y producto correctos.
- Chatbot y correspondencia pregunta-respuesta.
- Ubicación, horarios y redes.
- Login, sesión, logout y ruta protegida.
- CRUD de productos, promociones, configuración y chatbot.
- Móvil, tablet y escritorio.
- Fallback con Supabase no disponible.

Ejecuta:

```bash
npm test
npm run build
npm audit --omit=dev
```

## 7. Aprobación del cliente

Entrega una vista previa privada. Solicita aprobación explícita de textos, imágenes, precios, horarios, contacto, privacidad y condiciones comerciales. Registra correcciones y repite las pruebas después de aplicarlas.

## 8. Preparación de despliegue

- Configura variables en el proveedor, sin subir `.env`.
- Define dominio, HTTPS y redirección SPA.
- Completa canonical, `og:url`, imagen social absoluta, sitemap y robots.txt.
- Crea respaldo de Database y Storage.
- Define responsable, fecha, rollback y soporte.
- Ejecuta el checklist de `docs/launch-checklist.md`.

## 9. Lanzamiento y entrega

Realiza una prueba de humo en producción: inicio, catálogo, WhatsApp, chatbot, redes y login. Entrega el manual administrativo y registra versión, accesos bajo control del cliente y tareas pendientes.

## 10. Límites de la plantilla

La instalación gestiona un solo negocio. No incluye multi-tenant, facturación, panel maestro, newsletter real, pagos ni CRM con datos personales. Cualquiera de esas necesidades requiere un proyecto y evaluación de seguridad propios.
