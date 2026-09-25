import { ASSISTANT_INTENTS, normalizeAssistantText } from './intents.js';
import { findContextProduct, recommendProducts } from './knowledge.js';
import { findEditableAnswer } from './faq.js';

const configuredResponse = (knowledge, key) => {
  const normalizedKey = normalizeAssistantText(key).replace(/\s+/g, '_');
  return findEditableAnswer(knowledge.responses, key) || findEditableAnswer(knowledge.responses, normalizedKey);
};

export function generateAssistantResponse({ intent, key = '', query = '', context = {}, knowledge }) {
  const { business } = knowledge;
  const exactResponse = configuredResponse(knowledge, key);
  if (intent === ASSISTANT_INTENTS.PRODUCTS) {
    const recommendations = recommendProducts(knowledge, `${key} ${query}`);
    if (recommendations.length) {
      const names = recommendations.map((product) => product.nombre).join(', ');
      return { message: `Entre nuestros productos disponibles puedes encontrar ${names}. Revisa el catálogo para conocer sus precios y detalles.`, recommendations };
    }
    return { message: exactResponse || 'Ahora no encuentro productos disponibles publicados. Escríbenos por WhatsApp y confirmamos las opciones del día.', recommendations: [] };
  }
  if (intent === ASSISTANT_INTENTS.PRICES) {
    const contextualProduct = findContextProduct(knowledge, context);
    const recommendations = contextualProduct ? [contextualProduct] : recommendProducts(knowledge, query, 1);
    const product = recommendations[0];
    if (product?.precio) return { message: `${product.nombre} tiene un precio de ${product.precio}. Puedes consultar disponibilidad o hacer tu pedido por WhatsApp.`, recommendations };
    if (product) return { message: `No encuentro un precio publicado para ${product.nombre}. Puedes pedir una cotización por WhatsApp.`, recommendations };
    return { message: 'No encuentro un precio publicado para esa consulta. Puedes revisar el catálogo o pedir una cotización por WhatsApp.', recommendations: [] };
  }
  if (intent === ASSISTANT_INTENTS.EVENTS || intent === ASSISTANT_INTENTS.CUSTOM_PRODUCTS) {
    const search = intent === ASSISTANT_INTENTS.EVENTS ? `${query} torta celebracion personalizada` : `${query} personalizada especial`;
    const recommendations = recommendProducts(knowledge, search).filter((product) => {
      const text = normalizeAssistantText(`${product.nombre} ${product.categoria} ${product.descripcion}`);
      return /torta|personalizad|especial|celebracion/.test(text);
    });
    if (recommendations.length) {
      const names = recommendations.map((product) => product.nombre).join(', ');
      return { message: `Para tu ${intent === ASSISTANT_INTENTS.EVENTS ? 'celebración' : 'pedido personalizado'}, tenemos estas opciones publicadas: ${names}. Cuéntanos los detalles por WhatsApp para confirmar disponibilidad.`, recommendations };
    }
    return { message: exactResponse || 'No encuentro una opción publicada para esa solicitud. Escríbenos por WhatsApp para consultar si podemos prepararla.', recommendations: [] };
  }
  if (intent === ASSISTANT_INTENTS.HOURS) {
    const hours = [business.horarios?.semana, business.horarios?.domingo].filter(Boolean);
    return { message: hours.length ? `Nuestro horario de atención es: ${hours.join('. ')}.` : exactResponse || 'El horario no está disponible en este momento. Puedes confirmarlo por WhatsApp.', recommendations: [] };
  }
  if (intent === ASSISTANT_INTENTS.LOCATION) {
    return { message: business.direccion ? `Nos encuentras en ${business.direccion}. Puedes abrir la ubicación en el mapa para planificar tu visita.` : exactResponse || 'Puedes escribirnos por WhatsApp para confirmar cómo llegar.', recommendations: [] };
  }
  if (intent === ASSISTANT_INTENTS.SOCIAL) {
    const networks = Object.entries(business.redes || {}).filter(([, url]) => url).map(([network]) => network);
    return { message: networks.length ? `Puedes seguirnos en ${networks.join(', ')} y conocer nuestras novedades.` : exactResponse || 'Puedes mantenerte en contacto con nosotros por WhatsApp.', recommendations: [] };
  }
  if (intent === ASSISTANT_INTENTS.ORDERS) {
    return { message: exactResponse || 'Elige lo que te gustaría pedir y escríbenos por WhatsApp. Te ayudaremos a confirmar disponibilidad y retiro.', recommendations: [] };
  }
  return { message: exactResponse || business.descripcion || 'Puedo ayudarte con nuestros productos, pedidos, horarios, ubicación y redes sociales.', recommendations: [] };
}
