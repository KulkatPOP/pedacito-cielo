import { requireSupabase, supabase } from './supabase.js';
import localContent from '../../data/contenido.json';
import { mergeSources } from '../utils/dataPriority.js';

export const defaultSettings = {
  id: 1,
  nombre: 'Pedacito de Cielo',
  descripcion: 'Panadería venezolana artesanal con sabores que reúnen a la familia.',
  propuesta_nombre: 'Sabores venezolanos hechos con cariño',
  frase_marca: 'Un pedacito de Venezuela',
  slogan: 'Un pedacito de Venezuela en cada bocado',
  descripcion_cultural: 'Compartimos recetas tradicionales venezolanas, sabores familiares y preparaciones hechas con dedicación.',
  mensaje_bienvenida: 'Ven a disfrutar preparaciones frescas, tradición venezolana y la calidez de nuestra mesa.',
  hero_titulo: 'Un pedacito de Venezuela', hero_destacado: 'en cada bocado.',
  historia: '', historia_venezolana: '', categorias_destacadas: 'Arepas,Tequeños,Cachapas,Empanadas venezolanas,Pan de jamón,Golfeados',
  logo: '', imagen_portada: '/images/productos/venezolanos/arepa.jpg', whatsapp: '', telefono: '',
  direccion: '', horario_semana: '', horario_domingo: '',
  instagram: '', facebook: '', tiktok: '',
  color_principal: '#173a5e', color_secundario: '#c94a3a',
  color_fondo: '#fff8e8', color_destacado: '#e7b83f',
  galeria_productos: '[]', galeria_local: '[]', galeria_promociones: '[]',
  contenido_pagina: localContent,
  chatbot_nombre: 'Cielito',
  chatbot_mensaje: '¡Hola! Soy Cielito ☁️ Puedo ayudarte a conocer nuestros sabores venezolanos, productos disponibles y realizar tu pedido.',
};

export async function getBusinessSettings() {
  if (!supabase) return { data: null, source: 'local', error: null };
  const result = await supabase.from('configuracion').select('*').eq('id', 1).maybeSingle();
  if (result.error) return { data: null, source: 'local', error: result.error };
  const legacyHero = result.data?.hero_titulo === 'Hay momentos que saben a';
  return {
    data: result.data ? {
      ...result.data,
      hero_titulo: legacyHero ? defaultSettings.hero_titulo : result.data.hero_titulo || defaultSettings.hero_titulo,
      hero_destacado: legacyHero ? defaultSettings.hero_destacado : result.data.hero_destacado || defaultSettings.hero_destacado,
      imagen_portada: result.data.imagen_portada || result.data.hero_imagen || defaultSettings.imagen_portada,
      contenido_pagina: mergeSources({ remote: result.data.contenido_pagina, fallback: localContent }),
    } : null,
    source: 'configuracion',
    error: null,
  };
}

export async function saveBusinessSettings(settings) {
  const client = requireSupabase();
  const allowedFields = [
    'id', 'nombre', 'descripcion', 'propuesta_nombre', 'frase_marca', 'slogan', 'descripcion_cultural',
    'mensaje_bienvenida', 'hero_titulo', 'hero_destacado', 'historia',
    'historia_venezolana', 'categorias_destacadas', 'logo', 'imagen_portada',
    'whatsapp', 'telefono', 'direccion', 'horario_semana', 'horario_domingo',
    'instagram', 'facebook', 'tiktok', 'color_principal', 'color_secundario', 'color_fondo', 'color_destacado',
    'galeria_productos', 'galeria_local', 'galeria_promociones',
    'contenido_pagina',
    'chatbot_nombre', 'chatbot_mensaje',
  ];
  const merged = { ...defaultSettings, ...settings, id: 1 };
  const payload = Object.fromEntries(allowedFields.map((field) => [field, merged[field]]));
  payload.updated_at = new Date().toISOString();
  const { data, error } = await client
    .from('configuracion')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();
  if (error) {
    const message = error.code === 'PGRST204'
      ? 'Falta aplicar la migración que amplía la tabla configuracion en Supabase.'
      : error.message;
    throw new Error(message);
  }
  return data;
}
