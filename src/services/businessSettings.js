import { requireSupabase, supabase } from './supabase.js';
import { businessConfig, contentConfig } from '../config/siteConfig.js';
import { mergeSources } from '../utils/dataPriority.js';

export const defaultSettings = {
  id: 1,
  nombre: businessConfig.nombre,
  descripcion: businessConfig.descripcion,
  propuesta_nombre: businessConfig.propuesta_nombre,
  frase_marca: businessConfig.frase_marca,
  slogan: businessConfig.slogan || `${businessConfig.hero_titulo} ${businessConfig.hero_destacado}`,
  descripcion_cultural: businessConfig.descripcion_cultural,
  mensaje_bienvenida: businessConfig.mensaje_bienvenida,
  hero_titulo: businessConfig.hero_titulo, hero_destacado: businessConfig.hero_destacado,
  historia: businessConfig.historia || '', historia_venezolana: businessConfig.historia_venezolana || '', categorias_destacadas: businessConfig.categorias_destacadas,
  logo: businessConfig.logo || '', imagen_portada: businessConfig.imagen_portada, whatsapp: businessConfig.whatsapp, telefono: businessConfig.telefono,
  direccion: businessConfig.direccion, horario_semana: businessConfig.horarios.semana, horario_domingo: businessConfig.horarios.domingo,
  instagram: businessConfig.redes.instagram, facebook: businessConfig.redes.facebook, tiktok: businessConfig.redes.tiktok || '',
  color_principal: businessConfig.color_principal, color_secundario: businessConfig.color_secundario,
  color_fondo: businessConfig.color_fondo, color_destacado: businessConfig.color_destacado,
  galeria_productos: '[]', galeria_local: '[]', galeria_promociones: '[]',
  contenido_pagina: contentConfig,
  chatbot_nombre: businessConfig.chatbot_nombre,
  chatbot_mensaje: businessConfig.chatbot_mensaje,
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
      contenido_pagina: mergeSources({ remote: result.data.contenido_pagina, fallback: contentConfig }),
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
