export type FeedItemType = "onthisday" | "challenge" | "chisme";

export interface FeedItem {
  type: FeedItemType;
  author: string;
  when: string;
  text: string;
  cta?: string;
  reactions?: string;
}

export type PilarId =
  | "diario"
  | "recomendaciones"
  | "cringe"
  | "tea"
  | "carta"
  | "premio"
  // propuestas nuevas (ver lib/activities.ts) — todavía no confirmadas con la usuaria.
  | "encuesta"
  | "capsula"
  | "playlist";

export interface Activity {
  id: PilarId;
  dia: string;
  tag: string;
  emoji: string;
  desc: string;
  ejemplos: string[];
  /** Va por el circuito anónimo (spill the tea / premios): sin autor, sin tracking. */
  anonimo: boolean;
  /** Actividad que LA GOTA propone sumar, todavía no confirmada. */
  proposed?: boolean;
}

export type TabKey = "feed" | "profile" | "pussies" | "sumar";

/** Ficha editable de cada una — se puede completar/actualizar en cualquier momento desde "Mi Perfil". */
export interface ProfileFicha {
  apodo?: string;
  hijos?: string;
  palabra?: string;
  secreto?: string;
  electro?: string;
  favorita?: string;
  random?: string;
}

/**
 * Fila real de `friends` en Supabase (una vez conectado). Nombres de
 * columna en snake_case a propósito, tal cual vienen del cliente de
 * Supabase — evita una capa de mapeo para un esqueleto que todavía va
 * a cambiar de forma varias veces.
 */
export interface FriendProfile {
  id: string;
  auth_user_id: string | null;
  name: string | null;
  email: string | null;
  fact: string | null;
  illustration_url: string | null;
  apodo: string | null;
  hijos: string | null;
  palabra: string | null;
  secreto: string | null;
  electro: string | null;
  favorita: string | null;
  random_fact: string | null;
}

/** Fila real de `posts` (pilares con autor, no anónimos). */
export interface PostRecord {
  id: string;
  pillar: PilarId;
  author_id: string | null;
  author_name: string | null;
  text_content: string | null;
  media_url: string | null;
  recipient_id: string | null;
  reactions: Record<string, unknown>;
  created_at: string;
}

/** Fila real de `anon_posts` (spill the tea / premios) — sin autor. */
export interface AnonPostRecord {
  id: string;
  pillar: PilarId;
  categoria: string | null;
  text_content: string;
  posted_on: string;
  created_at: string;
}
