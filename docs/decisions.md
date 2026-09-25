# Registro de decisiones

## DEC-001 — Supabase con fallback local

- **Fecha observada:** 2026-08-31.
- **Decisión implementada:** usar Supabase como fuente dinámica y JSON como degradación controlada.
- **Contexto:** el sitio público no debe quedar en blanco ante fallos remotos.
- **Motivo original:** no documentado.
- **Justificación técnica:** mejora disponibilidad y experiencia del cliente.
- **Impacto:** los datos locales pueden diferir temporalmente de Supabase.

## DEC-002 — Autorización mediante RLS

- **Decisión implementada:** lectura pública y escritura limitada por la allowlist `public.administradores` mediante `public.es_administrador()` después de aplicar la migración 002.
- **Motivo original:** no documentado.
- **Impacto:** protege el modelo actual de un único negocio; requiere rediseño para membresías multi-tenant.
- **Estado:** implementado en migración y pendiente de verificación en el proyecto remoto.

## DEC-003 — Precedencia explícita de datos

- **Decisión implementada:** Supabase tiene prioridad; JSON local actúa como recuperación; los defaults completan únicamente ausencias.
- **Impacto:** una respuesta remota vacía se respeta y los datos locales no corrigen silenciosamente valores comerciales remotos.
- **Validación:** cubierta por pruebas unitarias en `tests/data-priority.test.js`.
