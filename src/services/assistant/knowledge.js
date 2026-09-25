import { normalizeAssistantText } from './intents.js';

export function isAvailableProduct(product = {}) {
  const state = normalizeAssistantText(product.estado || '');
  return state !== 'oculto' && state !== 'agotado' && product.disponible !== false;
}

function isActivePromotion(promotion = {}, now = new Date()) {
  if (promotion.activa === false || promotion.activo === false) return false;
  const start = promotion.fecha_inicio ? new Date(`${promotion.fecha_inicio}T00:00:00`) : null;
  const end = promotion.fecha_fin ? new Date(`${promotion.fecha_fin}T23:59:59`) : null;
  return (!start || start <= now) && (!end || end >= now);
}

export function buildKnowledgeBase({ business = {}, products = [], promotions = [], content = {}, responses = {}, now } = {}) {
  const availableProducts = products.filter(isAvailableProduct);
  return {
    business,
    content,
    responses,
    products,
    availableProducts,
    categories: [...new Set(availableProducts.map((product) => product.categoria).filter(Boolean))],
    activePromotions: promotions.filter((promotion) => isActivePromotion(promotion, now || new Date())),
  };
}

export function recommendProducts(knowledge, query = '', limit = 3) {
  const normalizedQuery = normalizeAssistantText(query);
  const ignoredWords = new Set(['que', 'una', 'uno', 'los', 'las', 'del', 'por', 'para', 'ver', 'quiero', 'tienen']);
  const queryWords = normalizedQuery.split(' ').filter((word) => word.length >= 3 && !ignoredWords.has(word));
  const matches = knowledge.availableProducts.filter((product) => {
    const searchable = normalizeAssistantText(`${product.nombre || ''} ${product.categoria || ''} ${product.descripcion || ''}`);
    return queryWords.some((word) => searchable.includes(word));
  });
  return (matches.length ? matches : knowledge.availableProducts).slice(0, limit);
}

export function findContextProduct(knowledge, context = {}) {
  if (context.productId === null || context.productId === undefined) return null;
  return knowledge.availableProducts.find((product) => String(product.id) === String(context.productId)) || null;
}
