import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase.js';
import { getBusinessSettings } from '../services/businessSettings.js';
import localProducts from '../../data/productos.json';
import localBusiness from '../../data/negocio.json';
import localResponses from '../chatbot/responses.json';
import localContent from '../../data/contenido.json';

const fallback = { productos: localProducts, negocio: localBusiness, contenido: localContent, responses: localResponses, promociones: [] };
const normalize = (product) => {
  const isArepa = product.nombre?.toLowerCase().includes('arepa');
  return {
    ...product,
    nombre: isArepa && !product.nombre.toLowerCase().includes('venezolana') ? `Arepa venezolana · ${product.nombre.replace(/^arepa\s*/i, '')}` : product.nombre,
    descripcion: isArepa ? (product.descripcion || 'Tradicional preparación venezolana hecha con masa de maíz.') : product.descripcion,
    precio: typeof product.precio === 'number' ? `$${product.precio.toLocaleString('es-CL')}` : product.precio,
    categoria: isArepa ? '🇻🇪 Productos venezolanos' : product.categorias?.nombre || product.categoria || 'Especialidades',
  };
};

function withTimeout(promise, milliseconds = 7000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Tiempo de conexión agotado')), milliseconds)),
  ]);
}

export default function useSiteData() {
  const [data, setData] = useState({ ...fallback, loading: false, source: 'local' });

  useEffect(() => {
    let active = true;
    if (!supabase) return undefined;

    const load = async () => {
      try {
        const [products, config, promotions, answers] = await withTimeout(Promise.all([
          supabase.from('productos').select('*, categorias(nombre)').order('created_at'),
          getBusinessSettings(),
          supabase.from('promociones').select('*').eq('activa', true).order('fecha', { ascending: false }),
          supabase.from('respuestas_chatbot').select('*'),
        ]));

        const hasError = [products, promotions, answers].some((result) => result.error);
        if (hasError) throw new Error('La información remota no está disponible.');
        const business = config.data ? {
          ...localBusiness, ...config.data,
          horarios: { semana: config.data.horario_semana || localBusiness.horarios.semana, domingo: config.data.horario_domingo || localBusiness.horarios.domingo },
          redes: { instagram: config.data.instagram || '', facebook: config.data.facebook || '', tiktok: config.data.tiktok || '' },
        } : localBusiness;

        if (active) setData({
          productos: products.data?.length ? products.data.map(normalize) : localProducts,
          negocio: business,
          contenido: { ...localContent, ...(config.data?.contenido_pagina || {}) },
          promociones: promotions.data || [],
          responses: {
            ...Object.fromEntries(Object.entries(localResponses).map(([key, value]) => [key.trim().toLowerCase(), value])),
            ...Object.fromEntries((answers.data || []).map((item) => [item.clave.trim().toLowerCase(), item.respuesta])),
          },
          loading: false, source: 'supabase',
        });
      } catch (error) {
        console.warn('Se utilizaron datos locales:', error.message);
        if (active) setData({ ...fallback, loading: false, source: 'local' });
      }
    };
    load();
    const channel = supabase.channel('contenido-publico')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'configuracion' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promociones' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'respuestas_chatbot' }, load)
      .subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, []);

  return data;
}
