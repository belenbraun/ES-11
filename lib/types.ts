export type FeedItemType = "onthisday" | "challenge" | "chisme";

export interface FeedItem {
  type: FeedItemType;
  author: string;
  when: string;
  text: string;
  cta?: string;
  reactions?: string;
}

export interface Friend {
  name: string;
  fact?: string;
  /** Ilustración estilo Pascualina/agenda — todavía solo la tiene Belu de muestra. */
  illustrationUrl?: string;
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
