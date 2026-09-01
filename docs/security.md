# Auditoría de seguridad

Fecha: 2026-08-31

Alcance: código local, configuración Git, dependencias npm, rutas, Supabase RLS y Storage. No se ejecutaron ataques contra producción ni se inspeccionaron datos reales.

## SEC-001 — Autorización administrativa demasiado amplia

- **Tipo:** riesgo potencial.
- **Severidad:** ALTA si el proyecto permite registro público; MEDIA si solo el dueño puede crear usuarios.
- **Evidencia:** las políticas `cms_*_admin` permiten todas las operaciones a cualquier usuario `authenticated`.
- **Impacto:** una cuenta autenticada no autorizada podría modificar productos, configuración, promociones, chatbot e imágenes.
- **Reproducción segura:** no ejecutada para evitar alterar datos.
- **Corrección recomendada:** confirmar el modelo de usuarios y, si corresponde, validar un rol/allowlist en RLS mediante claims o una tabla de administradores.
- **Mitigación preparada:** `supabase/migrations/002_restringir_administradores_rls.sql` crea una allowlist por UUID y reemplaza las políticas amplias sin eliminar datos ni lectura pública.
- **Estado:** EN DESARROLLO — migración creada, todavía no aplicada ni verificada contra Supabase.

## SEC-002 — Validación de uploads concentrada en el cliente

- **Tipo:** riesgo potencial.
- **Severidad:** MEDIA.
- **Evidencia:** React valida MIME y 6 MB, pero la política de Storage permite insertar objetos a cualquier usuario autenticado sin restricción de carpeta, extensión o tamaño.
- **Impacto:** una llamada directa a Storage podría omitir las validaciones del navegador.
- **Corrección recomendada:** restringir políticas/bucket y verificar límites efectivos de Supabase. Mantener tipos permitidos y límites del proveedor.
- **Mitigación preparada:** la misma migración restringe INSERT, UPDATE y DELETE del bucket `imagenes` a la allowlist administrativa.
- **Estado:** EN DESARROLLO — migración creada, todavía no aplicada.

## SEC-003 — Headers de seguridad no documentados

- **Tipo:** mejora recomendada.
- **Severidad:** BAJA.
- **Evidencia:** existe `_redirects`, pero no se encontró configuración versionada para CSP, HSTS, anti-framing, Referrer-Policy o Permissions-Policy.
- **Impacto:** menor defensa en profundidad en producción.
- **Estado:** POR VERIFICAR en el proveedor de hosting.

## Controles correctos observados

- `.env` está ignorado y no está versionado.
- No se detectó `service_role` en el frontend.
- Las contraseñas se gestionan exclusivamente mediante Supabase Auth.
- `/admin` espera la restauración de sesión y redirige a login sin usuario.
- RLS está habilitado en las tablas documentadas.
- Lectura pública y escritura autenticada están separadas.
- Uploads desde la UI validan tipo y límite de 6 MB.
- `npm audit` reportó 0 vulnerabilidades conocidas el 2026-08-31.

## Secretos

- Variables locales detectadas: URL de Supabase y clave anónima.
- Los valores no se reprodujeron en esta auditoría.
- `.env.example` es el único archivo relacionado versionado.
- No se identificaron claves privadas o credenciales administrativas versionadas dentro del alcance revisado.

No se afirma que el proyecto sea 100% seguro. No se identificaron vulnerabilidades críticas evidentes dentro del alcance local revisado.
