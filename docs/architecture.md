# Arquitectura del proyecto

## Clasificación

- **Tipo:** aplicación web React con sitio público y panel administrativo.
- **Categorías:** sitio corporativo, catálogo comercial, CMS y aplicación web.
- **Características detectadas:** catálogo, promociones, configuración editable, chatbot, autenticación administrativa, carga de imágenes y respaldo local.

## Componentes reales

1. `src/main.jsx` monta React.
2. `src/App.jsx` define las rutas públicas y administrativas.
3. `src/components/BakerySite.jsx` presenta el sitio público.
4. `src/pages/Admin.jsx` contiene las operaciones del CMS.
5. `src/context/AuthContext.jsx` restaura y mantiene la sesión de Supabase Auth.
6. `src/services/supabase.js` crea el cliente y gestiona Storage.
7. `src/hooks/useSiteData.js` consulta Supabase y aplica respaldos JSON.
8. Supabase aporta Auth, PostgreSQL, Realtime y Storage.

## Flujo de datos

```text
Administrador autenticado
        ↓
CMS React
        ↓
Supabase Database / Storage
        ↓
useSiteData + Realtime
        ↓
Página pública
```

Si Supabase no está configurado, falla o supera el timeout de 7 segundos, la página pública utiliza `data/*.json` y `src/chatbot/responses.json`.

## Autenticación y autorización

- `/admin` está envuelto por `ProtectedRoute`.
- La sesión se restaura con `supabase.auth.getSession()` antes de decidir el acceso.
- El login usa `signInWithPassword`.
- El cierre usa `signOut` y limpia el usuario local.
- La autorización de datos depende de políticas RLS de Supabase.
- **Roles empresariales:** [POR DEFINIR]. El código solo distingue sesión anónima y usuario autenticado.

## Servicios externos

- Supabase.
- Google Fonts.
- Google Maps embebido.
- WhatsApp mediante enlaces `wa.me`.
- Redes sociales configurables.
- Despliegue: compatible con un hosting SPA por `public/_redirects`; proveedor activo [POR VERIFICAR].

## Puntos de fallo y recuperación

- Supabase: fallback local y timeout.
- Realtime: la carga inicial sigue funcionando aunque la actualización en vivo no esté disponible.
- Storage: no existe fallback de subida; el administrador recibe el error.
- Hosting: [POR VERIFICAR], no hay health check ni observabilidad configurada.

## Riesgos arquitectónicos

- Las políticas administrativas confían en cualquier identidad `authenticated`; debe confirmarse si Supabase permite altas no controladas.
- El panel concentra muchas operaciones en `Admin.jsx`, lo que aumenta el costo de mantenimiento futuro.
- No existen pruebas automatizadas para rutas, CMS o fallback.

