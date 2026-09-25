const EMPTY_CONTEXT = Object.freeze({ lastIntent: '', productId: null, category: '', stage: 'discovery', purchaseIntent: false });

export function createConversationContext(value = {}) {
  return {
    lastIntent: typeof value.lastIntent === 'string' ? value.lastIntent : '',
    productId: ['string', 'number'].includes(typeof value.productId) ? value.productId : null,
    category: typeof value.category === 'string' ? value.category : '',
    stage: ['discovery', 'consideration', 'conversion'].includes(value.stage) ? value.stage : 'discovery',
    purchaseIntent: value.purchaseIntent === true,
  };
}

export function updateConversationContext(context, { intent, recommendations = [], purchaseIntent = false } = {}) {
  const previous = createConversationContext(context);
  const firstProduct = recommendations[0];
  return {
    lastIntent: intent || previous.lastIntent,
    productId: firstProduct?.id ?? previous.productId,
    category: firstProduct?.categoria || previous.category,
    stage: purchaseIntent ? 'conversion' : recommendations.length ? 'consideration' : previous.stage,
    purchaseIntent: purchaseIntent || previous.purchaseIntent,
  };
}

export function emptyConversationContext() {
  return { ...EMPTY_CONTEXT };
}
