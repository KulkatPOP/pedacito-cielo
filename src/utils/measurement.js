export const MEASUREMENT_EVENTS = Object.freeze({
  WHATSAPP_CLICK: 'whatsapp_click',
  CATALOG_CLICK: 'catalog_click',
  CHATBOT_OPEN: 'chatbot_open',
});

export function trackEvent(name, details = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('pedacito:measurement', {
    detail: { name, ...details },
  }));
}
