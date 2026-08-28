import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, supabaseConfigured } from '../services/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!supabase) { setLoading(false); return undefined; }

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.warn('No se pudo restaurar la sesión:', error.message);
        setUser(data?.session?.user ?? null);
      })
      .catch((error) => console.warn('Error de autenticación:', error.message))
      .finally(() => { if (active) setLoading(false); });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) { setUser(session?.user ?? null); setLoading(false); }
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  const value = useMemo(() => ({
    user, loading, configured: supabaseConfigured,
    signIn: async (email, password) => {
      if (!supabase) return { error: new Error('Supabase no está configurado. Completa el archivo .env.') };
      return supabase.auth.signInWithPassword({ email: email.trim(), password });
    },
    updateEmail: async (email) => {
      if (!supabase) return { data: null, error: new Error('Supabase no está configurado.') };
      const result = await supabase.auth.updateUser({ email: email.trim() });
      if (result.data?.user) setUser(result.data.user);
      return result;
    },
    updatePassword: async (password) => {
      if (!supabase) return { data: null, error: new Error('Supabase no está configurado.') };
      const result = await supabase.auth.updateUser({ password });
      if (result.data?.user) setUser(result.data.user);
      return result;
    },
    signOut: async () => {
      if (!supabase) {
        setUser(null);
        return { error: null };
      }
      const result = await supabase.auth.signOut();
      if (!result.error) setUser(null);
      return result;
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  return context;
}
