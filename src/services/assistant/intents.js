export const ASSISTANT_INTENTS = Object.freeze({
  PRODUCTS: 'products',
  ORDERS: 'orders',
  PRICES: 'prices',
  HOURS: 'hours',
  LOCATION: 'location',
  SOCIAL: 'social',
  EVENTS: 'events',
  CUSTOM_PRODUCTS: 'custom_products',
  GENERAL: 'general',
});

export function normalizeAssistantText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const intentPatterns = [
  [ASSISTANT_INTENTS.PRICES, /\b(precios?|cuesta|cuestan|valor|valores|cuanto|cotizar|cotizacion)\b/],
  [ASSISTANT_INTENTS.CUSTOM_PRODUCTS, /\b(personalizad|especial|a medida|diseno|encargo especial)\w*\b/],
  [ASSISTANT_INTENTS.EVENTS, /\b(cumpleanos|cumple|celebracion|celebraciones|evento|eventos|fiesta|aniversario|bautizo|matrimonio)\b/],
  [ASSISTANT_INTENTS.HOURS, /\b(horarios?|hora|abren|abierto|abiertos|cierran|atienden|atencion|domingo|feriado)\b/],
  [ASSISTANT_INTENTS.LOCATION, /\b(direccion|ubicacion|ubicados?|donde|llegar|mapa|local|queda|encuentran)\b/],
  [ASSISTANT_INTENTS.SOCIAL, /\b(instagram|facebook|tiktok|redes?|contacto)\b/],
  [ASSISTANT_INTENTS.PRODUCTS, /\b(producto|catalogo|menu|opciones|ofrecen|venden|recomiend|antojo|arepa|tequeno|cachapa|torta|pan|pasteleria|venezolan)\w*\b/],
  [ASSISTANT_INTENTS.ORDERS, /\b(pedido|pedir|comprar|compra|llevar|quiero|reservar|reserva|encargar|ordenar|whatsapp)\w*\b/],
];

export function detectIntent({ query = '', key = '', context = {} } = {}) {
  const text = normalizeAssistantText(`${key} ${query}`);
  for (const [intent, pattern] of intentPatterns) {
    if (pattern.test(text)) return intent;
  }
  if (/\b(ese|esa|eso|este|esta|cuanto|disponible|pedirlo|pedirla)\b/.test(text) && context.lastIntent) return context.lastIntent;
  return ASSISTANT_INTENTS.GENERAL;
}

export function detectPurchaseIntent({ query = '', key = '' } = {}) {
  const text = normalizeAssistantText(`${key} ${query}`);
  return /\b(comprar|compra|pedido|pedir|reservar|reserva|encargar|encargo|ordenar|llevar)\w*\b/.test(text)
    || (/\bquiero\b/.test(text) && /\b(producto|arepa|tequeno|cachapa|torta|pan|pastel|desayuno)\w*\b/.test(text));
}
