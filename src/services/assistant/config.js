export const DEFAULT_ASSISTANT_PROFILE = Object.freeze({
  name: 'Cielito',
  tone: 'cercano, amable y profesional',
  objective: 'orientar al cliente hacia productos reales y facilitar su contacto con el negocio',
});

export function createAssistantProfile(business = {}) {
  return {
    name: business.chatbot_nombre?.trim() || DEFAULT_ASSISTANT_PROFILE.name,
    tone: business.chatbot_tono?.trim() || DEFAULT_ASSISTANT_PROFILE.tone,
    objective: business.chatbot_objetivo?.trim() || DEFAULT_ASSISTANT_PROFILE.objective,
  };
}
