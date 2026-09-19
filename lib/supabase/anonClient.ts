import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let anonClient: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  // Instancia SEPARADA de getSupabase(): nunca llama a signIn/setSession,
  // no persiste ni lee ninguna sesión del storage, y no refresca tokens.
  // Cada request que hace sale con la anon key y nada más — ningún JWT
  // que identifique a la persona logueada viaja en un insert a
  // `anon_posts`. Es la mitad técnica del anonimato real que pide el
  // brief para spill-the-tea/premios (la otra mitad es que la tabla no
  // tiene columna de autor — ver supabase/schema.sql).
  anonClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function getAnonSupabase(): SupabaseClient {
  if (!anonClient) {
    throw new Error(
      "Supabase no está configurado. Definí NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (ver .env.example).",
    );
  }
  return anonClient;
}
