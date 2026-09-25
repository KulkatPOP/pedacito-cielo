import { createCommercialActions } from './actions.js';
import { detectIntent, detectPurchaseIntent } from './intents.js';
import { buildKnowledgeBase } from './knowledge.js';
import { generateAssistantResponse } from './responses.js';
import { createConversationContext, updateConversationContext } from './memory.js';
import { createAssistantProfile } from './config.js';
import { createSalesFollowUp } from './salesFlow.js';

export const assistantEngine = Object.freeze({
  ask(input = {}) {
    const context = createConversationContext(input.context);
    const intent = detectIntent({ ...input, context });
    const purchaseIntent = detectPurchaseIntent(input);
    const knowledge = buildKnowledgeBase(input);
    const response = generateAssistantResponse({ ...input, context, intent, knowledge });
    const nextContext = updateConversationContext(context, { intent, recommendations: response.recommendations, purchaseIntent });
    const followUp = createSalesFollowUp({ intent, knowledge, recommendations: response.recommendations, purchaseIntent, query: input.query });
    return {
      intent,
      key: input.key || '',
      message: response.message,
      recommendations: response.recommendations,
      followUp,
      purchaseIntent,
      profile: createAssistantProfile(knowledge.business),
      actions: createCommercialActions(intent, knowledge, { context: nextContext, recommendations: response.recommendations, purchaseIntent }),
      context: nextContext,
    };
  },
});

export { ASSISTANT_INTENTS, detectIntent, detectPurchaseIntent, normalizeAssistantText } from './intents.js';
export { buildKnowledgeBase, isAvailableProduct, recommendProducts } from './knowledge.js';
export { createConversationContext, emptyConversationContext, updateConversationContext } from './memory.js';
export { findEditableAnswer } from './faq.js';
export { createAssistantProfile, DEFAULT_ASSISTANT_PROFILE } from './config.js';
export { createSalesFollowUp } from './salesFlow.js';
