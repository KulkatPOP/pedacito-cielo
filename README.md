# Pedacito de Cielo

Sitio público y panel CMS para Pedacito de Cielo, desarrollado con React, Vite y Supabase. Incluye catálogo, productos destacados, promociones, configuración editable, chatbot Cielito, analítica local y herramientas comerciales administrativas.

## Requisitos

- Node.js 20 o superior.
- npm.
- Un proyecto Supabase para autenticación, base de datos y almacenamiento administrativo.

## Instalación local

```bash
npm install
```

Copia `.env.example` como `.env` y completa solamente las credenciales públicas:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_ANON_PUBLICA
```

Nunca agregues una clave `service_role` al frontend ni a un archivo utilizado por Vite.

## Comandos

```bash
npm run dev       # servidor de desarrollo
npm run build     # compilación de producción
npm run preview   # revisión local del build
npm test          # pruebas básicas de prioridad y catálogo
```

Rutas principales:

- Sitio público: `/`
- Login administrativo: `/admin/login`
- Panel protegido: `/admin`

## Fuentes de datos

La página pública intenta leer Supabase y utiliza archivos locales cuando la conexión no está disponible:

- `data/productos.json`: catálogo de respaldo.
- `data/negocio.json`: datos comerciales de respaldo.
- `data/contenido.json`: textos y secciones públicas de respaldo.
- `src/chatbot/responses.json`: respuestas de respaldo de Cielito.

Cuando Supabase responde correctamente, sus datos tienen prioridad. Los valores locales deben mantenerse coherentes porque son el mecanismo de recuperación ante fallos.

## Estructura principal

```text
src/
  components/   interfaz pública, CMS y paneles administrativos
  context/      sesión y autenticación
  hooks/        carga y normalización de datos
  pages/        rutas principales
  services/     Supabase y configuración del negocio
  styles/       estilos públicos y administrativos
  utils/        medición anónima local
data/           contenido local de respaldo
public/         imágenes y recursos estáticos
supabase/       esquema, semillas y migraciones SQL
docs/           documentación técnica y decisiones
```

## Supabase y seguridad

Sigue [supabase/README.md](supabase/README.md) en el orden indicado. La migración `002_restringir_administradores_rls.sql` es obligatoria: reemplaza las políticas administrativas amplias del esquema inicial por una allowlist de usuarios autorizados.

El frontend utiliza únicamente la clave anónima pública. La autorización real depende de Supabase Auth y RLS.

## Analítica y privacidad

La medición actual utiliza `localStorage` del navegador y conserva únicamente eventos agregables como clics de WhatsApp, aperturas del chatbot y accesos al catálogo. No registra nombres, teléfonos, correos, cuentas ni identificadores personales. No representa analítica global ni reemplaza una plataforma de medición centralizada.

El formulario de novedades es solo una interfaz preparada: no envía ni almacena los datos ingresados.

## Mantenimiento

- Ejecuta `npm run build` después de cada cambio.
- No edites simultáneamente los respaldos JSON y el CMS sin comprobar cuál será la fuente efectiva.
- Conserva los JPEG originales mientras existan referencias históricas; la web pública utiliza variantes WebP cuando están disponibles.
- No borres migraciones que puedan haber sido aplicadas en instalaciones existentes.

## Documentación adicional

- [Arquitectura](docs/architecture.md)
- [Tecnologías](docs/technology.md)
- [Seguridad](docs/security.md)
- [Pruebas](docs/testing.md)
- [Trazabilidad](docs/traceability.md)
- [Decisiones](docs/decisions.md)
- [Mantenimiento](docs/maintenance.md)
- [Despliegue](docs/deployment.md)
- [Preparación SaaS](docs/saas-readiness.md)
- [Arquitectura SaaS futura](docs/saas-architecture.md)
- [Auditoría de Supabase](docs/supabase-audit.md)
- [Checklist de lanzamiento](docs/launch-checklist.md)
- [Manual del administrador](docs/admin-manual.md)
- [Auditoría de producción](docs/production-audit-2026-09-24.md)
- [Paquete comercial y caso de estudio](docs/commercial/README.md)
- [Guía de plantilla reutilizable](docs/template-guide.md)
- [Auditoría de arquitectura de plantilla](docs/template-architecture-audit.md)
- [Onboarding de nuevos clientes](docs/client-onboarding.md)
- [Información legal pendiente](docs/legal/legal-information-needed.md)
