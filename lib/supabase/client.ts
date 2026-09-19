import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  client = createClient(supabaseUrl, supabaseAnonKey);
} else if (typeof window !== "undefined") {
  console.warn(
    "Supabase no está configurado — definí NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local",
  );
}

/** true si hay proyecto de Supabase conectado (env vars presentes). */
export function isSupabaseConfigured(): boolean {
  return client !== null;
}

/**
 * Cliente Supabase "de sesión" para uso en el browser (anon key + la
 * sesión de auth de quien está logueada). Todo lo autenticado —leer/
 * editar mi ficha, postear en `posts`, subir fotos— pasa por acá.
 *
 * Para "spill the tea"/premios NO se usa este cliente — ver
 * lib/supabase/anonClient.ts, que nunca tiene una sesión asociada.
 *
 * Tira un error explícito recién al llamarlo sin configurar, para no
 * romper el build/dev server sin env vars.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    throw new Error(
      "Supabase no está configurado. Definí NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (ver .env.example).",
    );
  }
  return client;
}
