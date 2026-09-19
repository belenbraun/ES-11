import { getSupabase } from "./client";
import type { FriendProfile } from "../types";

/** Las 22 (o las que ya se hayan sumado) para el grid de "Pussies" y el selector de "Carta a una pussie". */
export async function fetchAllFriends(): Promise<FriendProfile[]> {
  const { data, error } = await getSupabase().from("friends").select("*").order("name");
  if (error) throw error;
  return (data || []) as FriendProfile[];
}

/**
 * Busca una fila pre-cargada por Belén con este mail, ANTES de reclamarla
 * (la policy de select es abierta al grupo, así que esto funciona incluso
 * sin auth_user_id todavía seteado). Sirve para saber si hay que
 * preguntar el nombre o si ya viene cargado de antes.
 */
export async function findFriendByEmail(email: string): Promise<FriendProfile | null> {
  const { data, error } = await getSupabase()
    .from("friends")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data as FriendProfile | null;
}
