export const MEASUREMENT_EVENTS = Object.freeze({
  WHATSAPP_CLICK: 'whatsapp_click',
  CATALOG_CLICK: 'catalog_click',
  CHATBOT_OPEN: 'chatbot_open',
  CHATBOT_QUESTION: 'chatbot_question',
  CHATBOT_PURCHASE_INTENT: 'chatbot_purchase_intent',
});

export const MEASUREMENT_EVENT_SIGNAL = 'pedacito:measurement';
const STORAGE_KEY = 'pedacito:analytics:v1';
const MAX_EVENTS = 1000;
const allowedEvents = new Set(Object.values(MEASUREMENT_EVENTS));
const allowedDetails = new Set(['location', 'productId', 'productName', 'category', 'questionKey']);

function cleanDetails(details) {
  return Object.fromEntries(Object.entries(details)
    .filter(([key, value]) => allowedDetails.has(key) && ['string', 'number'].includes(typeof value))
    .map(([key, value]) => [key, String(value).slice(0, 120)]));
}

export function readMeasurementEvents() {
  if (typeof window === 'undefined') return [];
  try {
    const events = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(events) ? events.filter(event => allowedEvents.has(event.name) && Number.isFinite(event.timestamp)) : [];
  } catch {
    return [];
  }
}

export function trackEvent(name, details = {}) {
  if (typeof window === 'undefined' || !allowedEvents.has(name)) return;
  const event = { name, timestamp: Date.now(), ...cleanDetails(details) };
  try {
    const events = [...readMeasurementEvents(), event].slice(-MAX_EVENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // La medición sigue funcionando en memoria aunque el navegador bloquee el almacenamiento local.
  }
  window.dispatchEvent(new CustomEvent(MEASUREMENT_EVENT_SIGNAL, { detail: event }));
}
