import { ASSISTANT_INTENTS } from './intents.js';

const whatsappAction = (business, message) => ({
  type: 'whatsapp',
  label: 'Escribir por WhatsApp',
  message: `Hola ${business.nombre || 'Pedacito de Cielo'}, ${message}`,
});

const productForAction = (knowledge, context, recommendations) => recommendations[0]
  || knowledge.availableProducts.find((product) => String(product.id) === String(context.productId));

const commercialMessage = (business, intent, product) => {
  const productReference = product?.nombre ? ` por ${product.nombre}` : '';
  const intention = intent === ASSISTANT_INTENTS.EVENTS ? 'para una celebración'
    : intent === ASSISTANT_INTENTS.CUSTOM_PRODUCTS ? 'sobre una preparación personalizada'
      : intent === ASSISTANT_INTENTS.PRICES ? 'para confirmar precio y disponibilidad'
        : 'para hacer un pedido';
  return `quisiera consultar${productReference} ${intention}.`;
};

export function createCommercialActions(intent, knowledge, { context = {}, recommendations = [], purchaseIntent = false } = {}) {
  const { business } = knowledge;
  const product = productForAction(knowledge, context, recommendations);
  if (intent === ASSISTANT_INTENTS.PRODUCTS || intent === ASSISTANT_INTENTS.PRICES) return [
    { type: 'catalog', label: 'Ver catálogo' },
    whatsappAction(business, purchaseIntent || product ? commercialMessage(business, intent, product) : 'quisiera consultar por los productos disponibles.'),
  ];
  if (intent === ASSISTANT_INTENTS.EVENTS || intent === ASSISTANT_INTENTS.CUSTOM_PRODUCTS) return [
    whatsappAction(business, commercialMessage(business, intent, product)),
    { type: 'catalog', label: 'Ver opciones del catálogo' },
  ];
  if (intent === ASSISTANT_INTENTS.ORDERS) return [
    whatsappAction(business, commercialMessage(business, intent, product)),
    { type: 'catalog', label: 'Revisar catálogo' },
  ];
  if (intent === ASSISTANT_INTENTS.LOCATION) return [
    { type: 'map', label: 'Abrir en Google Maps' },
    whatsappAction(business, 'necesito ayuda para llegar al local.'),
  ];
  if (intent === ASSISTANT_INTENTS.SOCIAL) {
    const socialActions = Object.entries(business.redes || {})
      .filter(([, url]) => typeof url === 'string' && /^https?:\/\//.test(url))
      .map(([network, url]) => ({ type: 'external', label: `Visitar ${network[0].toUpperCase()}${network.slice(1)}`, url }));
    return [...socialActions, whatsappAction(business, 'quisiera hacer una consulta.')];
  }
  if (intent === ASSISTANT_INTENTS.HOURS) return [whatsappAction(business, 'quisiera consultar disponibilidad y hacer un pedido.')];
  return [
    { type: 'catalog', label: 'Ver catálogo' },
    whatsappAction(business, 'necesito ayuda con mi consulta.'),
  ];
}
