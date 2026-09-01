# Registro de decisiones

## DEC-001 — Supabase con fallback local

- **Fecha observada:** 2026-08-31.
- **Decisión implementada:** usar Supabase como fuente dinámica y JSON como degradación controlada.
- **Contexto:** el sitio público no debe quedar en blanco ante fallos remotos.
- **Motivo original:** no documentado.
- **Justificación técnica:** mejora disponibilidad y experiencia del cliente.
- **Impacto:** los datos locales pueden diferir temporalmente de Supabase.

## DEC-002 — Autorización mediante RLS

- **Decisión implementada:** lectura pública y escritura para `authenticated`.
- **Motivo original:** no documentado.
- **Impacto:** simple para un único administrador, pero requiere endurecimiento si existen más usuarios o registro público.
- **Estado:** requiere confirmar el modelo de cuentas.

