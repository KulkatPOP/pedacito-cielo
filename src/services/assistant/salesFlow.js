import { ASSISTANT_INTENTS, normalizeAssistantText } from './intents.js';

const productText = (product = {}) => normalizeAssistantText(`${product.nombre || ''} ${product.categoria || ''} ${product.descripcion || ''}`);

export function createSalesFollowUp({ intent, knowledge, recommendations = [], purchaseIntent = false, query = '' }) {
  const firstProduct = recommendations[0];
  const recommendationText = recommendations.map(productText).join(' ');
  const normalizedQuery = normalizeAssistantText(query);

  if (intent === ASSISTANT_INTENTS.EVENTS) return '¿Buscas una opción para cumpleaños, celebración u otra ocasión especial?';
  if (intent === ASSISTANT_INTENTS.CUSTOM_PRODUCTS) return '¿Qué tipo de preparación personalizada necesitas consultar?';
  if (/torta|pastel/.test(normalizedQuery) && /torta/.test(recommendationText)) return '¿Buscas una torta del catálogo o una opción personalizada para una celebración?';
  if (/pan|panaderia/.test(normalizedQuery) && firstProduct?.categoria && /panaderia|pan/.test(productText(firstProduct))) return `¿Qué producto de ${firstProduct.categoria} te gustaría consultar?`;
  if (purchaseIntent && firstProduct) return `¿Quieres confirmar por WhatsApp la disponibilidad de ${firstProduct.nombre}?`;
  if (intent === ASSISTANT_INTENTS.ORDERS && knowledge.categories.length) return `¿Qué te gustaría pedir? Tenemos opciones en ${knowledge.categories.join(', ')}.`;
  if (intent === ASSISTANT_INTENTS.PRODUCTS && knowledge.categories.length) return `¿Qué categoría prefieres: ${knowledge.categories.join(', ')}?`;
  return '';
}
