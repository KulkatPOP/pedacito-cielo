# Guía de mantenimiento

## Orden de fuentes de datos

La prioridad oficial es:

1. Supabase, cuando la consulta termina correctamente.
2. JSON local, cuando Supabase no está configurado, falla o supera el timeout.
3. Valores predeterminados del código, únicamente para completar campos ausentes.

Una respuesta remota válida con cero productos o promociones no debe sustituirse por datos locales. Los objetos anidados de contenido se combinan por campo; Supabase conserva prioridad y el respaldo completa claves ausentes.

## Cambios de contenido

- Actualiza primero el CMS/Supabase.
- Replica en JSON solamente los datos críticos que deban estar disponibles durante una caída.
- Comprueba el modo fallback desconectando temporalmente las variables en un entorno local separado.
- No introduzcas excepciones por valores comerciales concretos dentro de hooks o componentes.

## Flujo mínimo antes de entregar

```bash
npm install
npm test
npm run build
npm audit --omit=dev
```

Después verifica manualmente `/`, `/admin/login`, `/admin`, catálogo, WhatsApp, chatbot y los tres tamaños responsive principales.

## Cambios de base de datos

- Crea siempre una migración nueva, aditiva e idempotente.
- No edites una migración que ya pudo aplicarse.
- No desactives RLS.
- Ejecuta primero en un proyecto de prueba y documenta rollback o recuperación.
- Mantén `002_restringir_administradores_rls.sql` como requisito obligatorio de seguridad.

## Componentes grandes

`BakerySite.jsx` y `Admin.jsx` deben dividirse únicamente con pruebas de regresión disponibles. La separación futura sugerida es por dominio: catálogo, contacto, chatbot, productos administrativos, promociones y configuración.
