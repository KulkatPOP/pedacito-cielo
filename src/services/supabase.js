import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigured = Boolean(
  supabaseUrl?.startsWith('https://') && supabaseAnonKey,
);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export function requireSupabase() {
  if (!supabase) throw new Error('Supabase no está configurado. Revisa el archivo .env.');
  return supabase;
}

export async function uploadImage(file, folder = 'productos') {
  if (!file?.type?.startsWith('image/')) throw new Error('Selecciona un archivo de imagen válido.');
  if (file.size > 6 * 1024 * 1024) throw new Error('La imagen no puede superar 6 MB.');
  const client = requireSupabase();
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from('imagenes').upload(path, file, {
    cacheControl: '3600', upsert: false, contentType: file.type,
  });
  if (error) throw error;
  return client.storage.from('imagenes').getPublicUrl(path).data.publicUrl;
}
