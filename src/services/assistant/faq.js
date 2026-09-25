import { normalizeAssistantText } from './intents.js';

export function findEditableAnswer(responses = {}, key = '') {
  const normalizedKey = normalizeAssistantText(key).replace(/\s+/g, '_');
  if (Array.isArray(responses)) {
    const match = responses.find((item) => normalizeAssistantText(item?.clave).replace(/\s+/g, '_') === normalizedKey);
    return match?.respuesta || '';
  }
  return responses?.[key] || responses?.[normalizedKey] || '';
}
