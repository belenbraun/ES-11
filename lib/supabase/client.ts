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

/**
 * Cliente Supabase para uso en el browser (anon key). Todavía no lo
 * consume ningún componente: Feed/Challenges/Profiles siguen leyendo
 * de lib/data.ts hasta que se conecten las tablas (ver supabase/schema.sql
 * y el roadmap del README). Tira un error explícito recién al llamarlo
 * sin configurar, para no romper el build/dev server sin env vars.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    throw new Error(
      "Supabase no está configurado. Definí NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (ver .env.example).",
    );
  }
  return client;
}
