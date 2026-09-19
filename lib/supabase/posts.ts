import { getSupabase } from "./client";
import { getAnonSupabase } from "./anonClient";
import type { AnonPostRecord, PilarId, PostRecord } from "../types";

const MEDIA_BUCKET = "posts-media";

/** Sube una foto al bucket público y devuelve su URL — solo para pilares NO anónimos. */
export async function uploadPostPhoto(authorId: string, file: File): Promise<string> {
  const supabase = getSupabase();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${authorId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file);
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createPost(input: {
  pillar: PilarId;
  authorId: string;
  authorName: string;
  text: string;
  mediaUrl?: string | null;
  recipientId?: string | null;
}) {
  const supabase = getSupabase();
  const { error } = await supabase.from("posts").insert({
    pillar: input.pillar,
    author_id: input.authorId,
    author_name: input.authorName,
    text_content: input.text,
    media_url: input.mediaUrl || null,
    recipient_id: input.recipientId || null,
  });
  if (error) throw error;
}

/**
 * Insertar en anon_posts usando el cliente SIN sesión (ver
 * lib/supabase/anonClient.ts) — a propósito, para que ni el request en
 * sí lleve algo que identifique a quien lo mandó.
 */
export async function createAnonPost(input: {
  pillar: PilarId;
  text: string;
  categoria?: string | null;
}) {
  const { error } = await getAnonSupabase()
    .from("anon_posts")
    .insert({ pillar: input.pillar, text_content: input.text, categoria: input.categoria || null });
  if (error) throw error;
}

export async function fetchRecentPosts(limit = 20): Promise<PostRecord[]> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as PostRecord[];
}

export async function fetchRecentAnonPosts(limit = 20): Promise<AnonPostRecord[]> {
  const { data, error } = await getSupabase()
    .from("anon_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as AnonPostRecord[];
}
