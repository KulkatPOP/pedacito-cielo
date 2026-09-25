import business from '../../data/negocio.json';
import content from '../../data/contenido.json';
import modules from '../../data/modulos.json';
import chatbotResponses from '../chatbot/responses.json';

const shortName = business.nombreCorto || business.nombre;
const initials = shortName
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0]?.toUpperCase())
  .join('');

export const siteConfig = Object.freeze({
  business,
  content,
  modules: Object.freeze({ ...modules }),
  chatbotResponses,
  branding: Object.freeze({
    name: business.nombre,
    shortName,
    initials: business.sigla || initials || 'NB',
    logo: business.logo || '',
    heroImage: business.imagen_portada || '',
    colors: Object.freeze({
      primary: business.color_principal,
      secondary: business.color_secundario,
      background: business.color_fondo,
      accent: business.color_destacado,
    }),
  }),
});

export const businessConfig = siteConfig.business;
export const contentConfig = siteConfig.content;
export const chatbotConfig = siteConfig.chatbotResponses;
export const brandingConfig = siteConfig.branding;
export const moduleConfig = siteConfig.modules;

export function isModuleEnabled(moduleName) {
  return moduleConfig[moduleName] !== false;
}
