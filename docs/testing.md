# Estrategia y resultados de pruebas

Fecha: 2026-08-31

## TEST-001 — Build de producción

- **Entorno:** local, Windows.
- **Comando:** `npm run build`.
- **Resultado:** VERIFICADO.
- **Detalle:** 88 módulos transformados; build generado correctamente.
- **Observación:** bundle JS principal de aproximadamente 505 KB minificado; Vite muestra advertencia de tamaño.

## TEST-002 — Dependencias vulnerables

- **Comando:** `npm audit --json`.
- **Resultado:** VERIFICADO, 0 vulnerabilidades conocidas.

## TEST-003 — Versiones disponibles

- **Comando:** `npm outdated --json`.
- **Resultado:** VERIFICADO.
- **Detalle:** actualizaciones menores disponibles para el plugin de React y React Router. No se aplicaron para evitar regresiones.

## TEST-004 — Protección de `/admin`

- **Resultado en esta auditoría:** NO VERIFICADO mediante navegador.
- **Motivo:** el navegador automatizado no logró conectarse al servidor local, aunque Vite inició correctamente.
- **Evidencia estática:** `App.jsx` envuelve `Admin` en `ProtectedRoute`; este espera `loading` y exige `user.id`.

## TEST-005 — Página pública, chatbot y responsive

- **Resultado en esta auditoría:** NO VERIFICADO mediante navegador por la misma limitación de conexión.
- **Estado previo conocido:** [POR VERIFICAR nuevamente en navegador].

## Cobertura faltante

- No existen tests unitarios, integración o E2E versionados.
- No hay scripts de lint o typecheck.
- No hay pruebas de carga.
- No se verificó un despliegue de producción.
- La migración `002_restringir_administradores_rls.sql` no se aplicó contra la base remota; sus pruebas de autorización permanecen pendientes hasta recibir autorización para ejecutarla.

## Pruebas recomendadas

1. E2E: redirección de `/admin`, login y logout.
2. Integración: fallback cuando Supabase falla o supera 7 segundos.
3. E2E: CRUD de productos, promociones, configuración y chatbot con datos ficticios.
4. Responsive: 390×844, tablet y escritorio.
5. Accesibilidad: navegación por teclado, nombres accesibles y contraste.
6. Storage: tipo, tamaño y permisos de archivos.
