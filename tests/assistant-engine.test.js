import test from 'node:test';
import assert from 'node:assert/strict';
import { ASSISTANT_INTENTS, assistantEngine, detectIntent } from '../src/services/assistant/index.js';

const business = {
  nombre: 'Pedacito de Cielo',
  direccion: 'Quillota 849, Viña del Mar',
  whatsapp: '56941827093',
  horarios: { semana: 'Lunes - Sábado: 09:00 AM a 06:00 PM', domingo: 'Domingos y feriados: 09:00 AM a 03:00 PM' },
  redes: { instagram: 'https://instagram.com/pedacito.cielo1/', facebook: '' },
};
const products = [
  { id: 1, nombre: 'Arepa reina pepiada', categoria: 'Arepas', estado: 'disponible', disponible: true },
  { id: 2, nombre: 'Tequeños', categoria: 'Especiales', estado: 'agotado', disponible: false },
  { id: 3, nombre: 'Producto secreto', categoria: 'Especiales', estado: 'oculto', disponible: true },
  { id: 4, nombre: 'Torta de chocolate', categoria: 'Tortas', disponible: true },
];
const input = { business, products, promotions: [], content: {}, responses: {} };

test('detecta las intenciones principales sin depender de mayúsculas ni tildes', () => {
  assert.equal(detectIntent({ query: '¿Qué productos tienen?' }), ASSISTANT_INTENTS.PRODUCTS);
  assert.equal(detectIntent({ query: '¿A qué hora abren?' }), ASSISTANT_INTENTS.HOURS);
  assert.equal(detectIntent({ query: '¿Dónde están ubicados?' }), ASSISTANT_INTENTS.LOCATION);
  assert.equal(detectIntent({ query: 'Quiero hacer un pedido' }), ASSISTANT_INTENTS.ORDERS);
  assert.equal(detectIntent({ query: '¿Cuál es su Instagram?' }), ASSISTANT_INTENTS.SOCIAL);
});

test('responde horarios usando únicamente la configuración del negocio', () => {
  const result = assistantEngine.ask({ ...input, query: 'horarios' });
  assert.match(result.message, /09:00 AM a 06:00 PM/);
  assert.match(result.message, /09:00 AM a 03:00 PM/);
});

test('recomienda solo productos visibles y disponibles', () => {
  const result = assistantEngine.ask({ ...input, query: 'ver productos' });
  assert.deepEqual(result.recommendations.map((product) => product.id), [1, 4]);
  assert.doesNotMatch(result.message, /Tequeños|secreto/);
});

test('prioriza productos reales de la categoría consultada', () => {
  const result = assistantEngine.ask({ ...input, query: 'Quiero conocer las tortas' });
  assert.deepEqual(result.recommendations.map((product) => product.id), [4]);
});

test('entrega acciones comerciales apropiadas y solo redes configuradas', () => {
  const productResult = assistantEngine.ask({ ...input, query: 'productos' });
  assert.deepEqual(productResult.actions.map((action) => action.type), ['catalog', 'whatsapp']);
  const socialResult = assistantEngine.ask({ ...input, query: 'redes sociales' });
  assert.equal(socialResult.actions.filter((action) => action.type === 'external').length, 1);
  assert.equal(socialResult.actions[0].url, business.redes.instagram);
});

test('informa un estado seguro si no hay productos recomendables', () => {
  const result = assistantEngine.ask({ ...input, products: products.slice(1, 3), query: 'productos' });
  assert.equal(result.recommendations.length, 0);
  assert.match(result.message, /no encuentro productos disponibles/i);
});

test('reconoce sinónimos comerciales avanzados', () => {
  assert.equal(detectIntent({ query: '¿Cuál es el valor?' }), ASSISTANT_INTENTS.PRICES);
  assert.equal(detectIntent({ query: 'Necesito algo para un cumpleaños' }), ASSISTANT_INTENTS.EVENTS);
  assert.equal(detectIntent({ query: '¿Hacen diseños personalizados?' }), ASSISTANT_INTENTS.CUSTOM_PRODUCTS);
  assert.equal(detectIntent({ query: 'Quiero comprar para llevar' }), ASSISTANT_INTENTS.ORDERS);
  assert.equal(detectIntent({ query: '¿Qué menú ofrecen?' }), ASSISTANT_INTENTS.PRODUCTS);
});

test('mantiene contexto comercial durante la conversación actual', () => {
  const firstTurn = assistantEngine.ask({ ...input, query: 'Quiero una torta' });
  assert.equal(firstTurn.intent, ASSISTANT_INTENTS.PRODUCTS);
  assert.equal(firstTurn.context.productId, 4);
  const secondTurn = assistantEngine.ask({ ...input, query: '¿Cuánto cuesta?', context: firstTurn.context });
  assert.equal(secondTurn.intent, ASSISTANT_INTENTS.PRICES);
  assert.match(secondTurn.message, /Torta de chocolate/);
});

test('los eventos usan opciones reales y excluyen productos no disponibles', () => {
  const result = assistantEngine.ask({ ...input, query: 'Necesito algo para un cumpleaños' });
  assert.deepEqual(result.recommendations.map((product) => product.id), [4]);
  assert.doesNotMatch(result.message, /Tequeños|secreto/);
  assert.equal(result.actions[0].type, 'whatsapp');
});

test('la memoria efímera no conserva datos personales ni el texto escrito', () => {
  const result = assistantEngine.ask({ ...input, query: 'Soy Ana, mi correo es ana@example.com y quiero una torta' });
  assert.deepEqual(Object.keys(result.context).sort(), ['category', 'lastIntent', 'productId', 'purchaseIntent', 'stage']);
  assert.doesNotMatch(JSON.stringify(result.context), /Ana|example|correo/i);
});

test('el flujo de compra pregunta por la necesidad y avanza hacia conversión', () => {
  const result = assistantEngine.ask({ ...input, query: 'Quiero una torta' });
  assert.equal(result.purchaseIntent, true);
  assert.equal(result.context.stage, 'conversion');
  assert.match(result.followUp, /catálogo|personalizada/i);
});

test('crea preguntas contextuales usando categorías y productos existentes', () => {
  const bakeryInput = {
    ...input,
    products: [...products, { id: 5, nombre: 'Pan campesino', categoria: 'Panadería', disponible: true }],
  };
  const bakeryResult = assistantEngine.ask({ ...bakeryInput, query: 'muéstrame pan' });
  assert.match(bakeryResult.followUp, /Panadería/);
  const generalResult = assistantEngine.ask({ ...input, query: 'ver productos' });
  assert.match(generalResult.followUp, /Arepas|Tortas/);
});

test('el mensaje de WhatsApp incluye negocio, producto e intención sin datos personales', () => {
  const result = assistantEngine.ask({ ...input, query: 'Quiero reservar una torta' });
  const action = result.actions.find((item) => item.type === 'whatsapp');
  assert.match(action.message, /Pedacito de Cielo/);
  assert.match(action.message, /Torta de chocolate/);
  assert.match(action.message, /pedido|consultar/);
  assert.doesNotMatch(action.message, /nombre|correo|teléfono/i);
});

test('el flujo vendedor no recomienda agotados y mantiene privacidad', () => {
  const result = assistantEngine.ask({ ...input, query: 'Quiero encargar tequeños' });
  assert.doesNotMatch(JSON.stringify(result.recommendations), /Tequeños/);
  assert.doesNotMatch(JSON.stringify(result.context), /Quiero|tequeños/i);
});

test('expone una configuración compatible para nombre, tono y objetivo', () => {
  const result = assistantEngine.ask({ ...input, query: 'productos' });
  assert.deepEqual(Object.keys(result.profile).sort(), ['name', 'objective', 'tone']);
  assert.equal(result.profile.name, 'Cielito');
});
