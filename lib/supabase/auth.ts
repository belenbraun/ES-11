import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "./client";
import type { FriendProfile } from "../types";

/**
 * Manda el magic link. `emailRedirectTo` apunta al origin actual para
 * que, si se abre en el mismo navegador/PWA desde el que se pidió, la
 * sesión quede activa ahí directamente (ver nota de iOS en el README:
 * si el mail se abre en otra app, la sesión queda en ESA ventana, no
 * en la PWA instalada — es una limitación de Apple, no de esta app).
 */
export async function sendMagicLink(email: string) {
  const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
  const { error } = await getSupabase().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}

export async function signOut() {
  await getSupabase().auth.signOut();
}

/** La fila de `friends` ligada a la sesión actual, si ya se reclamó. */
export async function getMyFriend(): Promise<FriendProfile | null> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data as FriendProfile | null;
}

/**
 * Primera vez que esta sesión entra: intenta "reclamar" una fila de
 * `friends` pre-cargada por Belén con el mismo mail (así se hereda
 * fact/illustration_url/etc. ya cargados). Si no hay ninguna con ese
 * mail, crea una fila nueva con el nombre que puso la persona.
 * Ver las policies "friends: reclamar o editar mi ficha" /
 * "friends: crear mi propio registro" en supabase/schema.sql — las dos
 * validan server-side que auth_user_id quede igual a auth.uid().
 */
export async function claimOrCreateFriend(name: string): Promise<FriendProfile> {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) throw new Error("No hay sesión activa.");

  const claimed = await supabase
    .from("friends")
    .update({ auth_user_id: user.id, name })
    .eq("email", user.email)
    .is("auth_user_id", null)
    .select()
    .maybeSingle();
  if (claimed.error) throw claimed.error;
  if (claimed.data) return claimed.data as FriendProfile;

  const created = await supabase
    .from("friends")
    .insert({ auth_user_id: user.id, email: user.email, name })
    .select()
    .single();
  if (created.error) throw created.error;
  return created.data as FriendProfile;
}

export async function updateMyFicha(patch: Partial<FriendProfile>) {
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No hay sesión activa.");

  const { error } = await supabase.from("friends").update(patch).eq("auth_user_id", user.id);
  if (error) throw error;
}
