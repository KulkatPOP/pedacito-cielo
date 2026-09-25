# Guía de plantilla reutilizable

Esta guía explica cómo adaptar la base a un nuevo negocio sin convertirla en multi-tenant ni alterar autenticación, RLS o lógica del sistema.

## Capas de información

### A. Configuración del negocio

Fuente local: `data/negocio.json`. Incluye nombre, contacto, dirección, horarios, redes, logo, portada, colores, identidad y configuración básica del asistente.

La aplicación expone esos valores mediante `src/config/siteConfig.js`. Los componentes y servicios deben importar esta capa, no volver a escribir nombres, teléfonos o colores de una marca.

### B. Contenido

- `data/contenido.json`: navegación, hero, propuesta de valor, historia, catálogo, contacto, CTA, novedades y preguntas rápidas.
- `data/productos.json`: productos de respaldo.
- `src/chatbot/responses.json`: respuestas de respaldo.
- `public/images/`: recursos visuales locales.

El contenido describe la propuesta comercial. No debe confundirse con reglas de autenticación, estados o permisos.

### C. Lógica del sistema

Incluye rutas, Supabase, AuthContext, ProtectedRoute, RLS, Storage, prioridad de datos, normalización, medición y estados de producto. No debe personalizarse para cambiar de marca.

## Crear una versión para otro negocio

1. Crea una copia separada del proyecto y conserva el original.
2. Modifica `data/negocio.json`:
   - `nombre`, `nombreCorto` y `sigla`;
   - `direccion`, `telefono` y `whatsapp` en formato internacional sin `+` para `wa.me`;
   - `horarios`;
   - `redes`;
   - `logo` e `imagen_portada`;
   - colores de identidad;
   - nombre y bienvenida del chatbot.
3. Adapta `data/contenido.json` con textos confirmados del nuevo negocio.
4. Sustituye `data/productos.json` y las imágenes de respaldo.
5. Actualiza `src/chatbot/responses.json` sin duplicar claves.
6. Actualiza manualmente `index.html`: title, description, Open Graph, color de tema, imagen social y Schema.org. Estos metadatos son estáticos y no leen la configuración React durante la carga inicial.
7. Reemplaza favicon, logo social y recursos dentro de `public/images/`.
8. Para una instalación nueva, prepara una migración o semilla nueva con los datos del negocio. No edites migraciones que ya pudieron aplicarse.
9. Configura un proyecto Supabase independiente y aplica las migraciones en el orden documentado.
10. Ejecuta `npm test`, `npm run build` y el checklist de lanzamiento.

## Prioridad de configuración

En ejecución pública se conserva:

```text
Supabase
   ↓ si falla o no está configurado
Configuración local de la plantilla
   ↓ si falta un campo
Valor predeterminado seguro
```

Un cambio local no debe sobrescribir silenciosamente un valor remoto válido. Para instalaciones existentes, los datos del CMS/Supabase tienen prioridad.

## Branding

`src/config/siteConfig.js` agrupa:

- `business`: datos completos del negocio;
- `content`: contenido público;
- `chatbotResponses`: respuestas locales;
- `branding`: nombre, nombre corto, iniciales, logo, portada y colores.

El monograma usa `sigla`; si se omite, se calcula desde `nombreCorto`. Si se configura un logo, la página pública lo utiliza; de lo contrario conserva el monograma. Los colores mantienen las variables CSS actuales, por lo que cambiar valores no cambia la estructura visual.

## Archivos que normalmente se modifican

- `data/negocio.json`
- `data/contenido.json`
- `data/productos.json`
- `src/chatbot/responses.json`
- `public/images/`
- `index.html`
- `.env` local, nunca versionado

## Partes que no deben tocarse para personalizar una marca

- `src/context/AuthContext.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/services/supabase.js`
- `src/utils/dataPriority.js`
- migraciones RLS aplicadas
- funciones CRUD y permisos del administrador
- lógica de estados, fallback y medición

Si una nueva marca requiere cambiar esos archivos, ya no es una personalización de plantilla: debe tratarse como una nueva necesidad técnica, con pruebas y revisión de seguridad.

## Valores todavía estáticos

- Los metadatos y Schema.org de `index.html` requieren edición por implementación.
- Algunos textos culturales y nombres de secciones pertenecen al contenido actual y deben revisarse en `data/contenido.json`.
- El encabezado del login y algunas etiquetas del CMS conservan la marca actual; deben revisarse manualmente al preparar otra implementación hasta que el panel reciba una capa de branding propia.
- Las semillas y migraciones históricas conservan trazabilidad de Pedacito de Cielo; no deben reutilizarse ciegamente ni editarse si pudieron aplicarse.
- El proyecto continúa siendo de un solo negocio por instalación.

## Validación mínima

- Página pública y catálogo con datos remotos y con fallback.
- Logo, colores, portada, redes, mapa, horarios y WhatsApp.
- Mensajes de WhatsApp con el nombre correcto.
- Chatbot y sus claves de respuesta.
- Login, `/admin`, logout y CRUD con la cuenta autorizada.
- Móvil, tablet y escritorio.
- Title, descripción, Open Graph y Schema.org.
- RLS y Storage en el entorno de destino.
